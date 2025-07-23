"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
} from "recharts";

const COLORS = ["#4f46e5", "#16a34a", "#dc2626", "#f59e0b", "#3b82f6", "#8b5cf6"];

export default function CategoryPage() {
    const [categoryData, setCategoryData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [timeline, setTimeline] = useState("month"); // "month" | "year" | "all"
    const [lineData, setLineData] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [breakdown, setBreakdown] = useState("monthly");
    const [barData, setBarData] = useState([]);

    // Fetch all categories for dropdown
    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/expense/category");
            const result = await res.json();
            setCategories(result.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    // Fetch category breakdown for donut chart
    const fetchCategoryData = async () => {
        try {
            const res = await fetch("/api/category-breakdown", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startDate, endDate }),
            });
            const result = await res.json();
            setCategoryData(result.data);
        } catch (error) {
            console.error("Error fetching category breakdown:", error);
        }
    };

    // Fetch line chart data for selected category and timeline
    const fetchLineData = async () => {
        if (!selectedCategory) return;

        try {
            const res = await fetch("/api/charts/category-trends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ categoryId: selectedCategory, timeline }),
            });
            const result = await res.json();
            setLineData(result.data);
        } catch (error) {
            console.error("Error fetching line data:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchCategoryData();
    }, []);

    useEffect(() => {
        if (selectedCategory) fetchLineData();
    }, [selectedCategory, timeline]);

    return (
        <div className="p-6 space-y-8">
            {/* Donut Chart */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Category Wise Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={categoryData}
                            dataKey="total"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {categoryData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Category Trends Line Chart */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Category Trends
                </h2>
                <div className="flex items-center gap-4 mb-4">
                    {/* Category Selector */}
                    <Select
                        value={selectedCategory ?? ""}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-60">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Timeline Selector */}
                    <Select value={timeline} onValueChange={setTimeline}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Timeline" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="month">Past Month</SelectItem>
                            <SelectItem value="year">Past Year</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#4f46e5"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
