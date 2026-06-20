import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Alerts from "../pages/Alerts.jsx";
export const Route = createFileRoute("/alerts")({ component: () => <Layout title="Alerts & Notifications"><Alerts /></Layout> });
