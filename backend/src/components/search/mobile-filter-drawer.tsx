"use client";

import { useState } from "react";
import { SearchFilters } from "@/search/types";
import { FilterSidebar } from "@/components/search/filter-sidebar";

export function MobileFilterDrawer(props: {
  filters: SearchFilters;
  patch: (next: Partial<SearchFilters>) => void;
  togglePropertyType: (propertyType: string) => void;
  onApply: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button className="border rounded px-3 py-2" onClick={() => setOpen(true)}>Filters</button>
      {open ? (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-[88%] bg-white p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Filters</h2>
              <button className="border rounded px-2 py-1" onClick={() => setOpen(false)}>Close</button>
            </div>
            <FilterSidebar {...props} onApply={() => { props.onApply(); setOpen(false); }} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
