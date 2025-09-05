// app/sitemap.js
export default async function sitemap() {
  const baseUrl = "https://www.rescisaonline.com.br";

  // Páginas estáticas
  const staticRoutes = [
    "",
    "/blog", // 👈 aqui entra a listagem do blog
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return staticRoutes;
}
