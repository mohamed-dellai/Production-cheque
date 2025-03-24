'use client'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { onMessageListener } from '@/utils/firebase'
import { useEffect } from 'react'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en">
      <head>
        <title>FinFlow</title>
        <meta name="description" content="Application pour gestion des papiers" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
