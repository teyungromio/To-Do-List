const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });
  } catch {
    throw new Error(
      "Cannot connect to the API. Make sure the backend is running on port 5000."
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : {};

  if (!response.ok) {
    const error = new Error(
      data.message || `Request failed (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  register: (body) => request("/auth/register", {
    method: "POST",
    body: JSON.stringify(body)
  }),

  login: (body) => request("/auth/login", {
    method: "POST",
    body: JSON.stringify(body)
  }),

  me: () => request("/auth/me"),

  getTasks: () => request("/tasks"),

  createTask: (body) => request("/tasks", {
    method: "POST",
    body: JSON.stringify(body)
  }),

  updateTask: (id, body) => request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(body)
  }),

  deleteTask: (id) => request(`/tasks/${id}`, {
    method: "DELETE"
  })
};
