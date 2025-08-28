"use client";

import React, { useState, useEffect } from "react";
import SidebarCredits from "./SidebarCredits";
import { useRouter, usePathname } from "next/navigation";
import "../app/globals.css";
import {
  Home,
  Upload,
  CreditCard,
  Settings,
  Menu,
  X,
  Bell,
  Trophy,
} from "lucide-react";
import { Toaster } from "sonner";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { AnimatedButton } from "./ui/animated-button";
interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false); // Reset collapse state on mobile
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    {
      id: "contribute",
      label: "Contribute",
      icon: Upload,
      path: "/contribute",
    },
    { id: "credits", label: "Credits", icon: CreditCard, path: "/credits" },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
    },

    {
      id: "result",
      label: "Result",
      icon: Trophy,
      path: "/result",
    },

    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const toggleSidebar = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleNavClick = (path: string) => {
    // Direct navigation without auth gating
    router.push(path);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`premium-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${
          isMobile ? "mobile" : ""
        } ${mobileMenuOpen ? "mobile-open" : ""}`}
      >
        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        {/* Header */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"></div>
            {!sidebarCollapsed && <div className="logo-text">PDF Library</div>}
          </div>

          {/* Close button for mobile */}
          {isMobile && (
            <button
              className="mobile-close-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavClick(item.path);
              }}
              key={item.id}
              className={`nav-item ${pathname === item.path ? "active" : ""}`}
              title={sidebarCollapsed ? item.label : ""}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavClick(item.path);
                }}
                className="nav-link"
              >
                <div className="nav-icon">
                  <item.icon className="w-5 h-5" />
                </div>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            </div>
          ))}
        </nav>

        {/* Credits Section */}
        <SidebarCredits sidebarCollapsed={!!sidebarCollapsed} />

        <style jsx>{`
          .cursor-pointer[disabled] {
            cursor: pointer !important;
          }
          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            backdrop-filter: blur(4px);
          }

          .premium-sidebar {
            width: 280px;
            height: 100vh;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(20px);
            border-right: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            display: flex;
            flex-direction: column;
            box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
            overflow: hidden;
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            pointer-events: auto;
          }

          .premium-sidebar * {
            pointer-events: auto;
          }

          /* Ensure sidebar doesn't expand on click */
          .premium-sidebar.collapsed {
            pointer-events: auto;
          }
          .points-label-small button,
          .points-label-small button * {
            pointer-events: auto !important;
          }

          /* Collapsed State */
          .premium-sidebar.collapsed {
            width: 80px;
          }

          .premium-sidebar.collapsed .logo-text {
            opacity: 0;
            transform: translateX(-20px);
          }

          .premium-sidebar.collapsed .nav-link span {
            opacity: 0;
            transform: translateX(-20px);
          }

          .premium-sidebar.collapsed .points-label-small {
            opacity: 0;
          }

          .premium-sidebar.collapsed .nav-item {
            margin: 4px 8px;
          }

          .premium-sidebar.collapsed .nav-link {
            justify-content: center;
            padding: 16px 12px;
          }

          .premium-sidebar.collapsed .sidebar-header {
            padding: 32px 16px 24px;
          }

          .premium-sidebar.collapsed .points-section-small {
            padding: 16px 12px;
          }

          .premium-sidebar.collapsed .points-card-small {
            padding: 8px;
          }

          /* Mobile States */
          .premium-sidebar.mobile {
            position: fixed;
            top: 0;
            left: 0;
            width: 280px;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
          }

          .premium-sidebar.mobile.mobile-open {
            transform: translateX(0);
          }

          .mobile-close-btn {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 8px;
            color: #e2e8f0;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
          }

          .mobile-close-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.3);
          }

          .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
          }

          .floating-element {
            position: absolute;
            background: rgba(124, 58, 237, 0.05);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
            border: 1px solid rgba(124, 58, 237, 0.1);
          }

          .floating-element:nth-child(1) {
            width: 60px;
            height: 60px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
          }

          .floating-element:nth-child(2) {
            width: 40px;
            height: 40px;
            top: 60%;
            left: 80%;
            animation-delay: 2s;
          }

          .floating-element:nth-child(3) {
            width: 30px;
            height: 30px;
            top: 80%;
            left: 20%;
            animation-delay: 4s;
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          .sidebar-header {
            padding: 32px 24px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.2);
            z-index: 2;
            transition: padding 0.3s ease;
          }

          .sidebar-header::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.02),
              transparent
            );
            pointer-events: none;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 2;
          }

          .logo-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #7c3aed, #3b82f6);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
          }

          .logo-icon::before {
            content: "📚";
            font-size: 18px;
            position: relative;
            z-index: 2;
          }

          .logo-icon::after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.3),
              transparent
            );
            animation: shine 2s infinite;
          }

          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }

          .logo-text {
            color: #e2e8f0;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: -0.5px;
            transition: all 0.3s ease;
            white-space: nowrap;
            overflow: hidden;
          }

          .sidebar-nav {
            flex: 1;
            padding: 24px 0;
            z-index: 2;
            position: relative;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .sidebar-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-item {
            position: relative;
            margin: 4px 16px;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .nav-item:hover {
            transform: translateX(4px);
          }

          .nav-link {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px 20px;
            color: rgba(226, 232, 240, 0.7);
            text-decoration: none;
            font-weight: 500;
            font-size: 15px;
            transition: all 0.3s ease;
            position: relative;
            z-index: 2;
            background: none;
            border: none;
            width: 100%;
            cursor: pointer;
          }

          .nav-link span {
            transition: all 0.3s ease;
            white-space: nowrap;
            overflow: hidden;
          }

          .nav-item.active {
            background: linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.2),
              rgba(59, 130, 246, 0.1)
            );
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(124, 58, 237, 0.3);
          }

          .nav-item.active .nav-link {
            color: #e2e8f0;
            font-weight: 600;
          }

          .nav-item:not(.active):hover {
            background: rgba(255, 255, 255, 0.02);
          }

          .nav-item:not(.active):hover .nav-link {
            color: #e2e8f0;
          }

          .nav-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
            flex-shrink: 0;
          }

          .nav-item:hover .nav-icon {
            transform: scale(1.1);
          }

          /* Points Section */
          .points-section-small {
            padding: 16px 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            background: rgba(0, 0, 0, 0.2);
            z-index: 2;
            transition: padding 0.3s ease;
          }

          .points-card-small {
            background: linear-gradient(
              135deg,
              rgba(30, 41, 59, 0.8),
              rgba(15, 23, 42, 0.6)
            );
            border-radius: 12px;
            padding: 12px 16px;
            border: 1px solid rgba(71, 85, 105, 0.3);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: padding 0.3s ease;
          }

          .points-card-small::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              45deg,
              rgba(124, 58, 237, 0.05),
              transparent
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .points-card-small:hover::before {
            opacity: 1;
          }

          .points-label-small {
            color: rgba(148, 163, 184, 0.8);
            font-size: 11px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            transition: all 0.3s ease;
          }

          .points-value-small {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .points-number-small {
            color: #10b981;
            font-size: 20px;
            font-weight: 700;
          }

          /* Tablet Responsive */
          @media (max-width: 1024px) and (min-width: 769px) {
            .premium-sidebar:not(.collapsed) {
              width: 240px;
            }

            .logo-text {
              font-size: 20px;
            }

            .nav-link {
              font-size: 14px;
              padding: 14px 18px;
            }
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .premium-sidebar {
              width: 280px;
            }

            .sidebar-header {
              padding: 24px 20px 20px;
            }

            .logo-text {
              font-size: 20px;
            }

            .nav-link {
              padding: 14px 16px;
              font-size: 14px;
            }

            .points-section-small {
              padding: 16px;
            }
          }

          /* Small Mobile */
          @media (max-width: 480px) {
            .premium-sidebar {
              width: 260px;
            }

            .sidebar-header {
              padding: 20px 16px 16px;
            }

            .logo-text {
              font-size: 18px;
            }

            .nav-link {
              padding: 12px 14px;
              font-size: 13px;
            }

            .points-section-small {
              padding: 12px;
            }

            .points-card-small {
              padding: 10px 12px;
            }

            .points-number-small {
              font-size: 18px;
            }
          }

          .premium-sidebar.collapsed .nav-item:hover {
            transform: translateX(2px); /* Reduced movement when collapsed */
          }

          .premium-sidebar.collapsed .nav-item {
            position: relative;
          }

          /* Add tooltip for collapsed state */
          .premium-sidebar.collapsed .nav-item::after {
            content: attr(title);
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1000;
            margin-left: 8px;
          }

          .premium-sidebar.collapsed .nav-item:hover::after {
            opacity: 1;
          }
        `}</style>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-gray-900 transition-all duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button
            onClick={(e) => toggleSidebar(e)}
            className="text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-md"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <SignedOut>
              {/* Avoid nested <button>. Clerk recommends wrapping a custom button inside <SignInButton>. */}
              <SignInButton>
                <AnimatedButton type="button">Sign In</AnimatedButton>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        {children}
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
