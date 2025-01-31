import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const url = searchParams.get("url");

		if (!url) {
			return NextResponse.json({ error: "URL is required" }, { status: 400 });
		}

		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});
		const page = await browser.newPage();
		await page.goto(url, { waitUntil: "domcontentloaded" });

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
