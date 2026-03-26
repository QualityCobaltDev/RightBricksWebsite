import { LocaleCode } from "@prisma/client";
import { localizedField } from "@/seo/i18n";

export function BilingualContent({
  locale,
  input,
}: {
  locale: LocaleCode;
  input: {
    titleEn?: string | null;
    titleKm?: string | null;
    descriptionEn?: string | null;
    descriptionKm?: string | null;
    bodyEn?: string | null;
    bodyKm?: string | null;
  };
}) {
  const title = localizedField(input, locale, "title");
  const description = localizedField(input, locale, "description");
  const body = localizedField(input, locale, "body");

  return (
    <article className="prose max-w-none">
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
      {body ? <div>{body}</div> : null}
    </article>
  );
}
