/**
 * API Client Helper Universal
 * Menghubungkan Frontend ke Backend API dengan Base URL dari .env
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Request universal wrapper
 * @param {string} endpoint - Path endpoint (misal: '/dashboard/stats')
 * @param {object} options - Konfigurasi fetch
 */
async function request(endpoint, options = {}) {
  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`,
    window.location.origin
  );

  // Tambahkan query params jika ada
  if (options.params) {
    Object.keys(options.params).forEach((key) => {
      if (options.params[key] !== undefined && options.params[key] !== null) {
        url.searchParams.append(key, options.params[key]);
      }
    });
  }

  // Siapkan header & token otentikasi
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = localStorage.getItem("kpi_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === "object") {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url.toString(), config);

    // Jika response tidak ok, lempar error dengan pesan dari server
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // Abaikan jika bukan JSON
      }
      throw new Error(errorMessage);
    }

    // Jika response status 204 No Content
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    // Log error di console untuk kemudahan debug FE & BE
    console.warn(`[API Client Error] [${options.method || "GET"}] ${endpoint}:`, error.message);
    throw error;
  }
}

export const apiClient = {
  get: (endpoint, params, options = {}) =>
    request(endpoint, { method: "GET", params, ...options }),

  post: (endpoint, body, options = {}) =>
    request(endpoint, { method: "POST", body, ...options }),

  put: (endpoint, body, options = {}) =>
    request(endpoint, { method: "PUT", body, ...options }),

  patch: (endpoint, body, options = {}) =>
    request(endpoint, { method: "PATCH", body, ...options }),

  delete: (endpoint, options = {}) =>
    request(endpoint, { method: "DELETE", ...options }),
};

export default apiClient;
