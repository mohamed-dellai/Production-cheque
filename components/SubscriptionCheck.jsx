'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function SubscriptionCheck({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [isValid, setIsValid] = useState(true);
  
  useEffect(() => {
    // Skip subscription check for these routes
    const excludedRoutes = ['/payment', '/login', '/signup', '/verification-success', '/verification-failed'];
    if (excludedRoutes.includes(pathname) || pathname.startsWith('/verification')) {
      console.log('Skipping subscription check for excluded route:', pathname);
      setChecking(false);
      return;
    }
    
    // Protected routes that require subscription check
    const protectedRoutes = ['/', '/settings', '/print'];
    if (!protectedRoutes.includes(pathname)) {
      setChecking(false);
      return;
    }
    
    async function checkSubscription() {
      try {
        console.log('Checking subscription status...');
        const response = await fetch('/api/subscription/check');
        if (!response.ok) {
          console.error('Subscription check failed with status:', response.status);
          setChecking(false);
          return;
        }
        
        const data = await response.json();
        console.log('Subscription check response:', data);
        
        if (!data.valid) {
          console.log('Subscription not valid, redirecting to payment page');
          router.push('/payment');
          setIsValid(false);
        } else {
          console.log('Subscription is valid');
          setIsValid(true);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setChecking(false);
      }
    }
    
    checkSubscription();
  }, [pathname, router]);
  
  // Show loading state or nothing while checking
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Vérification de votre abonnement...</p>
        </div>
      </div>
    );
  }
  
  return children;
} 