import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import WaterAdvisory from "../pages/WaterAdvisory.jsx";
export const Route = createFileRoute("/water-advisory")({ component: () => <Layout title="Water Advisory"><WaterAdvisory /></Layout> });
