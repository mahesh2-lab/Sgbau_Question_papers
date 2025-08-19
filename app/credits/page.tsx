"use client";

import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Clock,
  CheckCircle,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useCredits } from "@/components/credits-context";
import { uploadImage } from "@/lib/uploadimage";

// Package definition moved from payment page
interface PackageInfo {
  id: string;
  name: string;
  credits: number;
  price: number; // INR
  savings?: string;
}

const packages: PackageInfo[] = [
  { id: "starter", name: "Starter", credits: 20, price: 10 },
  { id: "basic", name: "Basic", credits: 50, price: 20, savings: "Save ₹5" },
  {
    id: "premium",
    name: "Premium",
    credits: 120,
    price: 40,
    savings: "Save ₹20",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 300,
    price: 80,
    savings: "Save ₹70",
  },
];

// UPI configuration (can be overridden via env vars)
const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "mahesh.chopade1@ybl"; // receiver VPA
const UPI_NAME = process.env.NEXT_PUBLIC_UPI_NAME || "Mahesh Chopade"; // receiver name

export default function CreditsPage() {
  const searchParams = useSearchParams();
  const { user, isSignedIn, isLoaded } = useUser();

  // Use shared credits context
  const {
    credits: userCredits,
    refreshCredits,
    loading: creditsLoading,
    error: creditsError,
  } = useCredits();
  const [paymentHistory, setPaymentHistory] = useState<
    {
      id: number;
      date: string;
      credits: number;
      amount: number;
      status: string;
      time: string;
    }[]
  >([]);

  // New states from payment page
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(
    null
  );
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(true);
  const [qrError, setQrError] = useState<string | null>(null);
  const [qrObjectUrl, setQrObjectUrl] = useState<string | null>(null);
  const [qrReloadKey, setQrReloadKey] = useState(0);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Credits fetching now handled centrally by context (initial + realtime)
  const handleManualCreditsSync = () => {
    if (!isSignedIn || creditsLoading) return;
    refreshCredits({ force: true }).then(() => {
      toast.success("Credits synced");
    });
  };

  // Handle deep link preselection only (history purely server sourced)
  useEffect(() => {
    const qp = searchParams?.get("pkg");
    const qCredits = searchParams?.get("credits");
    const qPrice = searchParams?.get("price");
    if (qp && qCredits && qPrice) {
      const found = packages.find((p) => p.id === qp);
      if (found) setSelectedPackage(found);
    }
  }, [searchParams]);

  // Fetch payment history from server once user is authenticated
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    let abort = false;
    (async () => {
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        const res = await fetch("/api/paymentHistory", { method: "POST" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (abort) return;
        if (Array.isArray(data)) {
          const mapped = data.map((row: any) => {
            const created = row.created_at
              ? new Date(row.created_at)
              : new Date();
            return {
              id: row.id,
              date: created.toISOString().slice(0, 10),
              credits: row.credits ?? 0,
              amount: row.amount ?? 0,
              status: row.status || "pending",
              time: created.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            } as const;
          });
          setPaymentHistory(mapped);
        }
      } catch (e: any) {
        if (abort) return;
        console.error("Fetch payment history failed", e);
        setHistoryError(e.message || "Failed to load history");
      } finally {
        if (!abort) setHistoryLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [isLoaded, isSignedIn]);

  const refreshHistory = async () => {
    if (!isSignedIn || historyLoading) return;
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch("/api/paymentHistory", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((row: any) => {
          const created = row.created_at
            ? new Date(row.created_at)
            : new Date();
          return {
            id: row.id,
            date: created.toISOString().slice(0, 10),
            credits: row.credits ?? 0,
            amount: row.amount ?? 0,
            status: row.status || "pending",
            time: created.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          } as const;
        });
        setPaymentHistory(mapped);
        toast.success("History synced");
      }
    } catch (e: any) {
      console.error("Refresh history failed", e);
      setHistoryError(e.message || "Failed to refresh history");
      toast.error("Failed to refresh history");
    } finally {
      setHistoryLoading(false);
    }
  };

  // (Removed localStorage persistence for history to keep single source of truth on server)

  const selectPackage = (pkg: PackageInfo) => {
    if (processing) return;
    setSelectedPackage(pkg);
    setSuccess(false);
    setHasScanned(false);
    setRefNumber("");
    setScreenshotData(null);
    setQrLoading(true);
  };

  const qrData = selectedPackage
    ? `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
        UPI_NAME
      )}&am=${selectedPackage.price}&cu=INR`
    : "";
  const qrImageSrc = qrData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
        qrData
      )}`
    : "";

  // Prefetch QR image as blob for smoother load (with abort + retry)
  useEffect(() => {
    if (!qrImageSrc) {
      setQrObjectUrl(null);
      setQrError(null);
      setQrLoading(false);
      return;
    }
    let isMounted = true;
    const controller = new AbortController();
    setQrLoading(true);
    setQrError(null);
    // Revoke previous object URL
    if (qrObjectUrl) {
      URL.revokeObjectURL(qrObjectUrl);
      setQrObjectUrl(null);
    }
    (async () => {
      try {
        const res = await fetch(qrImageSrc, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const blob = await res.blob();
        // Slight delay to allow skeleton perception; optional
        await new Promise((r) => setTimeout(r, 150));
        if (!isMounted) return;
        const url = URL.createObjectURL(blob);
        setQrObjectUrl(url);
        setQrLoading(false);
      } catch (e: any) {
        if (controller.signal.aborted) return; // ignore abort
        if (!isMounted) return;
        setQrError(e?.message || "Failed to load QR");
        setQrLoading(false);
      }
    })();
    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrImageSrc, qrReloadKey]);

  // Reset QR loading when package changes (handles deep-link preselection)
  useEffect(() => {
    if (selectedPackage) setQrLoading(true);
  }, [selectedPackage]);

  const confirmPurchase = async () => {
    if (!selectedPackage || processing || success) return;
    if (!hasScanned) {
      toast.error("Please scan & pay the QR first, then click Confirm Paid.");
      return;
    }
    if (!isSignedIn) {
      toast.error("Please sign in to submit a payment request.");
      return;
    }
    setProcessing(true);
    try {
      const paymentID = (refNumber || "TEMP-" + Date.now()).trim();
      // screenshotData is a data URI (valid URL). If absent send empty string so API converts to undefined.
      const body = {
        userId: user?.id,
        name: user?.fullName || user?.username || "User",
        email: user?.primaryEmailAddress?.emailAddress,
        amount: selectedPackage.price,
        credits: selectedPackage.credits,
        paymentID,
        imgurl: screenshotData || "",
      };
      const res = await fetch("/api/paymentRequest/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Request failed");
      }
      const json = await res.json();
      const data = json.data as {
        id: number;
        amount: number;
        credits: number;
        status: string; // pending
        created_at: string;
      };
      // Don't immediately add credits (status pending). Only append history entry.
      const created = new Date(data.created_at);
      const newEntry = {
        id: data.id,
        date: created.toISOString().slice(0, 10),
        credits: data.credits,
        amount: data.amount,
        status: data.status,
        time: created.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setPaymentHistory((prev) => [newEntry, ...prev]);
      setSuccess(true);
      toast.success("Payment request submitted. Awaiting approval.");
      // Refresh server history to reflect canonical state
      refreshHistory();
    } catch (e: any) {
      console.error("confirmPurchase error", e);
      toast.error(e.message || "Failed to submit payment request");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="premium-credits-page merged-payment text-slate-200">
      <div className=" max-w-[1500px] mx-auto px-4 md:px-6 pb-12">
        {/* Header */}
        <div className="credits-header flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3 min-w-[240px]">
            <div className="credits-icon shrink-0">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="credits-title text-lg font-semibold tracking-tight text-slate-100">
                Your Shiny Credits
              </h1>
            </div>
          </div>
          <div className="flex gap-2 items-center text-[10px] md:text-xs text-emerald-400/90 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" /> Super Secure (Probably)
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[11px] sm:text-xs text-amber-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" />
          <p className="leading-snug">
            Credits may take up to{" "}
            <span className="font-semibold">60 minutes</span> to appear while a
            sleepy human manually verifies things (coffee shortages happen). If
            they still hide after an hour, poke support gently.
          </p>
        </div>

        {/* Responsive grid (desktop unchanged). Mobile order: credits, pricing, checkout */}
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-14 items-start">
          {/* LEFT COLUMN (credits + pricing) */}
          <div className="space-y-8 lg:col-span-8 order-1 lg:order-1">
            <div className="space-y-8">
              {/* Credits */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-600/40 p-5 flex flex-col items-start">
                <div className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {userCredits}
                </div>
                <div className="text-[10px] uppercase tracking-wide text-slate-400 mt-1">
                  Current Hoard
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleManualCreditsSync}
                    disabled={!isSignedIn || creditsLoading}
                    className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition ${
                      creditsLoading
                        ? "border-slate-600/50 text-slate-500 bg-slate-800/50"
                        : "border-slate-600/50 text-slate-300 hover:border-emerald-400/60 hover:text-emerald-300"
                    }`}
                  >
                    {creditsLoading ? "Syncing..." : "Sync"}
                  </button>
                  {creditsError && (
                    <span
                      className="text-[9px] text-rose-400/80 max-w-[140px] truncate"
                      title={creditsError}
                    >
                      {creditsError}
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h2 className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mb-3">
                  Feed The Meter
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {packages.map((pkg) => {
                    const selected = selectedPackage?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => selectPackage(pkg)}
                        className={`h-full text-left p-3.5 rounded-xl border transition relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 flex flex-col gap-1.5 text-xs ${
                          selected
                            ? "border-emerald-500/70 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.5)]"
                            : "border-slate-600/40 bg-slate-800/50 hover:border-indigo-400/70"
                        }`}
                      >
                        {selected && (
                          <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400" />
                        )}
                        <div className="flex items-start justify-between w-full">
                          <span className="font-semibold tracking-wide text-slate-100">
                            {pkg.name}
                          </span>
                          {pkg.savings && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">
                              {pkg.savings}
                            </span>
                          )}
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent tracking-tight">
                          {pkg.credits}
                          <span className="ml-1 text-[10px] font-medium">
                            Cr
                          </span>
                        </div>
                        <div className="mt-auto font-semibold text-indigo-300 text-xs">
                          ₹{pkg.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (checkout) */}
          <div className="lg:col-span-6 order-2 lg:order-2 w-full rounded-2xl p-5 border border-slate-600/40 bg-slate-900/60 flex flex-col min-h-[500px]">
            <h2 className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mb-3">
              Checkout of Destiny
            </h2>
            <div className="mb-5 space-y-1.5 bg-slate-800/60 border border-slate-600/40 rounded-xl p-3 pt-2.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Balance</span>
                <span className="font-semibold text-slate-200">
                  {userCredits} cr
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Package</span>
                <span className="font-semibold text-slate-200">
                  {selectedPackage ? selectedPackage.name : "—"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Credits</span>
                <span className="font-semibold text-slate-200">
                  {selectedPackage ? selectedPackage.credits : "—"}
                </span>
              </div>
              <div className="h-px bg-slate-600/40 my-1" />
              <div className="flex justify-between font-semibold text-slate-300">
                <span>Total Tribute (INR)</span>
                <span className="text-slate-100">
                  ₹{selectedPackage ? selectedPackage.price : 0}
                </span>
              </div>
            </div>

            {!success && selectedPackage && (
              <div className="mb-5 flex flex-col items-center gap-2 rounded-lg border border-slate-600/40 bg-slate-800/60 p-3 w-full text-[10px]">
                <h3 className="text-[9px] font-semibold tracking-wide text-slate-400 uppercase self-start">
                  Scan & Sprinkle Money
                </h3>
                {/* QR Wrapper */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-indigo-500/20 via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition" />
                  <div className="relative bg-slate-900/90 backdrop-blur rounded-md p-2 border border-slate-600/40 flex flex-col items-center gap-1.5 shadow-inner shadow-black/40">
                    {qrLoading ? (
                      <div className="w-40 h-40 rounded-md bg-slate-800/60 animate-pulse flex flex-col items-center justify-center text-[9px] text-slate-500 gap-1 select-none">
                        <span className="inline-block w-4 h-4 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
                        Loading…
                      </div>
                    ) : qrError ? (
                      <div className="w-40 h-40 rounded-md bg-slate-900/70 border border-slate-600/50 flex flex-col items-center justify-center gap-1.5 text-[9px] text-rose-300 p-2 text-center">
                        <span className="font-medium">QR Error</span>
                        <span className="text-rose-400/70 break-all leading-tight line-clamp-3">
                          {qrError}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQrReloadKey((k) => k + 1)}
                          className="px-1.5 py-0.5 rounded-md border border-rose-400/40 text-rose-300 hover:bg-rose-500/10 font-medium text-[9px]"
                        >
                          Retry
                        </button>
                      </div>
                    ) : qrObjectUrl ? (
                      <img
                        className="w-40 h-40 rounded-md shadow-inner shadow-black/40"
                        src={qrObjectUrl}
                        alt={`UPI QR for ₹${selectedPackage.price} to ${UPI_NAME}`}
                        draggable={false}
                      />
                    ) : null}

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1 justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (!qrData) return;
                          navigator.clipboard.writeText(qrData).then(() => {
                            toast.success("UPI link copied");
                          });
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium bg-slate-800/70 border border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/60 text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                        aria-label="Copy UPI link"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      {qrData && (
                        <a
                          href={qrData}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                          aria-label="Open UPI app"
                        >
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-[11px] font-medium text-slate-200">
                  Send ₹{selectedPackage.price}
                </div>
                {/* Reference / Screenshot (Either OR) */}
                <div className="w-full flex flex-col gap-2">
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                      Ref / Txn ID (optional)
                    </label>
                    <input
                      type="text"
                      value={refNumber}
                      onChange={(e) => setRefNumber(e.target.value)}
                      placeholder="Ref / Txn number"
                      className="w-full rounded-md bg-slate-900/70 border border-slate-600/50 focus:border-emerald-400/60 focus:ring-emerald-400/40 focus:outline-none px-2 py-1.5 text-[15 px] placeholder:text-slate-500"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="inline-block bg-slate-800 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-slate-500 rounded-full border border-slate-700/60">
                      OR
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
                      Screenshot Evidence
                    </label>
                    {!screenshotData ? (
                      <label className="flex flex-col items-center justify-center gap-0 cursor-pointer border-2 border-dashed border-slate-600/50 hover:border-slate-500/60 rounded-md p-1.5 text-[9px] text-slate-400 transition h-11 leading-none">
                        <span className="text-slate-300 font-medium text-[15px]">
                          {imageUploading ? (
                            <span className="flex items-center gap-1">
                              <span className="inline-block w-4 h-4 border-2 border-slate-600 border-t-emerald-400 rounded-full animate-spin" />
                              Uploading...
                            </span>
                          ) : (
                            "Drop Proof"
                          )}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setImageUploading(true);
                            const url = await uploadImage(file);
                            if (url) setScreenshotData(url);
                            setImageUploading(false);
                          }}
                        />
                      </label>
                    ) : (
                      <div className="relative group w-full flex justify-center">
                        <img
                          src={screenshotData}
                          alt="Payment proof"
                          className="max-h-24 rounded-md border border-slate-600/50 w-auto"
                        />
                        <button
                          type="button"
                          aria-label="Remove screenshot"
                          onClick={() => setScreenshotData(null)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-slate-900/80 border border-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500 text-center leading-tight">
                    Give us either a Ref ID or a Screenshot – dragons accept
                    both.
                  </p>
                </div>
                <button
                  className={`w-full text-[11px] font-semibold px-3 py-2 rounded-md border transition ${
                    hasScanned
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/25"
                      : refNumber.trim() || screenshotData
                      ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200 hover:bg-indigo-500/25"
                      : "bg-slate-700/40 border-slate-600/40 text-slate-500 cursor-not-allowed"
                  } ${processing ? "opacity-50" : ""}`}
                  onClick={() => {
                    if (processing) return;
                    if (!hasScanned) {
                      if (!refNumber.trim() && !screenshotData) return;
                      setHasScanned(true);
                      toast.success("Marked. Now confirm to add credits.");
                    } else {
                      setHasScanned(false);
                    }
                  }}
                  disabled={
                    processing ||
                    (!hasScanned && !refNumber.trim() && !screenshotData)
                  }
                >
                  {hasScanned
                    ? "Marked! Now Confirm"
                    : "I Have Paid (Pinkie Promise)"}
                </button>
              </div>
            )}
            {success && (
              <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 py-2.5 text-emerald-300 text-[11px] font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Credits Summoned!
              </div>
            )}

            {/* Purchase Button */}
            <div className="mt-auto">
              <button
                onClick={confirmPurchase}
                disabled={
                  !selectedPackage || processing || !hasScanned || success
                }
                className={`w-full py-2.5 px-4 rounded-lg text-[11px] font-semibold transition border ${
                  success
                    ? "bg-emerald-500/30 border-emerald-500/50 text-emerald-300 cursor-not-allowed"
                    : selectedPackage && hasScanned && !processing
                    ? "bg-gradient-to-r from-indigo-600 to-emerald-600 border-indigo-500/60 text-white hover:from-indigo-500 hover:to-emerald-500"
                    : "bg-slate-700/60 border-slate-600/50 text-slate-400 cursor-not-allowed"
                }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : success ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Complete!
                  </div>
                ) : (
                  "Confirm Purchase"
                )}
              </button>
            </div>
          </div>
          {/* HISTORY (moved to bottom; spans full width) */}
          <div className="col-span-full order-3 lg:order-3">
            <h2 className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase mb-3">
              Past Financial Adventures
            </h2>
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={refreshHistory}
                disabled={!isSignedIn || historyLoading}
                className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition ${
                  historyLoading
                    ? "border-slate-600/50 text-slate-500 bg-slate-800/50"
                    : "border-slate-600/50 text-slate-300 hover:border-indigo-400/60 hover:text-indigo-300"
                }`}
              >
                {historyLoading ? "Syncing..." : "Sync History"}
              </button>
              {historyError && (
                <span
                  className="text-[9px] text-rose-400/80 max-w-[160px] truncate"
                  title={historyError}
                >
                  {historyError}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              {paymentHistory.length > 0 ? (
                paymentHistory.slice(0, 8).map((payment, idx) => (
                  <div
                    key={`pay-${payment.id}-${payment.date}-${idx}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-600/40 bg-slate-800/40 p-2.5"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-medium text-slate-100">
                          {payment.credits} Cr
                        </span>
                        <span className="text-xs font-semibold text-indigo-300">
                          ₹{payment.amount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] tracking-wide text-slate-500 mt-0.5">
                        <span>{formatDate(payment.date)}</span>
                        <span>{payment.time}</span>
                        <span
                          className={`hidden sm:inline-block px-1.5 py-0.5 rounded-full border text-[9px] font-semibold ${
                            payment.status === "completed"
                              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              : payment.status === "pending"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : "bg-slate-600/20 text-slate-400 border-slate-500/40"
                          }`}
                        >
                          {payment.status === "completed"
                            ? "Done"
                            : payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 border border-dashed border-slate-600/50 rounded-xl text-slate-500 text-xs">
                  <Clock className="w-7 h-7 mb-1.5 opacity-40" />
                  <p>
                    {historyLoading
                      ? "Loading history..."
                      : "No payment history yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
