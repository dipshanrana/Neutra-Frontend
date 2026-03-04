"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";

export default function AnalyticsTracker() {
    useEffect(() => {
        // Record visit on initial load
        // We use a small delay or check to avoid duplicates during dev reloads if needed,
        // but a simple call on mount is usually sufficient for basic IP tracking.
        const record = async () => {
            try {
                await api.analytics.recordVisit();
            } catch (err) {
                // Silently fail for analytics
                console.warn("Analytics tracking failed:", err);
            }
        };

        record();
    }, []);

    return null;
}
