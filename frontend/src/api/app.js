// Central API client for Kshetra AI.
// Replace BASE_URL with your backend when ready. All functions return Promises
// resolving to mock data so the UI works without a backend.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // Fallback to mock data when no backend is available.
    return null;
  }
}

// ---------- MOCK DATA ----------
const mock = {
  stats: {
    totalFields: 250,
    healthyFields: 180,
    stressDetected: 42,
    needIrrigation: 28,
    weeklyChange: 12,
  },
  cropDistribution: [
    { name: "Cotton", value: 35, color: "#6b4226" },
    { name: "Soybean", value: 25, color: "#e0b040" },
    { name: "Wheat", value: 20, color: "#3b82f6" },
    { name: "Rice", value: 10, color: "#22c55e" },
    { name: "Others", value: 10, color: "#94a3b8" },
  ],
  moistureOverview: [
    { level: "Low", count: 130, fill: "#22c55e" },
    { level: "Moderate", count: 70, fill: "#f59e0b" },
    { level: "High", count: 50, fill: "#ef4444" },
  ],
  alerts: [
    { id: 1, severity: "High", title: "High Moisture Stress Detected", fieldId: 101, crop: "Cotton", time: "2 hours ago", detail: "Soil moisture is critically low. Immediate irrigation required." },
    { id: 2, severity: "Moderate", title: "Irrigation Recommended", fieldId: 210, crop: "Soybean", time: "5 hours ago", detail: "Irrigate within 48 hours to prevent stress." },
    { id: 3, severity: "Low", title: "Growth Stage Update", fieldId: 95, crop: "Wheat", time: "1 day ago", detail: "Crop has entered Flowering stage." },
    { id: 4, severity: "High", title: "High Moisture Stress Detected", fieldId: 115, crop: "Sugarcane", time: "1 day ago", detail: "Severe moisture stress detected." },
    { id: 5, severity: "Moderate", title: "Weather Alert", fieldId: null, crop: null, time: "2 days ago", detail: "Heavy rainfall expected in your area tomorrow." },
    { id: 6, severity: "Low", title: "Data Update", fieldId: null, crop: null, time: "2 days ago", detail: "New satellite data available for your fields." },
  ],
  irrigationRecs: [
    { id: 1, fieldId: 101, crop: "Cotton", stress: "High", recommendation: "Immediate irrigation required", date: "20 May 2024", action: "Irrigate Now" },
    { id: 2, fieldId: 210, crop: "Soybean", stress: "Moderate", recommendation: "Irrigate within 48 hours", date: "21 May 2024", action: "Within 48h" },
    { id: 3, fieldId: 95, crop: "Wheat", stress: "Low", recommendation: "No irrigation needed", date: "-", action: "No Need" },
    { id: 4, fieldId: 104, crop: "Sugarcane", stress: "Moderate", recommendation: "Irrigate within 2 days", date: "21 May 2024", action: "Within 48h" },
    { id: 5, fieldId: 105, crop: "Rice", stress: "Low", recommendation: "No irrigation needed", date: "-", action: "No Need" },
  ],
  fields: [
    { id: 101, location: "Dhule, Maharashtra", crop: "Cotton", confidence: 96, area: 2.5, updated: "20 May 2024", stage: "Flowering", stress: "Moderate", ndwi: 0.32 },
    { id: 102, location: "Dhule, Maharashtra", crop: "Soybean", confidence: 93, area: 3.2, updated: "20 May 2024", stage: "Vegetative", stress: "High", ndwi: 0.18 },
    { id: 103, location: "Dhule, Maharashtra", crop: "Wheat", confidence: 95, area: 1.8, updated: "19 May 2024", stage: "Maturity", stress: "Low", ndwi: 0.45 },
    { id: 104, location: "Dhule, Maharashtra", crop: "Sugarcane", confidence: 97, area: 4.0, updated: "19 May 2024", stage: "Vegetative", stress: "Moderate", ndwi: 0.28 },
    { id: 105, location: "Dhule, Maharashtra", crop: "Rice", confidence: 92, area: 2.1, updated: "18 May 2024", stage: "Fruiting", stress: "Low", ndwi: 0.40 },
    { id: 106, location: "Dhule, Maharashtra", crop: "Maize", confidence: 90, area: 3.6, updated: "18 May 2024", stage: "Flowering", stress: "Low", ndwi: 0.42 },
    { id: 107, location: "Dhule, Maharashtra", crop: "Tur", confidence: 91, area: 1.5, updated: "17 May 2024", stage: "Vegetative", stress: "Moderate", ndwi: 0.30 },
    { id: 108, location: "Dhule, Maharashtra", crop: "Groundnut", confidence: 93, area: 2.7, updated: "17 May 2024", stage: "Flowering", stress: "Low", ndwi: 0.38 },
  ],
  growthStages: [
    { stage: "Vegetative", icon: "🌱", count: 120 },
    { stage: "Flowering", icon: "🌸", count: 70 },
    { stage: "Fruiting", icon: "🍅", count: 40 },
    { stage: "Maturity", icon: "🌾", count: 20 },
  ],
  moistureDistribution: [
    { name: "Low Stress", value: 72, color: "#22c55e" },
    { name: "Moderate Stress", value: 16, color: "#f59e0b" },
    { name: "High Stress", value: 11, color: "#ef4444" },
  ],
  reports: [
    { name: "Crop Health Report", description: "Overall health of your crops", fields: 250, date: "20 May 2024" },
    { name: "Moisture Stress Report", description: "Moisture stress analysis", fields: 250, date: "20 May 2024" },
    { name: "Growth Stage Report", description: "Growth stage summary", fields: 250, date: "19 May 2024" },
    { name: "Irrigation Report", description: "Irrigation recommendations", fields: 250, date: "19 May 2024" },
    { name: "Field Summary Report", description: "Summary of all fields", fields: 250, date: "18 May 2024" },
    { name: "Weather Impact Report", description: "Weather impact on crops", fields: 250, date: "18 May 2024" },
  ],
  reportStats: { totalReports: 24, fieldsAnalyzed: 250, alertsGenerated: 65, downloads: 18 },
  reportsOverview: [
    { month: "Jan", value: 12 }, { month: "Feb", value: 18 }, { month: "Mar", value: 22 },
    { month: "Apr", value: 26 }, { month: "May", value: 28 }, { month: "Jun", value: 30 },
  ],
  topFieldsInReports: [
    { name: "Field 101", value: 25, color: "#16a34a" },
    { name: "Field 210", value: 22, color: "#f59e0b" },
    { name: "Field 95", value: 18, color: "#3b82f6" },
    { name: "Field 115", value: 15, color: "#ef4444" },
    { name: "Others", value: 20, color: "#94a3b8" },
  ],
  ndvi: [
    { month: "Mar", value: 0.45 }, { month: "Apr", value: 0.52 }, { month: "May", value: 0.58 },
    { month: "Jun", value: 0.62 }, { month: "Jul", value: 0.65 }, { month: "Aug", value: 0.63 },
  ],
  profile: {
    name: "Rajesh Patil", role: "Farmer", email: "rajesh.patil@gmail.com",
    phone: "+91 98765 43210", location: "Dhule, Maharashtra", memberSince: "15 Jan 2024",
    totalFields: 8, cropsGrown: 5, landArea: 25.5, language: "English",
  },
};

