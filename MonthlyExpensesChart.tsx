"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/lib/types";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const months: { [key: string]: number } = {};
    
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = (months[monthKey] || 0) + transaction.amount;
    });

    return Object.entries(months)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, total]) => ({
        month: month.split('-')[1] + '/' + month.split('-')[0].slice(2),
        total,
      }));
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  );
}