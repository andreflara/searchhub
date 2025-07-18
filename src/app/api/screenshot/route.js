export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") || "https://google.com";

  const token = process.env.SCREENSHOT_API_KEY;
  const encodedUrl = encodeURIComponent(url);
  const output = "image";
  const file_type = "png";

  const apiUrl = `https://shot.screenshotapi.net/screenshot?token=${token}&url=${encodedUrl}&output=${output}&file_type=${file_type}`;

  try {
    const response = await fetch(apiUrl);
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Erro ao capturar imagem:", error);
    return new Response("Erro interno", { status: 500 });
  }
}
