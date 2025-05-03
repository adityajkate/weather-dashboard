"use client";

import { XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { useWeatherStore } from "@/store/weatherStore";
import { useState, useEffect } from "react";

export function ErrorAlert() {
  const { error, clearError } = useWeatherStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Define handleDismiss before using it in useEffect
  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      clearError();
    }, 300);
  };

  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setIsLeaving(false);

      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if (!error || !isVisible) {
    return null;
  }

  return (
    <div
      className={`bg-destructive-light border border-destructive text-destructive px-5 py-4 rounded-lg shadow-md relative transition-all duration-300 ${
        isLeaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-destructive/10 p-1 rounded-full">
          <ExclamationTriangleIcon className="h-5 w-5 text-destructive" aria-hidden="true" />
        </div>
        <div className="ml-3 pt-0.5">
          <p className="text-sm font-medium">{error}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex rounded-md p-1.5 text-destructive hover:bg-destructive/10 focus:outline-none focus:ring-2 focus:ring-destructive transition-colors"
            >
              <span className="sr-only">Dismiss</span>
              <XCircleIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress bar for auto-dismiss */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-destructive/30 w-full overflow-hidden rounded-b-lg">
        <div
          className="h-full bg-destructive animate-pulse-subtle"
          style={{
            animation: 'shrink 8s linear forwards',
            width: '100%'
          }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}
