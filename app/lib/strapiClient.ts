export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fp_jwt");
}

export function setToken(jwt: string | null) {
  if (typeof window === "undefined") return;
  if (!jwt) localStorage.removeItem("fp_jwt");
  else localStorage.setItem("fp_jwt", jwt);
}

export async function strapiFetch<T>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const url = path.startsWith("http") ? path : `${STRAPI_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers as any),
  };

  if (opts.auth) {
    const jwt = getToken();
    if (jwt) headers.Authorization = `Bearer ${jwt}`;
  }

  const res = await fetch(url, {
    ...opts,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
  }

  return (await res.json()) as T;
}
