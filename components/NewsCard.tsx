// components/NewsCard.tsx
import React from "react";

interface NewsCardProps {
  title: string;
  imageUrl: string;
  newsUrl: string;
}

const NewsCard: React.FC<NewsCardProps> = ({ title, imageUrl, newsUrl }) => {
  return (
    <a
      href={newsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
    >
      <img
        className="w-full h-48 object-cover"
        src={imageUrl}
        alt={title}
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2">
          {title}
        </h2>
      </div>
    </a>
  );
};

export default NewsCard;
