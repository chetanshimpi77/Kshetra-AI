import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import FieldMap from "../pages/FieldMap.jsx";
export const Route = createFileRoute("/field-map")({ component: () => <Layout title="Field Map"><FieldMap /></Layout> });