// ---------- API METHODS ----------
export const api = {
  // Dashboard
  getDashboardStats: async () => (await request("/dashboard/stats")) || mock.stats,
  getCropDistribution: async () => (await request("/dashboard/crop-distribution")) || mock.cropDistribution,
  getMoistureOverview: async () => (await request("/dashboard/moisture-overview")) || mock.moistureOverview,

  // Alerts
  getAlerts: async () => (await request("/alerts")) || mock.alerts,
  markAlertRead: async (id) => request(`/alerts/${id}/read`, { method: "POST" }),

  // Fields & Map
  getFields: async () => (await request("/fields")) || mock.fields,
  getField: async (id) => (await request(`/fields/${id}`)) || mock.fields.find(f => f.id === Number(id)),

  // Crop classification
  getCropClassifications: async () => (await request("/crops/classifications")) || mock.fields,

  // Growth stages
  getGrowthStages: async () => (await request("/growth-stages")) || mock.growthStages,

  // Moisture
  getMoistureDistribution: async () => (await request("/moisture/distribution")) || mock.moistureDistribution,

  // Irrigation
  getIrrigationRecommendations: async () => (await request("/irrigation")) || mock.irrigationRecs,

  // Analytics
  getNdviTrend: async () => (await request("/analytics/ndvi")) || mock.ndvi,
  getAnalyticsOverview: async () => (await request("/analytics/overview")) || {
    avgNdvi: 0.62, avgNdwi: 0.35, totalFields: 250, alertsGenerated: 65,
  },

  // Reports
  getReports: async () => (await request("/reports")) || mock.reports,
  getReportsStats: async () => (await request("/reports/stats")) || mock.reportStats,
  getReportsOverview: async () => (await request("/reports/overview")) || mock.reportsOverview,
  getTopFieldsInReports: async () => (await request("/reports/top-fields")) || mock.topFieldsInReports,
  downloadReport: async (name) => request(`/reports/download?name=${encodeURIComponent(name)}`),

  // Profile / Settings (persist locally so changes survive reload)
  getProfile: async () => {
    const remote = await request("/profile");
    if (remote) return remote;
    if (typeof window !== "undefined") {
      try {
        const auth = JSON.parse(localStorage.getItem("kshetra_auth_user") || "null");
        const saved = JSON.parse(localStorage.getItem("kshetra_profile") || "null");
        const base = { ...mock.profile, ...(auth || {}), ...(saved || {}) };
        return base;
      } catch { /* noop */ }
    }
    return mock.profile;
  },
  updateProfile: async (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kshetra_profile", JSON.stringify(data));
      try {
        const auth = JSON.parse(localStorage.getItem("kshetra_auth_user") || "null");
        if (auth) {
          const next = { ...auth, name: data.name, email: data.email, phone: data.phone, location: data.location };
          localStorage.setItem("kshetra_auth_user", JSON.stringify(next));
          window.dispatchEvent(new Event("kshetra-auth"));
        }
      } catch { /* noop */ }
    }
    await request("/profile", { method: "PUT", body: data });
    return data;
  },
  updatePassword: async (data) => request("/profile/password", { method: "PUT", body: data }),
  getSettings: async () => {
    const remote = await request("/settings");
    if (remote) return remote;
    const defaults = {
      language: "English", theme: "Light", dateFormat: "DD MMM YYYY",
      timeFormat: "12 Hour", notifications: true, autoRefresh: true,
      mapView: "Satellite", fieldBoundaries: true, weatherLayer: true, soilLayer: true, zoom: 12,
      updateFrequency: "Daily", satelliteSource: "Sentinel-2", weatherSource: "IMD",
    };
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("kshetra_settings") || "null");
        return { ...defaults, ...(saved || {}) };
      } catch { /* noop */ }
    }
    return defaults;
  },
  updateSettings: async (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kshetra_settings", JSON.stringify(data));
      document.documentElement.lang = data.language === "हिन्दी" ? "hi" : data.language === "मराठी" ? "mr" : "en";
      document.documentElement.dataset.theme = (data.theme || "Light").toLowerCase();
      if ((data.theme || "Light").toLowerCase() === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      window.dispatchEvent(new CustomEvent("kshetra-settings", { detail: data }));
    }
    await request("/settings", { method: "PUT", body: data });
    return data;
  },
  getNotificationPreferences: async () => (await request("/settings/notifications")) || {
    inApp: true, email: true, sms: true, push: false,
    moistureStress: "High", irrigation: "Medium", growthStage: "Low",
    weather: "Medium", dataUpdates: "Low", general: "Low",
  },
  updateNotificationPreferences: async (data) => request("/settings/notifications", { method: "PUT", body: data }),

  // Irrigation actions (persist locally for the demo)
  markIrrigationDone: async (id) => {
    await request(`/irrigation/${id}/done`, { method: "POST" });
    if (typeof window !== "undefined") {
      try {
        const done = JSON.parse(localStorage.getItem("kshetra_irr_done") || "[]");
        if (!done.includes(id)) done.push(id);
        localStorage.setItem("kshetra_irr_done", JSON.stringify(done));
      } catch { /* noop */ }
    }
    return { ok: true, id };
  },

  // Reports — generate a CSV download client-side as a fallback
  downloadReport: async (name) => {
    const remote = await request(`/reports/download?name=${encodeURIComponent(name)}`);
    if (remote?.url) {
      if (typeof window !== "undefined") window.open(remote.url, "_blank");
      return remote;
    }
    if (typeof window !== "undefined") {
      const rows = [
        ["Field ID", "Crop", "Stage", "Stress", "Area (acres)", "NDWI", "Updated"],
        ...mock.fields.map(f => [f.id, f.crop, f.stage, f.stress, f.area, f.ndwi, f.updated]),
      ];
      const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([`# ${name}\n# Generated: ${new Date().toLocaleString()}\n\n${csv}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `${name.replace(/\s+/g, "_")}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    }
    return { ok: true };
  },

  // Chatbot — broad keyword router for offline demo
  sendChatMessage: async ({ message }) => {
    const res = await request("/chat", { method: "POST", body: { message } });
    if (res) return res;
    const m = (message || "").toLowerCase().trim();
    const has = (...keys) => keys.some(k => m.includes(k));
    let reply;
    if (!m) reply = "Please type a question about your farm.";
    else if (has("hello", "hi ", "hey", "namaste")) reply = "Hello Rajesh! 🌱 I can help with crop health, irrigation, weather, yield, alerts and reports. What would you like to know?";
    else if (has("irrigat", "water")) reply = "🚰 28 fields currently need irrigation. Field 101 (Cotton) is highest priority — soil moisture is critically low. Open Irrigation Recommendations for the full list.";
    else if (has("yield", "forecast", "harvest", "production")) reply = "📈 Projected season yield is up ~8.2% vs last year. Cotton: 19.4 q/ac, Wheat: 34.5 q/ac, Soybean: 23.7 q/ac. See AI Yield Forecast for details.";
    else if (has("weather", "rain", "temperature", "climate")) reply = "🌦️ Forecast for Dhule: light rain tomorrow (~12mm), 28–32°C this week. Hold off irrigation on low-stress fields for 24h.";
    else if (has("stress", "moisture", "dry", "ndwi")) reply = "💧 42 fields show moisture stress (16%). 11 are in the high-stress zone. Check the Moisture Stress page for the field-by-field NDWI map.";
    else if (has("alert", "notification")) reply = "🔔 You have 2 high-severity alerts: Field 101 (Cotton) and Field 115 (Sugarcane). Open Alerts & Notifications to review.";
    else if (has("crop", "classif")) reply = "🌾 We currently classify 8 crops on your farm: Cotton, Soybean, Wheat, Rice, Sugarcane, Maize, Tur, Groundnut — average confidence 93%.";
    else if (has("growth", "stage", "flower", "veget")) reply = "🌱 Growth stages: 120 vegetative, 70 flowering, 40 fruiting, 20 maturity fields. Open Growth Stages for the breakdown.";
    else if (has("pest", "disease", "insect")) reply = "🐛 No major pest outbreak detected. Monitor Fields 102 and 107 after the rainfall expected on the 22nd.";
    else if (has("fertili", "nitrogen", "urea", "nutrient")) reply = "🧪 Apply a nitrogen booster on Fields 102 and 107 within 5 days. Keep phosphorus steady on flowering-stage cotton.";
    else if (has("soil", "ph")) reply = "🪨 Average soil pH across your fields is 6.8 (slightly acidic, ideal for cotton & soybean).";
    else if (has("report", "download", "pdf", "csv")) reply = "📄 6 reports are available — Crop Health, Moisture Stress, Growth Stage, Irrigation, Field Summary and Weather Impact. Go to the Reports page to download.";
    else if (has("field 1", "field 2", "field 10", "field id", "which field")) reply = "🔎 Open the Field Map to inspect any field by ID. Each marker shows crop, stage, stress level and area.";
    else if (has("price", "market", "mandi", "sell")) reply = "💹 Live mandi prices are not connected in this demo. Once your backend is wired in I'll pull live Agmarknet data.";
    else if (has("thank")) reply = "You're welcome! 🌾 Anything else I can help with?";
    else if (has("help", "what can you", "feature")) reply = "I can answer questions on: irrigation, moisture stress, weather, yield forecast, growth stages, alerts, reports, crop classification and pests.";
    else reply = `I noted your question: "${message}". I can help with irrigation, moisture stress, yield forecast, weather, alerts, growth stages and reports — try asking about one of these.`;
    return { reply, timestamp: new Date().toISOString() };
  },

  // AI Crop Yield Forecast
  getYieldForecast: async (params) => {
    const res = await request("/yield/forecast", { method: "POST", body: params });
    if (res) return res;
    const base = { Cotton: 18, Soybean: 22, Wheat: 32, Rice: 28, Sugarcane: 75, Maize: 26 }[params?.crop || "Cotton"] || 20;
    const trend = Array.from({ length: 6 }, (_, i) => ({
      month: ["Mar", "Apr", "May", "Jun", "Jul", "Aug"][i],
      predicted: +(base * (0.8 + i * 0.05)).toFixed(1),
      lastYear: +(base * (0.75 + i * 0.045)).toFixed(1),
    }));
    return {
      crop: params?.crop || "Cotton",
      expectedYield: +(base * 1.08).toFixed(1),
      unit: "quintal/acre",
      changeVsLastYear: 8.2,
      confidence: 92,
      trend,
      factors: [
        { name: "Soil Moisture", impact: "Positive", score: 82 },
        { name: "Weather Forecast", impact: "Neutral", score: 65 },
        { name: "Growth Stage Health", impact: "Positive", score: 88 },
        { name: "Pest Risk", impact: "Low", score: 22 },
      ],
      recommendations: [
        "Maintain current irrigation schedule on flowering-stage fields.",
        "Apply nitrogen booster on Fields 102 and 107 within 5 days.",
        "Monitor pest activity after rainfall expected on 22 May.",
      ],
    };
  },

  // ---------- AUTH ----------
  // Backend endpoints to implement: POST /auth/login, /auth/signup, /auth/google, POST /auth/logout, GET /auth/me
  login: async ({ email, password }) => (await request("/auth/login", { method: "POST", body: { email, password } })),
  signup: async (data) => (await request("/auth/signup", { method: "POST", body: data })),
  googleLogin: async ({ idToken, role }) => (await request("/auth/google", { method: "POST", body: { idToken, role } })),
  logout: async () => (await request("/auth/logout", { method: "POST" })),
  me: async () => (await request("/auth/me")),

  // ---------- ADMIN (admin role only) ----------
  // GET /admin/users, PATCH /admin/users/:id, DELETE /admin/users/:id, GET /admin/stats, GET /admin/system-health
  adminListUsers: async () => (await request("/admin/users")) || [],
  adminUpdateUser: async (id, data) => request(`/admin/users/${id}`, { method: "PATCH", body: data }),
  adminDeleteUser: async (id) => request(`/admin/users/${id}`, { method: "DELETE" }),
  adminGetStats: async () => (await request("/admin/stats")) || { totalUsers: 0, farmers: 0, admins: 0, totalFields: 250 },
  adminGetSystemHealth: async () => (await request("/admin/system-health")) || [
    { name: "API Gateway", status: "Operational" },
    { name: "Database", status: "Operational" },
    { name: "AI Inference", status: "Operational" },
    { name: "Satellite Feed", status: "Operational" },
  ],
};

export default api;
