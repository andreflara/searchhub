import { NextResponse } from "next/server";

const OPENGRAPH_API_KEY = process.env.OPENGRAPH_API_KEY;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        if (!OPENGRAPH_API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        const apiUrl = `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${OPENGRAPH_API_KEY}`;

        const response = await fetch(apiUrl);

        // Verifica se a resposta é realmente JSON
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
            const text = await response.text();
            console.error("Resposta inesperada da API:", text);
            return NextResponse.json({ error: "Invalid response from OpenGraph.io" }, { status: 500 });
        }

        const data = await response.json();

        if (!data || !data.hybridGraph) {
            return NextResponse.json({ error: "No OpenGraph data found" }, { status: 404 });
        }

        return NextResponse.json({
            title: data.hybridGraph.title || "",
            description: data.hybridGraph.description || "",
            image: data.hybridGraph.image || "",
            url: data.hybridGraph.url || url
        });
    } catch (error) {
        console.error("OpenGraph fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch OpenGraph data", details: String(error) },
            { status: 500 }
        );
    }
}