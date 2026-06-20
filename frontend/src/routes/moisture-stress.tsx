import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import MoistureStress from "../pages/MoistureStress.jsx";
export const Route = createFileRoute("/moisture-stress")({ component: () => <Layout title="Moisture Stress"><MoistureStress /></Layout> });
