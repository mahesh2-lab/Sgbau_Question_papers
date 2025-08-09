"use client";

import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PdfPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfFile: {
    id: number;
    name: string;
    size: string;
    modified: string;
  } | null;
  userPoints: number;
  onPointsUpdate: (newPoints: number) => void;
}

export default function PdfPurchaseModal({
  isOpen,
  onClose,
  pdfFile,
  userPoints,
  onPointsUpdate,
}: PdfPurchaseModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<"points" | null>(null);

  const handlePaymentSelect = (type: "points") => {
    setSelectedPayment(type);
  };

  const handlePurchase = () => {
    if (!selectedPayment || !pdfFile) return;

    if (selectedPayment === "points") {
      if (userPoints >= 5) {
        onPointsUpdate(userPoints - 5);
        toast.success(`Downloaded ${pdfFile.name}. -5 points deducted.`);
        onClose();
        setSelectedPayment(null);
      } else {
        toast.error("Insufficient points. Earn or add more points.");
      }
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedPayment(null);
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
          <div className="pdf-icon">
            <FileText className="w-8 h-8 text-white" />
          </div>

          <h3 className="popup-title">{pdfFile.name}</h3>
          <p className="popup-subtitle">
            Choose your preferred payment method to access this PDF document
          </p>

          <div className="payment-options">
            {/* Points Option */}
            <div
              className={`payment-option ${
                selectedPayment === "points" ? "selected" : ""
              }`}
              onClick={() => handlePaymentSelect("points")}
            >
              <div className="option-icon points-icon">
                <Star className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="option-content">
                <div className="option-header">
                  <span className="option-title">Points</span>
                  <span className="option-price">5 Points</span>
                </div>
                <span className="option-description">
                  Use your points to unlock this document instantly
                </span>
                {userPoints < 5 && (
                  <p className="insufficient-points">
                    Insufficient points (You have {userPoints})
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="popup-actions">
            <Button
              variant="outline"
              onClick={handleClose}
              className="btn-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={
                !selectedPayment ||
                (selectedPayment === "points" && userPoints < 5)
              }
              className="btn-primary"
            >
              {!selectedPayment
                ? "Select Payment Method"
                : selectedPayment === "points"
                ? "Purchase for 5 Points"
                : "Pay"}
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

          .pdf-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #dc2626, #991b1b);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
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

          .btn-cancel {
            flex: 1;
            background: rgba(30, 30, 46, 0.8) !important;
            color: #94a3b8 !important;
            border: 1px solid rgba(71, 85, 105, 0.4) !important;
            transition: all 0.3s ease;
          }

          .btn-cancel:hover {
            background: rgba(71, 85, 105, 0.6) !important;
            color: #e2e8f0 !important;
            border-color: rgba(71, 85, 105, 0.6) !important;
            transform: translateY(-1px);
          }

          .btn-primary {
            flex: 1;
            background: linear-gradient(135deg, #22c55e, #16a34a) !important;
            color: white !important;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
            border: none !important;
            transition: all 0.3s ease;
          }

          .btn-primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #16a34a, #15803d) !important;
            box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
            transform: translateY(-2px);
          }

          .btn-primary:disabled {
            background: rgba(30, 30, 46, 0.6) !important;
            color: #64748b !important;
            cursor: not-allowed;
            box-shadow: none;
            transform: none;
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
