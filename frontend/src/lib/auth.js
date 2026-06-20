// Lightweight client-only auth store (mock). Backend can later replace these.
import { useEffect, useState } from "react";

const KEY = "kshetra_auth_user";
const USERS_KEY = "kshetra_users";

const seedUsers = () => {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([
      { id: 1, name: "Admin", email: "admin@kshetra.ai", password: "admin123", role: "admin", phone: "+91 90000 00000", location: "HQ" },
      { id: 2, name: "Rajesh Patil", email: "rajesh.patil@gmail.com", password: "farmer123", role: "farmer", phone: "+91 98765 43210", location: "Dhule, Maharashtra" },
    ]));
  }
};

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  seedUsers();
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
}
export function setCurrentUser(u) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("kshetra-auth"));
}
export function getAllUsers() {
  if (typeof window === "undefined") return [];
  seedUsers();
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
export function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

export function login({ email, password }) {
  const users = getAllUsers();
  const u = users.find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
  if (!u) throw new Error("Invalid email or password");
  const { password: _p, ...safe } = u;
  setCurrentUser(safe);
  return safe;
}

export function signup({ name, email, password, role = "farmer", phone = "", location = "" }) {
  const users = getAllUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("An account with this email already exists");
  }
  const newU = { id: Date.now(), name, email, password, role, phone, location };
  users.push(newU);
  saveUsers(users);
  const { password: _p, ...safe } = newU;
  setCurrentUser(safe);
  return safe;
}

export function loginWithGoogle({ role = "farmer" } = {}) {
  // Mock Google sign-in. Real backend should exchange tokens.
  const users = getAllUsers();
  const email = role === "admin" ? "google.admin@gmail.com" : "google.farmer@gmail.com";
  let u = users.find(x => x.email === email);
  if (!u) {
    u = { id: Date.now(), name: role === "admin" ? "Google Admin" : "Google Farmer", email, password: "google-oauth", role, phone: "", location: "" };
    users.push(u); saveUsers(users);
  }
  const { password: _p, ...safe } = u;
  setCurrentUser(safe);
  return safe;
}

export function logout() { setCurrentUser(null); }

export function useAuth() {
  const [user, setUser] = useState(() => getCurrentUser());
  useEffect(() => {
    const sync = () => setUser(getCurrentUser());
    window.addEventListener("kshetra-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("kshetra-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return user;
}
