const API_BASE_URL = 'http://localhost:8000'; // Assuming backend runs on port 8000

interface RequestOptions extends RequestInit {
  token?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<T> {
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}), // Cast to Record<string, string>
  });

  if (options?.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Something went wrong');
  }

  return response.json();
}
