"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the ClientInitializer with ssr: false
const ClientInitializer = dynamic(
  () => import('@/lib/utils/ClientInitializer'),
  { ssr: false }
);

export default function ClientInitializerWrapper() {
  return <ClientInitializer />;
}
