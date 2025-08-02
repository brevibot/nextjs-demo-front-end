import { Build, ApiEvent } from "../types";

export const builds: Build[] = [
    { buildNumber: 123, majorVersion: 1, minorVersion: 1, patchVersion: 1, buildStatus: "SUCCESS", date: "2025-07-15T13:00:00Z", installLink: "#", githubActionLink: "#", branch: "development", isRelease: false, _links: { self: { href: "" } } },
    { buildNumber: 124, majorVersion: 1, minorVersion: 1, patchVersion: 2, buildStatus: "SUCCESS", date: "2025-07-16T10:00:00Z", installLink: "#", githubActionLink: "#", branch: "development", isRelease: false, _links: { self: { href: "" } } },
    { buildNumber: 125, majorVersion: 1, minorVersion: 1, patchVersion: 0, buildStatus: "FAILURE", date: "2025-07-16T11:00:00Z", installLink: "#", githubActionLink: "#", branch: "main", isRelease: false, _links: { self: { href: "" } } },
    { buildNumber: 126, majorVersion: 2, minorVersion: 0, patchVersion: 0, buildStatus: "SUCCESS", date: "2025-07-17T09:30:00Z", installLink: "#", githubActionLink: "#", branch: "main", isRelease: true, _links: { self: { href: "" } } },
    { buildNumber: 127, majorVersion: 2, minorVersion: 0, patchVersion: 1, buildStatus: "SUCCESS", date: "2025-07-18T14:00:00Z", installLink: "#", githubActionLink: "#", branch: "main", isRelease: false, _links: { self: { href: "" } } },
    { buildNumber: 128, majorVersion: 1, minorVersion: 2, patchVersion: 0, buildStatus: "SUCCESS", date: "2025-07-18T15:00:00Z", installLink: "#", githubActionLink: "#", branch: "feature/new-login", isRelease: false, _links: { self: { href: "" } } },
];

export const events: ApiEvent[] = [
    { title: 'Project Alpha Deadline', start: '2025-08-10', end: '2025-08-11', allDay: true, color: '#dc3545' },
    { title: 'Team Sync', start: '2025-08-15T10:30:00', end: '2025-08-15T11:30:00', allDay: false, color: '#0d6efd' },
    { title: 'Deployment Window', start: '2025-08-20T14:00:00', end: '2025-08-20T16:00:00', allDay: false, color: '#198754' }
];