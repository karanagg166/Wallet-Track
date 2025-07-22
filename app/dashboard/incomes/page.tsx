"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { CreditCard, Calendar, Clock, Tag, Layers, DollarSign } from "lucide-react";

const schema = z.object({
  amount: z.number().min(1, "Amount must be at least 1"),
  date: z.string().nonempty("Date is required"),
  title: z.string().nonempty("Title is required"),
  time: z.string().nonempty("Time is required"),
  incomesource:z.string().nonempty("Please specify the income source"),
});
type IncomeFormInputs = z.infer<typeof schema>;


const IncomeForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IncomeFormInputs>({
    resolver: zodResolver(schema),
  });


  const router= useRouter();
 







  const onSubmit = async (data: IncomeFormInputs) => {
  
    


    try {
      const response = await fetch("/api/income/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Login failed");
      } else {
        alert("Income Successfully added");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
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
        whileHover={{ scale: 1.03, boxShadow: '0 0 0 2px #22c55e, 0 8px 40px #0008' }}
        className="backdrop-blur-xl bg-white/10 border border-[#232b45] rounded-3xl p-10 w-full max-w-2xl shadow-2xl relative"
        style={{ boxShadow: "0 8px 40px #0008" }}
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <DollarSign size={32} className="text-[#38bdf8] drop-shadow" />
          <h2 className="text-3xl font-extrabold text-[#e0e7ef] text-center tracking-wide">Add New Income</h2>
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
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
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
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
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
            {errors.date && (
              <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
            )}
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
            {errors.time && (
              <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>
            )}
          </div>
          {/* Income Source */}
          <div className="relative">
            <Layers size={18} className="absolute left-3 top-3 text-[#38bdf8] opacity-80" />
            <input
              {...register("incomesource")}
              placeholder="Income Source"
              className={clsx(
                "w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-[#e0e7ef] placeholder-[#94a3b8] outline-none focus:ring-2 focus:ring-[#38bdf8] border border-transparent focus:border-[#38bdf8] transition-all text-lg",
                errors.incomesource && "border border-red-400 focus:border-red-400 focus:ring-red-400"
              )}
            />
            {errors.incomesource && (
              <p className="text-red-400 text-sm mt-1">{errors.incomesource.message}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.08, boxShadow: "0 0 24px #38bdf8, 0 0 8px #fff2" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 mt-4 text-lg font-bold bg-[#38bdf8] text-white rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Submit Income
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default IncomeForm;
