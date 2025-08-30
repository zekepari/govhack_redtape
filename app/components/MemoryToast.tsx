"use client";

import { useState, useEffect } from "react";
import { X, Undo2, Eye, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryToastProps {
  message: string;
  onUndo?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  duration?: number;
}

export function MemoryToast({
  message,
  onUndo,
  onView,
  onEdit,
  onClose,
  duration = 5000,
}: MemoryToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-4 right-4 z-50 max-w-md"
        >
          <div className="bg-base-100 shadow-2xl rounded-lg p-4 border border-base-300">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <p className="font-semibold text-sm mb-2">Memory updated</p>
                <p className="text-sm text-base-content/70">{message}</p>
                <div className="flex gap-2 mt-3">
                  {onUndo && (
                    <button
                      onClick={onUndo}
                      className="btn btn-xs btn-ghost gap-1"
                    >
                      <Undo2 className="w-3 h-3" />
                      Undo
                    </button>
                  )}
                  {onView && (
                    <button
                      onClick={onView}
                      className="btn btn-xs btn-ghost gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={onEdit}
                      className="btn btn-xs btn-ghost gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-ghost btn-xs btn-square"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
