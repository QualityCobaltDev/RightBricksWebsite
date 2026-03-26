import { env } from "@/config/env";
import { SearchResultItem } from "@/search/types";

export function MapPlaceholder({ items }: { items: SearchResultItem[] }) {
  return (
    <section className="rounded border bg-white p-4 min-h-[420px]">
      <h3 className="font-semibold">Map View</h3>
      <p className="text-sm text-slate-500">Provider style: {env.MAP_STYLE_URL}</p>
      <p className="text-sm text-slate-500">Default center: {env.MAP_DEFAULT_LAT}, {env.MAP_DEFAULT_LNG}</p>
      <p className="text-sm text-slate-500">Zoom: {env.MAP_DEFAULT_ZOOM}</p>
      <div className="mt-3 text-xs text-slate-600 space-y-1">
        {items.slice(0, 20).map((item) => (
          <p key={item.id}>• {item.title} ({item.latitude}, {item.longitude})</p>
        ))}
      </div>
    </section>
  );
}
