"use client";

import { SearchFilters } from "@/search/types";

export function MapListToggle({
  viewMode,
  onChange,
}: {
  viewMode: SearchFilters["viewMode"];
  onChange: (mode: SearchFilters["viewMode"]) => void;
}) {
  return (
    <div className="inline-flex border rounded overflow-hidden">
      <button className={`px-3 py-2 ${viewMode === "list" ? "bg-slate-900 text-white" : "bg-white"}`} onClick={() => onChange("list")}>List</button>
      <button className={`px-3 py-2 ${viewMode === "map" ? "bg-slate-900 text-white" : "bg-white"}`} onClick={() => onChange("map")}>Map</button>
    </div>
  );
}
