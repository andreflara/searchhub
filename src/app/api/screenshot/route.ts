import { NextResponse } from "next/server";
import { chromium } from "playwright"; // ou outro navegador, como 'firefox' ou 'webkit'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const url = searchParams.get("url");

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		// Lançando o navegador com Playwright
		const browser = await chromium.launch({
			headless: true,
		});

		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

		console.log("Capturing screenshot for URL:", url);

		// Capturando o screenshot
		const screenshotBuffer = await page.screenshot();
		await browser.close();

		return new NextResponse(screenshotBuffer, {
			headers: {
				"Content-Type": "image/png",
			},
		});
	} catch (error) {
		console.error("Error capturing screenshot:", error);
		return NextResponse.json(
			{ error: "Failed to capture screenshot" },
			{ status: 500 },
		);
	}
}
