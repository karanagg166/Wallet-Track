"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useRouter } from "next/navigation";

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
      const response = await fetch("/api/income", {
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
            {errors.title && (
              <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
            )}
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
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
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
            {errors.date && (
              <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
            )}
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
                      {errors.time && (
                        <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>
                      )}
                    </div>
           <div>
                      <input
                        {...register("incomesource")}
                        placeholder="Income Source"
                        className={clsx(
                          "w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-purple-400 transition-all",
                          errors.incomesource && "border border-red-400"
                        )}
                      />
                      {errors.incomesource && (
                        <p className="text-red-400 text-sm mt-1">{errors.incomesource.message}</p>
                      )}
                    </div>

         
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 mt-4 text-lg font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            Submit Expense
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default IncomeForm;
