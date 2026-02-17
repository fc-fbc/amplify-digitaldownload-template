"use client";

import { useEffect, useState, ReactNode, memo, useRef } from "react";

// Memoized skeleton loader to prevent unnecessary re-renders
const SkeletonLoader = memo(() => (
  <div className="bg-white shadow-2xl rounded-2xl p-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0288d1] to-[#81D4FA]"></div>
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
));

// Optimize the animation separately
const PulseAnimation = memo(() => (
  <style jsx global>{`
    @keyframes optimizedPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    .optimized-pulse {
      animation: optimizedPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      will-change: opacity;
    }
  `}</style>
));

/**
 * Highly optimized ClientOnly component
 * Uses a two-phase mounting strategy and optimized animations
 */
function ClientOnly({ children }: { children: ReactNode }) {
  // Use a ref to track if we're mounted to avoid unnecessary re-renders
  const isMountedRef = useRef(false);
  // Use state only for triggering re-renders
  const [isFullyMounted, setIsFullyMounted] = useState(false);

  useEffect(() => {
    // Phase 1: Mark as mounted immediately to avoid React 18 double-mounting issues
    isMountedRef.current = true;
    
    // Phase 2: Schedule the actual render after the browser has had time to paint
    // This helps prioritize the initial UI rendering
    const timer = setTimeout(() => {
      // Use requestAnimationFrame to ensure we're in a paint cycle
      requestAnimationFrame(() => {
        if (isMountedRef.current) {
          setIsFullyMounted(true);
        }
      });
    }, 10); // Small delay to prioritize other critical rendering
    
    return () => {
      clearTimeout(timer);
      isMountedRef.current = false;
    };
  }, []);

  // Show an optimized skeleton loader
  if (!isFullyMounted) {
    return (
      <div className="optimized-pulse">
        <PulseAnimation />
        <SkeletonLoader />
      </div>
    );
  }

  // Render children directly without wrapper to reduce DOM nodes
  return children;
}

// Export a memoized version of the component
export default memo(ClientOnly);
