"use client";

export function ListingStatusControls({ listingId }: { listingId: string }) {
  async function act(action: "draft" | "publish" | "archive") {
    const statusMap: Record<typeof action, string> = {
      draft: "DRAFT",
      publish: "PUBLISHED",
      archive: "ARCHIVED",
    };

    await fetch(`/api/listings/${listingId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: statusMap[action] }),
    });
  }

  return (
    <div className="flex gap-2">
      <button className="border rounded px-3 py-2" onClick={() => act("draft")}>Move to Draft</button>
      <button className="border rounded px-3 py-2" onClick={() => act("publish")}>Publish</button>
      <button className="border rounded px-3 py-2" onClick={() => act("archive")}>Archive</button>
    </div>
  );
}
