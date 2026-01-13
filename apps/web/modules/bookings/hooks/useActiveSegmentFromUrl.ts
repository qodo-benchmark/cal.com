import { useQueryState } from "nuqs";

export function useActiveSegmentFromUrl() {
    return useQueryState<"info" | "history" | null>("activeSegment", {
        defaultValue: null,
        parse: (value) => {
            if (!value) return null;
            if (value === "history") return "history";
            if (value === "info") return "info";
            return null;
        },
    });
}

