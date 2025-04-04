'use client'
import { ReactNode } from 'react';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { onMessageListener } from '@/utils/firebase'
import { useEffect } from 'react'
import SubscriptionCheck from '../components/SubscriptionCheck';
import { Inter } from 'next/font/google';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Initialize the Inter font with subsets and weights
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const unsubscribe = onMessageListener().then((payload: any) => {
      new Notification(payload.data.title, {
        body: payload.data.body,
        tag: 'finflow-notification',
        icon: '/icon-192x192.png',
      });
    });

    return () => {
      unsubscribe;
    }
  }, []);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
      <head>
        <title>FinFlow</title>
        <meta name="description" content="Application pour gestion des papiers" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SubscriptionCheck>
          {children}
        </SubscriptionCheck>
      </body>
    </html>
  );
}
