"use client";

import { useState } from "react";

export function HomepageSectionsManager() {
  const [sections, setSections] = useState([
    { id: "hero", label: "Hero", enabled: true },
    { id: "featured", label: "Featured Listings", enabled: true },
    { id: "guides", label: "Guides", enabled: true },
  ]);

  return (
    <section className="rounded border bg-white p-4 space-y-3">
      <h3 className="text-lg font-semibold">Homepage Sections Manager</h3>
      {sections.map((section) => (
        <label key={section.id} className="flex items-center justify-between border rounded p-3">
          <span>{section.label}</span>
          <input
            type="checkbox"
            checked={section.enabled}
            onChange={(e) =>
              setSections((prev) => prev.map((s) => (s.id === section.id ? { ...s, enabled: e.target.checked } : s)))
            }
          />
        </label>
      ))}
    </section>
  );
}
