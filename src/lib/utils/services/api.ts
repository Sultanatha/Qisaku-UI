const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const request = async <T>(
  method: HttpMethod,
  path: string,
  data?: unknown
): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const options: RequestInit = {
    method,
    headers,
    credentials: "include",
    ...(data ? { body: JSON.stringify(data) } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, options);

  // ✅ handle 401
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.clear();
      window.location.href = "/auth/sign-in?message=session_expired";
    }
    throw new Error("Unauthorized");
  }

  let payload: any = {};
  try {
    payload = await res.json();
  } catch {
    payload = {};
  }

  if (!res.ok) {
    throw new Error(payload.message || "Request failed");
  }

  return payload as T;
};

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, data?: unknown) => request<T>("POST", path, data),
  put: <T>(path: string, data?: unknown) => request<T>("PUT", path, data),
  patch: <T>(path: string, data?: unknown) => request<T>("PATCH", path, data),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
