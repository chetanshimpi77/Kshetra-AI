import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Profile from "../pages/Profile.jsx";
export const Route = createFileRoute("/profile")({ component: () => <Layout title="Profile"><Profile /></Layout> });
