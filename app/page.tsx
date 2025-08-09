"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Grid3X3,
  List,
  Search,
  Folder,
  ChevronRight,
  Home,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";
import { mockFileSystem } from "@/lib/mock-data";
import PdfPurchaseModal from "@/components/pdf-purchase-modal";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// Added types
interface FSFolder {
  id: number;
  name: string;
  itemCount: number;
  path: string;
}
interface FSFile {
  id: number;
  name: string;
  size: string;
  modified: string;
}
interface FSNode {
  folders: FSFolder[];
  files: FSFile[];
}
const typedFS: Record<string, FSNode> = mockFileSystem as Record<
  string,
  FSNode
>;

export default function HomePage() {
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPdf, setSelectedPdf] = useState<FSFile | null>(null);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState<boolean>(false);
  const { isSignedIn } = useAuth();
  const routerNext = useRouter();

  // Load points from localStorage on component mount
  useEffect(() => {
    const savedPoints = localStorage.getItem("userPoints");
    if (savedPoints) setUserPoints(parseInt(savedPoints));
  }, []);

  // Save points to localStorage whenever points change
  useEffect(() => {
    localStorage.setItem("userPoints", userPoints.toString());
  }, [userPoints]);

  // Get current folder data
  const getCurrentFolderData = (): FSNode => {
    return typedFS[currentPath] || { folders: [], files: [] };
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
              {crumb.name}
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
      routerNext.push("/sign-in");
      return;
    }
    setSelectedPdf(file);
    setShowPurchaseModal(true);
  };

  const PremiumFileGrid = () => {
    const { folders, files } = getCurrentFolderData();

    if (viewMode === "list") {
      return (
        <div className="premium-file-list">
          {/* Folders */}
          {folders.map((folder: FSFolder, index: number) => (
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
          {files.map((file: FSFile, index: number) => (
            <div
              key={file.id}
              className="premium-list-item group"
              onClick={() => openPdf(file)}
            >
              <div className="list-item-icon pdf-icon">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="list-item-content">
                <div className="list-item-name">{file.name}</div>
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
        {folders.map((folder: FSFolder, index: number) => (
          <div
            key={folder.id}
            className="premium-file-card group"
            onClick={() => navigateToFolder(folder.path)}
          >
            <div>
              <div className="file-icon-container folder-icon">
                <Folder className="w-5 h-5 text-white" />
              </div>
              <div className="file-title">{folder.name}</div>
            </div>
            <div className="file-meta">
              <span>{folder.itemCount} items</span>
              <span className="file-size">Folder</span>
            </div>
          </div>
        ))}

        {/* PDF Files */}
        {files.map((file: FSFile, index: number) => (
          <div
            key={file.id}
            className="premium-file-card group"
            onClick={() => openPdf(file)}
          >
            <div>
              <div className="file-icon-container pdf-icon">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="file-title">{file.name}</div>
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
        Grid
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`view-btn ${viewMode === "list" ? "active" : ""}`}
      >
        <List className="w-4 h-4" />
        List
      </button>
      <div className="ml-auto">
        <button className="sort-btn">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
          </svg>
          Sort by Name
        </button>
      </div>
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
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <Search className="search-icon" />
        </div>
      </div>

      {/* View Controls */}
      <ViewControls />

      {/* Back Button */}
      {currentPath !== "/" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateBack}
          className="flex items-center text-slate-300 hover:text-white hover:bg-slate-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}

      {/* File Grid */}
      {totalItems === 0 ? (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 mx-auto mb-4 text-slate-600" />
          <p className="text-slate-500">This folder is empty</p>
        </div>
      ) : (
        <PremiumFileGrid />
      )}

      {/* PDF Purchase Modal */}
      <PdfPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setSelectedPdf(null);
        }}
        pdfFile={selectedPdf}
        userPoints={userPoints}
        onPointsUpdate={setUserPoints}
      />
    </div>
  );
}
