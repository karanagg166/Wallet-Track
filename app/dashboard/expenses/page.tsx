"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import useAddCategory from "@/hooks/category/useAddCategory";
import useDeleteCategory from "@/hooks/category/useDeleteCategory";
import useFetchCategories from "@/hooks/category/useFetchCategories";

type Category = {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
};

const schema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  paymentmethod: z.enum(["cash", "card", "upi", "e-ruppee", "netbanking", "other"], {
    errorMap: () => ({ message: "Select a payment method" }),
  }),
  date: z.string().nonempty("Date is required"),
  time: z.string().nonempty("Time is required"),
  title: z.string().nonempty("Title is required"),
  category: z.string().nonempty("Category is required"),
});

type ExpenseFormInputs = z.infer<typeof schema>;

const ExpenseForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExpenseFormInputs>({
    resolver: zodResolver(schema),
  });

  const { categories, loading, error, setCategories } = useFetchCategories();
  const { addCategory } = useAddCategory();
  const { deleteCategory } = useDeleteCategory();
  const router = useRouter();

  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const onAddCategory = async (name: string) => {
    const result = await addCategory(name);
    if (result && result.data) {
      setCategories((prev) => [...prev, result.data]);
      return result;
    } else {
      alert(result?.message || "Failed to add category");
    }
  };

  const onDeleteCategory = async (id: string) => {
    const result = await deleteCategory(id);
    if (result && result.message === "Category deleted successfully") {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } else {
      alert("Failed to delete category");
    }
  };

  const onSubmit = async (data: ExpenseFormInputs) => {
    try {
      console.log(data.category);
      const response = await fetch("/api/expense/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Failed to add expense");
      } else {
        alert("Expense successfully added");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Add expense error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-indigo-900 to-black p-4"
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 w-full max-w-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Add New Expense</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <input
              {...register("title")}
              placeholder="Title"
              className={clsx(
                "w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-purple-400 transition-all",
                errors.title && "border border-red-400"
              )}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder="Amount"
              className={clsx(
                "w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-purple-400 transition-all",
                errors.amount && "border border-red-400"
              )}
            />
            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div>
            {showNewCategoryInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (newCategory.trim()) {
                      const added = await onAddCategory(newCategory.trim());
                      setNewCategory("");
                      setShowNewCategoryInput(false);
                      if (added?.data?.name) {
                        setValue("category", added.data.name);
                      }
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryInput(false);
                    setNewCategory("");
                  }}
                  className="text-white px-3 py-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                {...register("category")}
                className={clsx(
                  "w-full px-4 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400 transition-all",
                  errors.category && "border border-red-400"
                )}
                defaultValue=""
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "__add_new__") {
                    setShowNewCategoryInput(true);
                  } else {
                    setValue("category", value);
                  }
                }}
              >
                <option value="" disabled hidden>
                  Select Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="__add_new__">+ Add new category...</option>
              </select>
            )}
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <select
              {...register("paymentmethod")}
              className={clsx(
                "w-full px-4 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400 transition-all",
                errors.paymentmethod && "border border-red-400"
              )}
              defaultValue=""
            >
              <option value="" disabled hidden>
                Select Payment Method
              </option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="e-ruppee">e-RUPI</option>
              <option value="netbanking">Netbanking</option>
              <option value="other">Other</option>
            </select>
            {errors.paymentmethod && (
              <p className="text-red-400 text-sm mt-1">{errors.paymentmethod.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <input
              type="date"
              {...register("date")}
              className={clsx(
                "w-full px-4 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400 transition-all",
                errors.date && "border border-red-400"
              )}
            />
            {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
          </div>

          {/* Time */}
          <div>
            <input
              type="time"
              {...register("time")}
              className={clsx(
                "w-full px-4 py-2 rounded-xl bg-white/10 text-white outline-none focus:ring-2 focus:ring-purple-400 transition-all",
                errors.time && "border border-red-400"
              )}
            />
            {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Submit Expense
          </motion.button>
        </form>

        {/* Category Manager */}
        <div className="mt-8">
          <h3 className="text-white text-lg font-semibold mb-2">Manage Categories</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
              className="flex-1 px-3 py-2 rounded bg-white/20 placeholder-white/70 text-white"
            />
            <button
              className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 text-white"
              onClick={async () => {
                if (newCategory.trim()) {
                  await onAddCategory(newCategory.trim());
                  setNewCategory("");
                }
              }}
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center bg-white/10 px-3 py-2 rounded text-white"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="text-sm text-red-400 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseForm;
