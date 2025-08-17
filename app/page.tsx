"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Grid3X3,
  List,
  Search,
  Folder,
  ChevronRight,
  Home,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";
//@ts-ignore
import { SunspotLoader } from "react-awesome-loaders";
import PdfPurchaseModal from "@/components/pdf-purchase-modal";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Added types
interface FSFolder {
  id: string; // path id from API
  name: string;
  itemCount: number;
  path: string;
}
interface FSFile {
  id: string; // file id (hash or path)
  name: string;
  size: string;
  modified: string;
  key: string; // object path inside bucket
  customMetadata?: Record<string, string> | null;
}
interface FSNode {
  folders: FSFolder[];
  files: FSFile[];
}
type FileSystemMap = Record<string, FSNode>;

export default function HomePage() {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPdf, setSelectedPdf] = useState<FSFile | null>(null);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const [fileSystem, setFileSystem] = useState<FileSystemMap>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const { redirectToSignIn } = useClerk();
  const routerNext = useRouter();

  const prettify = (s: string) => s.replace(/_/g, " ");


  // Load user points (credits) from server when signed in
  useEffect(() => {
    let cancelled = false;
    async function loadCredits() {
      if (!isSignedIn) {
        setUserCredits(0);
        return;
      }
      try {
        const res = await fetch("/api/credits", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed credits fetch");
        const data = await res.json();
        if (!cancelled && typeof data?.credits === "number") {
          setUserCredits(data.credits);
        }
      } catch {
        // silent fail; keep previous points
      }
    }
    loadCredits();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  // Fetch file system from API
  const fetchFileSystem = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/files/getfiles", { cache: "no-store" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (data?.fileSystem) {
        setFileSystem(data.fileSystem as FileSystemMap);
      } else {
        throw new Error("Malformed response");
      }
    } catch (e: any) {
      setError(e.message || "Unable to load files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFileSystem();
  }, [fetchFileSystem]);

  // Get current folder data
  const getCurrentFolderData = (): FSNode => {
    const node = fileSystem[currentPath] || { folders: [], files: [] };
    return {
      folders: node.folders.map(f => ({
        ...f,
        name: f.name.replace(/_/g, " "),
      })),
      files: node.files.map(f => ({
        ...f,
        name: f.name.replace(/_/g, " "),
      })),
    };
  };

  // Navigate to folder
  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath);
  };

  // Navigate back
  const navigateBack = () => {
    if (currentPath === "/") return;
    const pathParts = currentPath.split("/").filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.length === 0 ? "/" : "/" + pathParts.join("/");
    setCurrentPath(newPath);
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    if (currentPath === "/") return [{ name: "Home", path: "/" }];

    const pathParts = currentPath.split("/").filter(Boolean);
    const breadcrumbs: { name: string; path: string }[] = [
      { name: "Home", path: "/" },
    ];

    let currentBreadcrumbPath = "";
    pathParts.forEach((part) => {
      currentBreadcrumbPath += "/" + part;
      breadcrumbs.push({ name: part, path: currentBreadcrumbPath });
    });

    return breadcrumbs;
  };


  const Breadcrumb = () => {
    const breadcrumbs = getBreadcrumbs();

    return (
      <div className="flex items-center space-x-3 text-lg font-semibold text-slate-500 mb-6">
        <Home className="w-5 h-5 text-blue-500" />
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            <button
              onClick={() => navigateToFolder(crumb.path)}
              className={`hover:text-blue-400 transition-colors ${
                index === breadcrumbs.length - 1
                  ? "text-slate-200 font-semibold"
                  : "text-blue-400"
              }`}
              disabled={index === breadcrumbs.length - 1}
            >
              {crumb.path === "/" ? "Castle" : prettify(crumb.name)}
            </button>
            {index < breadcrumbs.length - 1 && (
              <ChevronRight className="w-4 h-4 text-slate-600" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const openPdf = (file: FSFile) => {
    if (!isSignedIn) {
      // Persist intended file so we can reopen after auth
      try {
        localStorage.setItem("pendingFileId", file.id);
      } catch {}
      // Use Clerk helper for a proper sign-in flow
      if (typeof window !== "undefined") {
        redirectToSignIn({
          redirectUrl: window.location.pathname || "/",
        });
      } else {
        routerNext.push("/sign-in");
      }
      return;
    }

    setSelectedPdf(file);

    setShowPurchaseModal(true);
  };

  // After login, if a pending file is stored, open it automatically
  useEffect(() => {
    if (!isSignedIn) return;
    const pendingId =
      typeof window !== "undefined"
        ? localStorage.getItem("pendingFileId")
        : null;
    if (!pendingId) return;
    // Search file in current fileSystem (across all paths)
    for (const node of Object.values(fileSystem)) {
      const match = node.files.find((f) => f.id === pendingId);
      if (match) {
        setSelectedPdf(match);
        setShowPurchaseModal(true);
        try {
          localStorage.removeItem("pendingFileId");
        } catch {}
        break;
      }
    }
  }, [isSignedIn, fileSystem]);

  const PremiumFileGrid = () => {
    const { folders, files } = getCurrentFolderData();

    const query = searchQuery.trim().toLowerCase();
    const filteredFolders = query
      ? folders.filter(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            prettify(f.name).toLowerCase().includes(query)
        )
      : folders;
    const filteredFiles = query
      ? files.filter(
          (f) =>
            f.name.toLowerCase().includes(query) ||
            prettify(f.name).toLowerCase().includes(query)
        )
      : files;

    if (viewMode === "list") {
      return (
        <div className="premium-file-list">
          {/* Folders */}
          {filteredFolders.map((folder: FSFolder) => (
            <div
              key={folder.id}
              className="premium-list-item group"
              onClick={() => navigateToFolder(folder.path)}
            >
              <div className="list-item-icon">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div className="list-item-content">
                <div className="list-item-name">{folder.name}</div>
                <div className="list-item-meta">
                  Folder • {folder.itemCount} items
                </div>
              </div>
              <div className="list-item-actions">
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}

          {/* PDF Files */}
          {filteredFiles.map((file: FSFile) => (
            <div
              key={file.id}
              className="premium-list-item group"
              onClick={() => openPdf(file)}
            >
              <div className="list-item-icon pdf-icon">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="list-item-content">
                <div className="list-item-name">{prettify(file.name)}</div>
                <div className="list-item-meta">
                  {file.modified} • {file.size}
                </div>
              </div>
              <div className="list-item-size">
                <span className="size-badge">{file.size}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Grid view
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4 mb-8">
        {/* Folders */}
        {filteredFolders.map((folder: FSFolder) => (
          <div
            key={folder.id}
            className="premium-file-card group"
            onClick={() => navigateToFolder(folder.path)}
          >
            <div>
              <div className="file-icon-container folder-icon">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div className="file-title">{prettify(folder.name)}</div>
            </div>
            <div className="file-meta">
              <span>{folder.itemCount} items</span>
              <span className="file-size">Folder</span>
            </div>
          </div>
        ))}

        {/* PDF Files */}
        {filteredFiles.map((file: FSFile) => (
          <div
            key={file.id}
            className="premium-file-card group"
            onClick={() => openPdf(file)}
          >
            <div>
              <div className="file-icon-container pdf-icon">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="file-title">{prettify(file.name)}</div>
            </div>
            <div className="file-meta">
              <span>{file.modified}</span>
              <span className="file-size">{file.size}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ViewControls = () => (
    <div className="flex gap-3 items-center mb-6">
      <button
        onClick={() => setViewMode("grid")}
        className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
      >
        <Grid3X3 className="w-4 h-4" />
        Fancy Grid
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`view-btn ${viewMode === "list" ? "active" : ""}`}
      >
        <List className="w-4 h-4" />
        Boring List
      </button>
     
    </div>
  );

  const { folders, files } = getCurrentFolderData();
  const totalItems = folders.length + files.length;

  return (
    <div className="premium-dashboard">
      {/* Header with Search */}
      <div className="dashboard-header">
        <Breadcrumb />
        <div className="search-container">
          <Input
            placeholder="Hunt legendary PDFs... or just type a word."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Search className="search-icon" />
        </div>
      </div>

      {/* View Controls & Refresh */}
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <ViewControls />
        </div>
        <div className="flex gap-2">
            <Button
            variant="default"
            size="sm"
            onClick={fetchFileSystem}
            disabled={loading}
            className="mt-1 bg-blue-600 hover:bg-blue-700 text-white border-none"
            >
            {loading ? "Politely asking..." : "Summon Fresh Data"}
            </Button>
        </div>
      </div>

      {/* Back Button */}
      {currentPath !== "/" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateBack}
          className="flex items-center text-slate-300 hover:text-white hover:bg-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retreat Heroically
        </Button>
      )}

      {/* File Grid / States */}
      {error && (
        <div className="text-center py-6 text-red-400 text-sm">
          Files staged a rebellion: {error}
        </div>
      )}
      {!error && loading && (
        <div className="flex justify-center items-center py-12 text-slate-500 gap-x-2">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Summoning files...</span>
        </div>
      )}
      {!loading && !error && totalItems === 0 && (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-500">
            This folder is emptier than my brain after finals.
          </p>
        </div>
      )}
      {!loading && !error && totalItems > 0 && <PremiumFileGrid />}

      {/* PDF Purchase Modal */}
      <PdfPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setSelectedPdf(null);
        }}
        // Cast due to differing id type (string from API) – component updated to string but build cache may lag
        pdfFile={selectedPdf as any}
        userPoints={userCredits}
        onPointsUpdate={setUserCredits}
      />
    </div>
  );
}
