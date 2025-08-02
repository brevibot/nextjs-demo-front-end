// Custom error for when the API server is down or unreachable
export class ApiDownError extends Error {
  constructor(message?: string) {
    super(message || "API is unreachable");
    this.name = "ApiDownError";
  }
}

// Custom error for unauthorized access
export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || "Unauthorized Access");
    this.name = "UnauthorizedError";
  }
}

export async function apiFetch(url: string, options?: RequestInit) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    // This block catches network errors (e.g., failed to fetch, DNS issues)
    console.error("Network error or API is down:", error);
    throw new ApiDownError();
  }

  if (response.status === 401 || response.status === 403) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `An unknown error occurred. Status: ${response.status}`);
  }
  
  // Handle cases where the response is OK but has no content (e.g., 204)
  if (response.status === 204) {
      return null;
  }

  return response.json();
}
