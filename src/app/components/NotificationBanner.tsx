"use client";

import { useState, useEffect } from 'react';

export default function NotificationBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const savedMessage = localStorage.getItem('notification_banner');
    if (savedMessage) {
      setMessage(savedMessage);
    }
    const handleStorageChange = () => {
      setMessage(localStorage.getItem('notification_banner'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const dismissBanner = () => {
    localStorage.removeItem('notification_banner');
    setMessage(null);
    window.dispatchEvent(new Event('storage'));
  };

  if (!message) {
    return null;
  }

  return (
    <div className="alert alert-info alert-dismissible fade show text-center mb-0" role="alert">
      <strong>Notice:</strong> {message}
      <button type="button" className="btn-close" onClick={dismissBanner} aria-label="Close"></button>
    </div>
  );
}