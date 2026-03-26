import { LocaleCode } from "@prisma/client";

export type LocalizedInput = {
  titleEn?: string | null;
  titleKm?: string | null;
  descriptionEn?: string | null;
  descriptionKm?: string | null;
  bodyEn?: string | null;
  bodyKm?: string | null;
};

export function normalizeLocale(locale?: string | null): LocaleCode {
  if (locale?.toLowerCase().startsWith("km")) return LocaleCode.KM;
  return LocaleCode.EN;
}

export function localizedField<T extends LocalizedInput>(input: T, locale: LocaleCode, field: "title" | "description" | "body") {
  if (field === "title") return locale === LocaleCode.KM ? input.titleKm ?? input.titleEn ?? "" : input.titleEn ?? input.titleKm ?? "";
  if (field === "description") return locale === LocaleCode.KM ? input.descriptionKm ?? input.descriptionEn ?? "" : input.descriptionEn ?? input.descriptionKm ?? "";
  return locale === LocaleCode.KM ? input.bodyKm ?? input.bodyEn ?? "" : input.bodyEn ?? input.bodyKm ?? "";
}
