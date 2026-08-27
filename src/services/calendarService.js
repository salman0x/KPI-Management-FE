import apiClient from "./apiClient";

export const FALLBACK_EVENTS = [
  {
    id: "EVT-01",
    title: "Q3 Report Final",
    day: 4,
    month: 7,
    year: 2026,
    category: "Report",
    team: "Engineering",
    assignee: "Sari",
    status: "Done",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
  {
    id: "EVT-02",
    title: "Design Review",
    day: 9,
    month: 7,
    year: 2026,
    category: "Design",
    team: "UI/UX",
    assignee: "Mitha",
    status: "Done",
    color: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  },
  {
    id: "EVT-03",
    title: "API Integration",
    day: 11,
    month: 7,
    year: 2026,
    category: "Feature",
    team: "Engineering",
    assignee: "Musa",
    status: "On Progress",
    color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  },
  {
    id: "EVT-04",
    title: "Code Audit & Review",
    day: 11,
    month: 7,
    year: 2026,
    category: "Tech Debt",
    team: "Engineering",
    assignee: "Sari",
    status: "Code Review",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
  },
  {
    id: "EVT-05",
    title: "QA Bug Verification",
    day: 18,
    month: 7,
    year: 2026,
    category: "QA",
    team: "QA",
    assignee: "Dimas",
    status: "QA",
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  },
  {
    id: "EVT-06",
    title: "Release Production v2.4",
    day: 25,
    month: 7,
    year: 2026,
    category: "Feature",
    team: "Engineering",
    assignee: "Reza",
    status: "Ready",
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
];

/**
 * API SERVICE: CALENDAR (Event, Deadline Sprint, Tim)
 */
export const calendarService = {
  /**
   * [GET] Ambil Semua Event & Deadline Kalender
   * Endpoint: GET /calendar/events?month=...&year=...&status=...&team=...
   */
  async getCalendarEvents(params = {}) {
    try {
      const response = await apiClient.get("/calendar/events", params);
      return response.data || response;
    } catch (err) {
      console.info("[Fallback Mode] Backend /calendar/events belum aktif, menggunakan fallback data.");
      return FALLBACK_EVENTS;
    }
  },

  /**
   * [POST] Buat Event / Deadline Baru
   * Endpoint: POST /calendar/events
   */
  async createCalendarEvent(eventData) {
    try {
      const response = await apiClient.post("/calendar/events", eventData);
      return response.data || response;
    } catch (err) {
      return {
        id: `EVT-${Date.now().toString().slice(-3)}`,
        ...eventData,
      };
    }
  },

  /**
   * [PUT] Update Event
   * Endpoint: PUT /calendar/events/:id
   */
  async updateCalendarEvent(id, eventData) {
    try {
      const response = await apiClient.put(`/calendar/events/${id}`, eventData);
      return response.data || response;
    } catch (err) {
      return { id, ...eventData };
    }
  },

  /**
   * [DELETE] Hapus Event
   * Endpoint: DELETE /calendar/events/:id
   */
  async deleteCalendarEvent(id) {
    try {
      const response = await apiClient.delete(`/calendar/events/${id}`);
      return response.data || response;
    } catch (err) {
      return { success: true, id };
    }
  },
};

export default calendarService;
