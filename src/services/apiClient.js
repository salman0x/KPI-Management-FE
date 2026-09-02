/**
 * API Client Helper Universal
 * Menghubungkan Frontend ke Backend API dengan Base URL dari .env
 * Base URL Default: https://kpi-management-be-assist.vercel.app/api
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://kpi-management-be-assist.vercel.app/api";

/**
 * Membangun URL lengkap dengan format yang aman
 */
function buildUrl(endpoint, params) {
  let fullUrlString;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    fullUrlString = endpoint;
  } else {
    const cleanBase = BASE_URL.replace(/\/+$/, "");
    const cleanPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    fullUrlString = `${cleanBase}${cleanPath}`;
  }

  const url = new URL(fullUrlString, window.location.origin);

  // Tambahkan query params jika ada
  if (params && typeof params === "object") {
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
  }

  return url.toString();
}

/**
 * Request universal wrapper
 * @param {string} endpoint - Path endpoint (misal: '/dashboard/stats')
 * @param {object} options - Konfigurasi fetch
 */
async function request(endpoint, options = {}) {
  const url = buildUrl(endpoint, options.params);

  // Siapkan header & token otentikasi (Authorization: Bearer <TOKEN>)
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

  if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    // Jika response tidak ok, lempar error dengan pesan dari server atau default status
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // Abaikan jika respons bukan JSON
      }

      if (response.status === 401) {
        errorMessage = errorMessage || "Sesi login telah berakhir atau tidak sah (401 Unauthorized).";
      } else if (response.status === 403) {
        errorMessage = errorMessage || "Akses ditolak (403 Forbidden). Tindakan ini khusus akun HR.";
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
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
