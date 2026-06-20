import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import YieldForecast from "../pages/YieldForecast.jsx";
export const Route = createFileRoute("/yield-forecast")({ component: () => <Layout title="AI Crop Yield Forecast"><YieldForecast /></Layout> });
