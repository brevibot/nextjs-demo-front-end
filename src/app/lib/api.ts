export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || "Unauthorized Access");
    this.name = "UnauthorizedError";
  }
}

export async function apiFetch(url: string, options?: RequestInit) {
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    throw new UnauthorizedError();
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An unknown error occurred.');
  }
  
  return response.json();
}