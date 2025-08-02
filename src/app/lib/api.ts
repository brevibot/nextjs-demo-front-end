export class ApiDownError extends Error {
  constructor(message?: string) {
    super(message || "API is unreachable");
    this.name = "ApiDownError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || "Unauthorized Access");
    this.name = "UnauthorizedError";
  }
}

// Get the backend API URL from environment variables.
// Fallback to the default Spring Boot port for local development.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function apiFetch(url: string, options?: RequestInit) {
  let response;
  // Prepend the full backend URL to the request.
  const fullUrl = `${API_BASE_URL}${url}`;

  try {
    response = await fetch(fullUrl, options);
  } catch (error) {
    console.error("Network error or API is down:", error);
    throw new ApiDownError();
  }

  if (response.status >= 500 && response.status <= 504) {
      console.error("Backend is down or unreachable. Received status:", response.status);
      throw new ApiDownError();
  }

  if (response.status === 401 || response.status === 403) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `An unknown error occurred. Status: ${response.status}`);
  }
  
  if (response.status === 204) {
      return null;
  }

  return response.json();
}