export default function useAddCategory() {
  const addCategory = async (name: string) => {
    try {
      const res = await fetch("/api/expense/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name}),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error("Failed to add category:", err);
      return null;
    }
  };

  return { addCategory };
}
