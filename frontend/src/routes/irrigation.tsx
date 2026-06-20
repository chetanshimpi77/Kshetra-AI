import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Irrigation from "../pages/Irrigation.jsx";
export const Route = createFileRoute("/irrigation")({ component: () => <Layout title="Irrigation Recommendations"><Irrigation /></Layout> });
