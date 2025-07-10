import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
};

export default function useFetchCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, setCategories };
}
