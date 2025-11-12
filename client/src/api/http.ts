import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Safely parse JSON from a Response, handling empty responses (204 No Content)
 * Note: This consumes the response body - call it only once per response
 */
export async function parseJsonResponse<T = any>(response: Response): Promise<T | null> {
  // 204 No Content has no body
  if (response.status === 204) {
    return null;
  }

  // Check if response has content-type header
  const contentType = response.headers.get("content-type");
  
  // Get text first to check if it's empty
  const text = await response.text();
  
  // If no content, return null
  if (!text || text.trim().length === 0) {
    return null;
  }

  // If content-type doesn't indicate JSON, try to parse anyway (some APIs don't set it correctly)
  if (contentType && !contentType.includes("application/json")) {
    // If it's definitely not JSON, return null
    if (!contentType.includes("text") && !contentType.includes("json")) {
      return null;
    }
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    // If parsing fails, it might not be JSON
    console.warn("Failed to parse JSON response:", error, "Response text:", text.substring(0, 100));
    return null;
  }
}

export default apiClient;

