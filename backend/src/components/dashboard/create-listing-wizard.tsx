"use client";

import { useState } from "react";

type WizardInput = {
  slug: string;
  listingType: "SALE" | "RENT";
  propertyType: string;
  addressLine1: string;
  provinceId: string;
  districtId: string;
  priceUsd: string;
  bedrooms: string;
  bathrooms: string;
  titleEn: string;
  descriptionEn: string;
};

const initialState: WizardInput = {
  slug: "",
  listingType: "SALE",
  propertyType: "APARTMENT",
  addressLine1: "",
  provinceId: "",
  districtId: "",
  priceUsd: "",
  bedrooms: "",
  bathrooms: "",
  titleEn: "",
  descriptionEn: "",
};

export function CreateListingWizard() {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<WizardInput>(initialState);

  function patch<K extends keyof WizardInput>(key: K, value: WizardInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    await fetch("/api/listings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...values,
        priceUsd: Number(values.priceUsd),
        bedrooms: values.bedrooms ? Number(values.bedrooms) : undefined,
        bathrooms: values.bathrooms ? Number(values.bathrooms) : undefined,
        latitude: 11.5564,
        longitude: 104.9282,
      }),
    });
    setStep(1);
    setValues(initialState);
  }

  return (
    <section className="rounded border bg-white p-4 space-y-4">
      <h3 className="text-lg font-semibold">Create Listing Wizard</h3>
      <p className="text-sm text-slate-500">Step {step} of 3</p>

      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded p-2" placeholder="Slug" value={values.slug} onChange={(e) => patch("slug", e.target.value)} />
          <input className="border rounded p-2" placeholder="Property type" value={values.propertyType} onChange={(e) => patch("propertyType", e.target.value)} />
          <select className="border rounded p-2" value={values.listingType} onChange={(e) => patch("listingType", e.target.value as "SALE" | "RENT")}>
            <option value="SALE">Sale</option>
            <option value="RENT">Rent</option>
          </select>
          <input className="border rounded p-2" placeholder="Address" value={values.addressLine1} onChange={(e) => patch("addressLine1", e.target.value)} />
        </div>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded p-2" placeholder="Province ID" value={values.provinceId} onChange={(e) => patch("provinceId", e.target.value)} />
          <input className="border rounded p-2" placeholder="District ID" value={values.districtId} onChange={(e) => patch("districtId", e.target.value)} />
          <input className="border rounded p-2" placeholder="Price (USD)" value={values.priceUsd} onChange={(e) => patch("priceUsd", e.target.value)} />
          <input className="border rounded p-2" placeholder="Bedrooms" value={values.bedrooms} onChange={(e) => patch("bedrooms", e.target.value)} />
          <input className="border rounded p-2" placeholder="Bathrooms" value={values.bathrooms} onChange={(e) => patch("bathrooms", e.target.value)} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <input className="border rounded p-2 w-full" placeholder="English title" value={values.titleEn} onChange={(e) => patch("titleEn", e.target.value)} />
          <textarea className="border rounded p-2 w-full" rows={5} placeholder="English description" value={values.descriptionEn} onChange={(e) => patch("descriptionEn", e.target.value)} />
        </div>
      )}

      <div className="flex gap-2">
        <button className="border rounded px-3 py-2" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
        {step < 3 ? (
          <button className="border rounded px-3 py-2" onClick={() => setStep((s) => Math.min(3, s + 1))}>Next</button>
        ) : (
          <button className="bg-slate-900 text-white rounded px-3 py-2" onClick={submit}>Submit for Moderation</button>
        )}
      </div>
    </section>
  );
}
