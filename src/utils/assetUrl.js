const baseHref = typeof window !== "undefined" ? window.location.href : import.meta.url;
const assetBase = new URL(import.meta.env.BASE_URL, baseHref);

export const assetUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalizedPath, assetBase).toString();
};
