"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { useCredits } from "./credits-context";

interface PdfPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfFile: {
    id: string; // changed from number to string to support path/hash ids
    name: string;
    size: string;
    modified: string;
    key: string;
    customMetadata?: Record<string, string> | null;
  } | null;
  userPoints: number; // credits value
  onPointsUpdate: (newCredits: number) => void;
}

export default function PdfPurchaseModal({
  isOpen,
  onClose,
  pdfFile,
  userPoints,
  onPointsUpdate,
}: PdfPurchaseModalProps) {
  const CREDIT_COST = 5;
  const [isProcessing, setIsProcessing] = useState(false);
  const { credits, setCredits } = useCredits();

  // Helper to prettify strings for display (underscores -> spaces)
  const prettify = (v: string | null | undefined) =>
    typeof v === "string" ? v.replace(/_/g, " ") : v;

  // Debug: log incoming pdfFile prop to inspect data passed from home page
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (pdfFile) {
        console.log("[PdfPurchaseModal] Received pdfFile:", pdfFile);
      } else {
        console.log("[PdfPurchaseModal] pdfFile is null");
      }
    }
  }, [pdfFile]);

  const handlePurchase = async () => {
    if (!pdfFile || isProcessing) return;
    if (userPoints < CREDIT_COST) {
      toast.error("You're credit-poor but curiosity-rich. Recharge first.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/credits/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: CREDIT_COST }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((data as any)?.error || "Failed to deduct");
      }
      if (typeof data?.credits === "number") {
        // Update context and parent component with new credits
        setCredits(data.credits);
        // Call parent callback to update points
        // This assumes parent component has a method to handle points update
        onPointsUpdate(data.credits);
      } else {
        // Fallback local update if response shape unexpected
        onPointsUpdate(userPoints - CREDIT_COST);
      }
      // New: request signed download URL and trigger download
      try {
        const dlRes = await fetch(
          `/api/files/download?key=${encodeURIComponent(
            pdfFile.key
          )}&filename=${encodeURIComponent(pdfFile.name)}`
        );
        if (dlRes.ok) {
          const { url } = await dlRes.json();
          if (url) {
            const a = document.createElement("a");
            a.href = url;
            a.download = pdfFile.name || "file.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success(`Scroll unlocked! Downloading: ${pdfFile.name}`);
          } else {
            toast.warning(
              "Could not get download URL (credits already sacrificed)."
            );
          }
        } else {
          const errJson = await dlRes.json().catch(() => null);
          if (errJson?.error) {
            toast.warning(`${errJson.error} (credits already sacrificed)`);
          } else {
            toast.warning("Download portal jammed, credits already gone.");
          }
        }
      } catch (err) {
        console.warn("Download attempt failed", err);
        toast.warning("Arcane transfer failed; credits have departed.");
      }

      onClose();
    } catch (e: any) {
      toast.error(e.message || "The purchase goblin refused.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!pdfFile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm sm:max-w-md p-0 bg-transparent border-none overflow-hidden">
        <div className="pdf-purchase-modal">
          <button className="close-btn" onClick={handleClose}>
            <X className="w-4 h-4" />
          </button>

          {/* PDF Icon - Same as home page */}
          <div className="flex justify-center mb-6">
            <div>
              <Image src="/pdf.png" alt="PDF Icon" width={128} height={100} />
            </div>
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-white mb-2 leading-snug break-words">
            {prettify(pdfFile.name)}
          </h3>
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-4 mb-5 shadow-inner">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:text-xs leading-relaxed">
              <div className="text-slate-400">Size</div>
              <div className="text-slate-200 font-medium">
                {prettify(pdfFile.size)}
              </div>
              <div className="text-slate-400">Modified</div>
              <div className="text-slate-200" title={pdfFile.modified}>
                {prettify(pdfFile.modified)}
              </div>
              <div className="text-slate-400">Key</div>
              <div
                className="text-slate-300 col-span-1 truncate"
                title={pdfFile.key}
              >
                {prettify(pdfFile.key)}
              </div>
            </div>
            {pdfFile.customMetadata &&
              Object.keys(pdfFile.customMetadata).length > 0 && (
                <div className="mt-4">
                  <div className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold mb-2 flex items-center gap-2">
                    <span className="h-px flex-1 bg-slate-600/40" />
                    Details
                    <span className="h-px flex-1 bg-slate-600/40" />
                  </div>
                  <div className="max-h-40 overflow-auto pr-1 custom-scrollbar">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:text-xs">
                      {Object.entries(pdfFile.customMetadata).map(([k, v]) => (
                        <div key={k} className="flex flex-col min-w-0">
                          <dt
                            className="text-slate-400 font-medium truncate"
                            title={k}
                          >
                            {prettify(k)}
                          </dt>
                          <dd
                            className="text-slate-200 truncate font-semibold"
                            title={`${k}: ${v}`}
                          >
                            {prettify(v)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
          </div>

          <div className="popup-actions">
            <Button
              variant="destructive"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleClose}
              type="button"
            >
              Flee
            </Button>
            <Button
              onClick={handlePurchase}
              type="button"
              disabled={userPoints < CREDIT_COST || isProcessing}
              className={`purchase-btn group relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed ${
                userPoints < CREDIT_COST ? "insufficient" : ""
              }`}
            >
              <span className="purchase-btn-bg" aria-hidden />
              <span className="inline-flex items-center gap-2 relative z-10 font-semibold tracking-wide">
                {isProcessing ? (
                  <span className="loader" aria-hidden />
                ) : (
                  <svg
                    className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 3v18" />
                    <path d="M17 8H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                )}
                <span>
                  {isProcessing
                    ? "Conjuring..."
                    : userPoints < CREDIT_COST
                    ? `Need ${CREDIT_COST} Credits`
                    : "Trade Shiny Credits"}
                </span>
                {userPoints >= CREDIT_COST && !isProcessing && (
                  <span
                    className="cost-chip"
                    aria-label={`Cost ${CREDIT_COST} credits`}
                  >
                    -{CREDIT_COST}
                  </span>
                )}
              </span>
              {userPoints >= CREDIT_COST && !isProcessing && (
                <span className="post-balance" title="Balance after purchase">
                  {userPoints - CREDIT_COST}
                </span>
              )}
            </Button>
          </div>
        </div>

        <style jsx>{`
          .pdf-purchase-modal {
            background: linear-gradient(145deg, #16213e, #1a1a2e);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 20px;
            padding: 40px 32px 32px;
            position: relative;
            color: white;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(34, 197, 94, 0.1);
          }

          .close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(30, 30, 46, 0.8);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ef4444;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .close-btn:hover {
            background: rgba(239, 68, 68, 0.1);
            border-color: #ef4444;
            color: #fca5a5;
          }

          .popup-title {
            font-size: 20px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 12px;
            color: #f8fafc;
          }

          .popup-subtitle {
            font-size: 14px;
            color: #94a3b8;
            text-align: center;
            margin-bottom: 32px;
            line-height: 1.4;
          }

          .payment-options {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 32px;
          }

          .payment-option {
            background: rgba(30, 30, 46, 0.6);
            border: 2px solid rgba(71, 85, 105, 0.3);
            border-radius: 12px;
            padding: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            position: relative;
            overflow: hidden;
          }

          .payment-option::before {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(34, 197, 94, 0.1),
              transparent
            );
            transition: left 0.6s ease;
          }

          .payment-option:hover::before {
            left: 100%;
          }

          .payment-option:hover {
            border-color: rgba(34, 197, 94, 0.5);
            background: rgba(34, 197, 94, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
          }

          .payment-option.selected {
            border-color: #22c55e;
            background: rgba(34, 197, 94, 0.15);
            box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }

          .payment-option.disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .payment-option.disabled:hover {
            border-color: rgba(71, 85, 105, 0.3);
            background: rgba(30, 30, 46, 0.6);
            transform: none;
            box-shadow: none;
          }

          .payment-option.disabled:hover::before {
            left: -100%;
          }

          .option-icon {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
          }

          .points-icon {
            background: #f59e0b;
          }

          .option-content {
            flex: 1;
          }

          .option-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
          }

          .option-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
          }

          .option-price {
            font-size: 16px;
            font-weight: 700;
            color: #22c55e;
          }

          .option-description {
            font-size: 13px;
            color: #94a3b8;
            line-height: 1.3;
          }

          .insufficient-points {
            font-size: 12px;
            color: #ef4444;
            margin-top: 4px;
            font-weight: 500;
          }

          .auth-required {
            font-size: 12px;
            color: #f59e0b;
            margin-top: 4px;
            font-weight: 500;
          }

          .popup-actions {
            display: flex;
            gap: 12px;
          }

          .purchase-btn {
            --glow: 180 100% 40%;
            position: relative;
            background: linear-gradient(135deg, #065f46, #059669 40%, #10b981);
            border: 1px solid rgba(16, 185, 129, 0.4);
            color: #ecfdf5;
            padding: 0.85rem 1.4rem 0.85rem 1.1rem;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            border-radius: 0.85rem;
            transition: background 0.4s ease, box-shadow 0.4s ease,
              transform 0.25s ease;
            box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.35),
              0 4px 18px -4px rgba(16, 185, 129, 0.45),
              0 12px 32px -10px rgba(6, 95, 70, 0.5);
          }
          .purchase-btn:hover:not(:disabled) {
            background: linear-gradient(135deg, #047857, #059669 35%, #34d399);
            box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.55),
              0 6px 22px -4px rgba(16, 185, 129, 0.65),
              0 14px 40px -6px rgba(5, 150, 105, 0.55);
            transform: translateY(-2px);
          }
          .purchase-btn:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.6),
              0 4px 18px -4px rgba(16, 185, 129, 0.6),
              0 10px 26px -8px rgba(5, 150, 105, 0.55);
          }
          .purchase-btn.insufficient {
            background: linear-gradient(135deg, #334155, #475569);
            border-color: rgba(148, 163, 184, 0.25);
            color: #cbd5e1;
            box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.25),
              inset 0 0 0 1px rgba(148, 163, 184, 0.25);
          }
          .purchase-btn.insufficient:hover {
            transform: none;
            box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.35);
          }
          .purchase-btn-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(
                circle at 30% 20%,
                rgba(255, 255, 255, 0.15),
                transparent 60%
              ),
              radial-gradient(
                circle at 80% 70%,
                rgba(255, 255, 255, 0.08),
                transparent 55%
              );
            opacity: 0;
            transition: opacity 0.5s ease;
          }
          .purchase-btn:hover .purchase-btn-bg {
            opacity: 1;
          }
          .cost-chip {
            background: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.25);
            padding: 0.15rem 0.45rem;
            border-radius: 999px;
            font-size: 0.65rem;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            backdrop-filter: blur(4px);
          }
          .post-balance {
            position: absolute;
            top: -8px;
            right: -8px;
            background: linear-gradient(135deg, #0d9488, #0f766e);
            color: #ecfeff;
            font-size: 0.55rem;
            font-weight: 600;
            padding: 0.35rem 0.5rem;
            border-radius: 0.65rem;
            box-shadow: 0 2px 6px -2px rgba(13, 148, 136, 0.5);
            letter-spacing: 0.5px;
          }
          .loader {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.25);
            border-top-color: #ecfdf5;
            border-radius: 50%;
            animation: spin 0.75s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          /* Mobile responsive */
          @media (max-width: 480px) {
            .pdf-purchase-modal {
              padding: 32px 24px 24px;
              margin: 16px;
            }

            .popup-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
