import { type NextRequest, NextResponse } from "next/server";

interface LinkPreviewResponse {
	title?: string;
	description?: string;
	image?: string;
	url?: string;
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		let url = searchParams.get("url");

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		// Adiciona "https://" se a URL não tiver um protocolo
		if (!/^https?:\/\//i.test(url)) {
			url = `https://${url}`;
		}

		const API_KEY = process.env.LINK_PREVIEW_API_KEY;
		if (!API_KEY) {
			return NextResponse.json(
				{ error: "API key is missing" },
				{ status: 500 },
			);
		}

		if (process.env.NODE_ENV === "development") {
			console.log("Fetching metadata for:", url);
		}

		const response = await fetch(
			`https://api.linkpreview.net/?key=${API_KEY}&q=${encodeURIComponent(url)}`,
			{ method: "GET" },
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("API response error:", response.status, errorText);
			return NextResponse.json(
				{ error: `Failed to fetch preview: ${errorText}` },
				{ status: response.status },
			);
		}

		const data: LinkPreviewResponse = await response.json();

		if (process.env.NODE_ENV === "development") {
			console.log("Preview data received:", data);
		}

		return NextResponse.json({
			title: data.title || url,
			description: data.description || "Sem descrição",
			image: data.image || "",
			url: data.url || url,
		});
	} catch (error) {
		console.error("Error fetching metadata:", error);
		return NextResponse.json(
			{
				error: "Failed to retrieve preview data",
				details: (error as Error).message,
			},
			{ status: 500 },
		);
	}
}
