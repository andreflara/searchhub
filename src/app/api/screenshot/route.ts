import { NextResponse } from "next/server";
import { chromium } from "playwright";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const browser = await chromium.launch({
            headless: true,
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ]
        });

        const context = await browser.newContext({
            // Optional: Add more context options
            viewport: { width: 1280, height: 720 },
            bypassCSP: true
        });

        const page = await context.newPage();
        
        try {
            await page.goto(url, { 
                waitUntil: "networkidle", 
                timeout: 90000  // Increased timeout
            });
        } catch (navigationError) {
            console.error("Navigation error:", navigationError);
            await browser.close();
            return NextResponse.json(
                { error: "Failed to navigate to URL", details: navigationError },
                { status: 500 }
            );
        }

        const screenshotBuffer = await page.screenshot({
            fullPage: true,  // Capture entire page
            type: 'png'
        });

        await browser.close();

        return new NextResponse(screenshotBuffer, {
            headers: {
                "Content-Type": "image/png",
            },
        });
    } catch (error) {
        console.error("Comprehensive error capturing screenshot:", error);
        return NextResponse.json(
            { error: "Failed to capture screenshot", details: error },
            { status: 500 },
        );
    }
}