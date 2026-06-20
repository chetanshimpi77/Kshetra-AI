import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import Chatbot from "../pages/Chatbot.jsx";
export const Route = createFileRoute("/chatbot")({ component: () => <Layout title="AI Assistant"><Chatbot /></Layout> });
