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

export interface ApiEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  color?: string;
}

export interface Change {
  hash: string;
  author: string;
  message: string;
}