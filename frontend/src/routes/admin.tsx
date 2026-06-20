import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
export const Route = createFileRoute("/admin")({ component: () => <Layout title="Admin Dashboard" adminOnly><AdminDashboard /></Layout> });
