"use client";

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent, SpringApiEventResponse } from '../types';
import { apiFetch, UnauthorizedError } from '@/app/lib/api';
import UnauthorizedAccess from '@/app/components/UnauthorizedAccess';

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch from the real backend (proxied by next.config.ts)
        const data: SpringApiEventResponse = await apiFetch('/api/events');
        // Update parsing to handle the Spring Data REST "_embedded" structure
        setEvents(data._embedded.events);
      } catch (err: any) {
        if (err instanceof UnauthorizedError) setIsUnauthorized(true);
        else setError(err.message || 'Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (isUnauthorized) return <UnauthorizedAccess />;
  if (isLoading) return <div className="d-flex justify-content-center p-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger text-center m-4">Error: {error}</div>;

  return (
    <div className="container py-5">
      <div className="text-center mb-4"><h1 className="display-5 fw-bold">🗓️ Events Calendar</h1>
        <p className="lead text-muted">Upcoming deadlines, deployments, and team events.</p>
      </div>
      <div className="p-4 bg-white rounded shadow-sm">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,listWeek'}}
          events={events}
          height="auto"
          navLinks={true}
          editable={true}
          dayMaxEvents={true}
        />
      </div>
    </div>
  );
}