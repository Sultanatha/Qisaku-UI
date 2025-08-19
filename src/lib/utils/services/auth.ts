const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;
console.log("BASE_URL:", BASE_URL);
export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_email: email,
      user_password: password,
    }),
  });

  // Handle rate limiting
  if (res.status === 429) {
    throw new Error('Too many requests. Please wait and try again.');
  }

  // Check if response is JSON
  const contentType = res.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response: ${text}`);
  }

  let data;
  try {
    data = await res.json();
  } catch (jsonError) {
    const text = await res.text();
    throw new Error(`Invalid JSON response: ${text}`);
  }

  if (!res.ok) {
    throw new Error(data.message || "Login gagal");
  }

  return data;
};
export const logout = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include',  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }, });
    console.log(res);
    if (!res.ok) {
      throw new Error('Failed to logout');
    }

    const data = await res.json();

    if (data.clearStorage && Array.isArray(data.storageKeys)) {
      data.storageKeys.forEach((key: string) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });

      localStorage.clear();
      sessionStorage.clear();
    }

    window.location.href = '/auth/sign-in?message=logout';
  } catch (error) {
    console.error('Logout error:', error);
    // Optional: tampilkan alert atau toast ke user
  }
};

export const getTokenFromCookies = (): string | null => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
    // console.log("document.cookie:", document.cookie); // Tambah ini
    // console.log("Parsed token:", token);             // Dan ini
  return token || null;
}

export const verifyToken = async (token?: string): Promise<boolean> => {
  // console.log("[verifyToken] dipanggil");

  const authToken = token || getTokenFromCookies();
  // console.log("[verifyToken] token yang digunakan:", authToken);

  if (!authToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/verify-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      credentials: "include",
    });

    // console.log("[verifyToken] status:", res.status);
    return res.ok;
  } catch (err) {
    console.error("[verifyToken] error:", err);
    return false;
  }
};