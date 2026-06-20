import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Analytics from "../pages/Analytics.jsx";
export const Route = createFileRoute("/analytics")({ component: () => <Layout title="Analytics"><Analytics /></Layout> });
