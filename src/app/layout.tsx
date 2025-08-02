import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from "next";
import Link from 'next/link';
import NotificationBanner from './components/NotificationBanner';

export const metadata: Metadata = {
  title: "App Dashboard",
  description: "Dashboard for builds, events, and admin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-light">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link href="/" className="navbar-brand fw-bold">🚀 App Dashboard</Link>
            <div className="navbar-nav">
              <Link href="/" className="nav-link">Builds</Link>
              <Link href="/calendar" className="nav-link">Calendar</Link>
              <Link href="/admin" className="nav-link">Admin</Link>
              {/* This is a generic link. In a real application, you'd link to a specific build's approval page. */}
              <Link href="/approval/1" className="nav-link">Approval</Link>
            </div>
          </div>
        </nav>
        <NotificationBanner />
        {children}
      </body>
    </html>
  );
}