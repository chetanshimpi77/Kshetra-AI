import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout.jsx";
import CropClassification from "../pages/CropClassification.jsx";
export const Route = createFileRoute("/crop-classification")({ component: () => <Layout title="Crop Classification"><CropClassification /></Layout> });
