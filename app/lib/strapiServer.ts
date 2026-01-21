export const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  "http://localhost:1337";

export const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || "";

export function strapiAuthHeaders() {
  if (!STRAPI_TOKEN) return {};
  return { Authorization: `Bearer ${STRAPI_TOKEN}` };
}
