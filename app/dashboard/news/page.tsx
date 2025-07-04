import React from "react";
import NewsCard from "@/components/NewsCard";

interface NewsItem {
  headline: string;
  image: string;
  url: string;
}

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch("http://localhost:3000/api/news", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }
  return res.json();
}



export default async function NewsPage() {
  const news = await fetchNews();

  // Filter out news items with missing URL or headline
  const filteredNews = news.filter(
    (item) => item.url && item.headline && item.image
  );

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredNews.map((item, idx) => (
        <NewsCard
          key={idx}
          title={item.headline}
          imageUrl={item.image}
          newsUrl={item.url}
        />
      ))}
    </div>
  );
}
