"use client";

import { useState } from 'react';
import { apiFetch, UnauthorizedError } from '../lib/api';
import UnauthorizedAccess from '../components/UnauthorizedAccess';

export default function AdminPage() {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ message: 'Publishing...', type: 'info' });
    setIsUnauthorized(false);
    
    localStorage.setItem('notification_banner', notificationMessage);
    window.dispatchEvent(new Event("storage"));

    try {
      await apiFetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: notificationMessage }),
      });
      setFormStatus({ message: 'Notification published and email sent successfully!', type: 'success' });
      setNotificationMessage('');
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        setIsUnauthorized(true);
        setFormStatus({ message: 'You are not authorized to perform this action.', type: 'danger' });
      } else {
        setFormStatus({ message: error.message, type: 'danger' });
      }
    }
  };

  if (isUnauthorized) return <UnauthorizedAccess />;

  return (
    <main className="container py-5">
      <div className="text-center mb-5"><h1 className="display-5 fw-bold">🔒 Admin Panel</h1>
        <p className="lead text-muted">Manage site-wide settings and data.</p>
      </div>
      <div className="card shadow-sm mb-5">
        <div className="card-header"><h5 className="mb-0">📢 Site-wide Notification Manager</h5></div>
        <div className="card-body">
          <p className="card-text">Publish a banner and send an email alert to all users.</p>
          <form onSubmit={handlePublish}>
            <div className="mb-3">
              <label htmlFor="notificationText" className="form-label">Banner & Email Message</label>
              <textarea id="notificationText" className="form-control" rows={3} value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="e.g., Scheduled maintenance tonight from 10 PM to 11 PM EST." required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Publish & Send Email</button>
          </form>
          {formStatus.message && !isUnauthorized && (<div className={`alert alert-${formStatus.type} mt-3`}>{formStatus.message}</div>)}
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-header"><h5 className="mb-0">✏️ Data Management</h5></div>
        <div className="card-body">
          <p className="card-text">Placeholders for editing build and event data.</p>
          <div className="d-grid gap-2 d-md-flex">
            <button className="btn btn-outline-secondary" disabled>Manage Builds</button>
            <button className="btn btn-outline-secondary" disabled>Manage Events</button>
          </div>
        </div>
      </div>
    </main>
  );
}