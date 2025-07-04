import { NextResponse } from "next/server";
const apiKey = process.env.FINNHUB_API_KEY;

export async function GET() {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`,
      { cache: "no-store" } // prevent caching
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch news from Finnhub" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching Finnhub news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
