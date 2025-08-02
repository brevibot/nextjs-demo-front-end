export interface Build {
  buildNumber: number;
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  buildStatus: "SUCCESS" | "FAILURE" | "IN_PROGRESS";
  date: string;
  installLink: string;
  githubActionLink: string;
  branch: string;
  isRelease: boolean;
  tags?: string[];
  _links: {
    changes?: { href: string };
    self: { href: string };
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