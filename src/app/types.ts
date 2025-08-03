
export interface Build {
  id: string;
  buildNumber: number;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  buildStatus: string;
  date: string;
  installLink: string;
  githubActionLink: string;
  sonatypeNexusLink: string;
  branch: string;
  isRelease: boolean;
  approved: boolean; // Add this line
  changes: Change[];
  _links: {
    self: { href: string };
    build: { href: string };
    changes: { href: string };
  };
}

export interface SpringApiResponse {
  _embedded: {
    builds: Build[];
  };
}

// Frontend event structure for FullCalendar
export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  color?: string;
}

// The actual API response structure from Spring Data REST for events
export interface SpringApiEventResponse {
    _embedded: {
        events: CalendarEvent[];
    }
}

export interface Change {
  hash: string;
  author: string;
  message: string;
}