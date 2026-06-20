import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Reports from "../pages/Reports.jsx";
export const Route = createFileRoute("/reports")({ component: () => <Layout title="Reports"><Reports /></Layout> });
