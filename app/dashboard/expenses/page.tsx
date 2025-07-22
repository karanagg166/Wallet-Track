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
import { CreditCard, Calendar, Clock, Tag, Layers, PlusCircle, Trash2 } from "lucide-react";

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
      //console.log(data);
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
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 20% 30%, #0f172a 60%, #1e293b 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.03, boxShadow: '0 0 0 2px #38bdf8, 0 8px 40px #0008' }}
        className="backdrop-blur-xl bg-white/10 border border-[#232b45] rounded-3xl p-10 w-full max-w-2xl shadow-2xl relative"
        style={{ boxShadow: "0 8px 40px #0008" }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Layers size={32} className="text-[#38bdf8] drop-shadow" />
          <h2 className="text-3xl font-extrabold text-[#e0e7ef] text-center tracking-wide">Add New Expense</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div className="relative">
            <Tag size={18} className="absolute left-3 top-3 text-[#6366f1] opacity-80" />
            <input
              {...register("title")}
              placeholder="Title"
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] placeholder-[#94a3b8] outline-none focus:ring-2 focus:ring-[#38bdf8] border border-transparent focus:border-[#38bdf8] transition-all text-lg",
                errors.title && "border border-red-400 focus:border-red-400 focus:ring-red-400"
              )}
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div className="relative">
            <CreditCard size={18} className="absolute left-3 top-3 text-[#38bdf8] opacity-80" />
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder="Amount"
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] placeholder-[#94a3b8] outline-none focus:ring-2 focus:ring-[#38bdf8] border border-transparent focus:border-[#38bdf8] transition-all text-lg",
                errors.amount && "border border-red-400 focus:border-red-400 focus:ring-red-400"
              )}
            />
            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div className="relative">
            <Layers size={18} className="absolute left-3 top-3 text-[#38bdf8] opacity-80" />
            {showNewCategoryInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] placeholder-[#94a3b8] outline-none focus:ring-2 focus:ring-[#38bdf8] border border-transparent focus:border-[#38bdf8] transition-all text-lg"
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
                  className="bg-[#22c55e] text-white px-4 py-2 rounded-full font-bold hover:bg-[#16a34a] transition"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategoryInput(false);
                    setNewCategory("");
                  }}
                  className="text-[#e0e7ef] px-3 py-2 hover:text-red-400 transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                {...register("category")}
                className={clsx(
                  "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] outline-none focus:ring-2 focus:ring-[#38bdf8] border border-transparent focus:border-[#38bdf8] transition-all text-lg",
                  errors.category && "border border-red-400 focus:border-red-400 focus:ring-red-400"
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
          <div className="relative">
            <CreditCard size={18} className="absolute left-3 top-3 text-[#6366f1] opacity-80" />
            <select
              {...register("paymentmethod")}
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] outline-none focus:ring-2 focus:ring-[#6366f1] border border-transparent focus:border-[#6366f1] transition-all text-lg",
                errors.paymentmethod && "border border-red-400 focus:border-red-400 focus:ring-red-400"
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
          <div className="relative">
            <Calendar size={18} className="absolute left-3 top-3 text-[#38bdf8] opacity-80" />
            <input
              type="date"
              {...register("date")}
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] outline-none focus:ring-2 focus:ring-[#38bdf8] border border-transparent focus:border-[#38bdf8] transition-all text-lg",
                errors.date && "border border-red-400 focus:border-red-400 focus:ring-red-400"
              )}
            />
            {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
          </div>

          {/* Time */}
          <div className="relative">
            <Clock size={18} className="absolute left-3 top-3 text-[#6366f1] opacity-80" />
            <input
              type="time"
              {...register("time")}
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] outline-none focus:ring-2 focus:ring-[#6366f1] border border-transparent focus:border-[#6366f1] transition-all text-lg",
                errors.time && "border border-red-400 focus:border-red-400 focus:ring-red-400"
              )}
            />
            {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>}
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 0 24px #38bdf8, 0 0 8px #fff2" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 mt-4 text-lg font-bold bg-[#38bdf8] text-white rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Submit Expense
          </motion.button>
        </form>

        {/* Category Manager */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={20} className="text-[#38bdf8]" />
            <h3 className="text-[#e0e7ef] text-lg font-bold">Manage Categories</h3>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
              className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-[#e0e7ef] placeholder-[#94a3b8] outline-none focus:ring-2 focus:ring-[#38bdf8] border border-transparent focus:border-[#38bdf8] transition-all"
            />
            <button
              className="bg-[#6366f1] px-4 py-2 rounded-full font-bold hover:bg-[#4338ca] text-white transition"
              onClick={async () => {
                if (newCategory.trim()) {
                  await onAddCategory(newCategory.trim());
                  setNewCategory("");
                }
              }}
            >
              <PlusCircle size={18} className="inline-block mr-1" /> Add
            </button>
          </div>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center bg-white/10 px-4 py-2 rounded-xl text-[#e0e7ef]"
              >
                <span>{cat.name}</span>
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpenseForm;
