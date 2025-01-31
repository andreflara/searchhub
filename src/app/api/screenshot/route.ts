import { NextResponse } from "next/server";
import playwright from 'playwright-core';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        const browser = await playwright.chromium.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage'
            ]
        });

        const context = await browser.newContext({
            viewport: { width: 1280, height: 720 },
            bypassCSP: true
        });

        const page = await context.newPage();

        try {
            await page.goto(url, { 
                waitUntil: "networkidle", 
                timeout: 30000 
            });
        } catch (navigationError) {
            console.error("Navigation error:", navigationError);
            await browser.close();
            return NextResponse.json(
                { error: "Navigation failed", details: String(navigationError) },
                { status: 500 }
            );
        }

        const screenshotBuffer = await page.screenshot({
            fullPage: true
        });

        await browser.close();

        return new NextResponse(screenshotBuffer, {
            headers: { "Content-Type": "image/png" }
        });
    } catch (error) {
        console.error("Screenshot capture error:", error);
        return NextResponse.json(
            { error: "Failed to capture screenshot", details: String(error) },
            { status: 500 }
        );
    }
}