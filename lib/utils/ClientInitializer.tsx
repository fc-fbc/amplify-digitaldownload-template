"use client";

import { useEffect, memo } from 'react';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { initSecureStorage } from './secureStorage';

// This component handles client-side initialization of services
// It's dynamically imported with { ssr: false } to ensure it only runs on the client
function ClientInitializer() {
  useEffect(() => {
    // Initialize services with a slight delay to prioritize rendering
    const timer = setTimeout(() => {
      // Configure Amplify
      Amplify.configure(outputs);
      
      // Initialize secure storage
      initSecureStorage();
      
      console.log('Client services initialized');
    }, 100); // Small delay to prioritize UI rendering
    
    return () => clearTimeout(timer);
  }, []);
  
  // This component doesn't render anything
  return null;
}

// Memoize to prevent unnecessary re-renders
export default memo(ClientInitializer);
