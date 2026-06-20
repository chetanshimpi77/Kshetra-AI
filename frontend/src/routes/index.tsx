import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Dashboard from "../pages/Dashboard.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kshetra AI — Smart Fields. Better Future." },
      { name: "description", content: "AI & satellite-powered farm intelligence for crop health, irrigation and yield forecasting." },
    ],
  }),
  component: () => <Layout title="Dashboard"><Dashboard /></Layout>,
});
