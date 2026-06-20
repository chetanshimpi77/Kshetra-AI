import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import AdminUsers from "../pages/AdminUsers.jsx";
export const Route = createFileRoute("/admin/users")({ component: () => <Layout title="User Management" adminOnly><AdminUsers /></Layout> });
