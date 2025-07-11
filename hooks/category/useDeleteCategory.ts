export default function useDeleteCategory() {
  const deleteCategory = async (categoryId: string) => {
    try {
      const res = await fetch("/api/expense/category", {
        method: "DELETE",
        body: JSON.stringify({ categoryId }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Failed to delete category:", err);
      return null;
    }
  };

  return { deleteCategory };
}
