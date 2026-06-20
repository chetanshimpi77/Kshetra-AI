import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import GrowthStages from "../pages/GrowthStages.jsx";
export const Route = createFileRoute("/growth-stages")({ component: () => <Layout title="Growth Stages"><GrowthStages /></Layout> });
