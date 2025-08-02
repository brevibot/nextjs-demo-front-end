"use client";

import { useState, useEffect } from 'react';
import { apiFetch } from '@/app/lib/api';

interface Notification {
    message: string;
}

export default function NotificationBanner() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        // Fetch the active notification from the backend
        const data = await apiFetch('/api/notifications/active');
        setNotification(data);
        setIsVisible(true);
      } catch (error) {
        // This is expected if there's no active notification (204 No Content)
        setNotification(null);
        setIsVisible(false);
      }
    };

    fetchNotification();

    // *** FIX: Poll the server every 5 seconds for updates ***
    const intervalId = setInterval(fetchNotification, 5000); // 5000 ms = 5 seconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const dismissBanner = async () => {
    setIsVisible(false); // Hide immediately for better UX
    try {
        // Tell the backend to clear the notification for everyone
        await apiFetch('/api/notifications/clear', { method: 'POST' });
    } catch (error) {
        console.error("Failed to clear notification:", error);
    }
  };

  if (!notification || !isVisible) {
    return null;
  }

  return (
    <div className="alert alert-info alert-dismissible fade show text-center mb-0" role="alert">
      <strong>Notice:</strong> {notification.message}
      <button type="button" className="btn-close" onClick={dismissBanner} aria-label="Close"></button>
    </div>
  );
}