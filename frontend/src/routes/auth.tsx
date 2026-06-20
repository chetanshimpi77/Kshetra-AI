import { createFileRoute } from "@tanstack/react-router";
import Auth from "../pages/Auth.jsx";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Kshetra AI" }] }),
  component: Auth,
});
