import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Settings from "../pages/Settings.jsx";
export const Route = createFileRoute("/settings")({ component: () => <Layout title="Settings"><Settings /></Layout> });
