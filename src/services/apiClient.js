const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://kpi-management-be-assist.vercel.app/api";

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

  if (params && typeof params === "object") {
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
  }

  return url.toString();
}

async function request(endpoint, options = {}) {
  const url = buildUrl(endpoint, options.params);

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
        // ignore non-json error responses
      }

      if (response.status === 401) {
        errorMessage = errorMessage || "Sesi login telah berakhir (401 Unauthorized).";
      } else if (response.status === 403) {
        errorMessage = errorMessage || "Akses ditolak (403 Forbidden).";
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) return null;

    const data = await response.json();
    if (data && data.success === false) {
      throw new Error(data.message || "Gagal memproses permintaan.");
    }

    return data;
  } catch (error) {
    console.warn(`[API Client] [${options.method || "GET"}] ${endpoint}:`, error.message);
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
