import crypto from "node:crypto";

export type SignedUpload = {
  uploadUrl: string;
  objectKey: string;
  expiresAt: string;
  headers: Record<string, string>;
};

export function privateBucketName() {
  return process.env.S3_PRIVATE_BUCKET ?? "rightbricks-private-kyc";
}

export function buildPrivateObjectKey(scope: "verification" | "moderation", filename: string, actorId: string) {
  const safeName = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const random = crypto.randomUUID();
  return `${scope}/${actorId}/${Date.now()}-${random}-${safeName}`;
}

export async function generatePrivateUploadUrl(input: {
  scope: "verification" | "moderation";
  filename: string;
  contentType: string;
  actorId: string;
}): Promise<SignedUpload> {
  const endpoint = process.env.S3_PRIVATE_ENDPOINT ?? process.env.S3_ENDPOINT;
  if (!endpoint) {
    throw new Error("S3 private endpoint is not configured");
  }

  const key = buildPrivateObjectKey(input.scope, input.filename, input.actorId);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10).toISOString();

  return {
    uploadUrl: `${endpoint}/${privateBucketName()}/${key}`,
    objectKey: key,
    expiresAt,
    headers: {
      "content-type": input.contentType,
      "x-amz-acl": "private",
    },
  };
}
