"use client";

import { TrendingUp } from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  Legend,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

interface YearlyStat {
  month: string;
  completedQuizzes: number;
  completedResources: number;
  completedFlashcardSets: number;
}

interface YearlyStatsChartProps {
  data: YearlyStat[];
  title?: string;
  description?: string;
}
// const chartConfig: ChartConfig = {
//   completedQuizzes: {
//     label: "Quizzes",
//     color: "#f97316", // Xanh dương nổi bật
//   },
//   completedResources: {
//     label: "Resources",
//     color: "#facc15", // Vàng sáng
//   },
//   completedFlashcardSets: {
//     label: "Flashcardset",
//     color: "#ef4444", // Đỏ rực
//   },
// };
const chartConfig: ChartConfig = {
  completedQuizzes: {
    label: "Quizzes",
    color: "hsl(var(--chart-1))", // Xanh dương nổi bật
  },
  completedResources: {
    label: "Resources",
    color: "hsl(var(--chart-2))", // Vàng sáng
  },
  completedFlashcardSets: {
    label: "Flashcardset",
    color: "hsl(var(--chart-3))", // Đỏ rực
  },
};

export function YearlyStatsChart({
  data,
  title = "Thống kê học tập theo năm",
  description = "Hiển thị số lượng quiz, tài liệu và flashcard hoàn thành",
}: YearlyStatsChartProps) {
  return (
    <Card className="border-emerald-100 dark:border-emerald-900/30">
      <CardHeader>
        <CardTitle className="text-emerald-950 dark:text-emerald-50">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              tickFormatter={(value) => value.slice(0, 7)}
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
            <Bar
              dataKey="completedQuizzes"
              fill={chartConfig.completedQuizzes.color}
              radius={4}
            />
            <Bar
              dataKey="completedResources"
              fill={chartConfig.completedResources.color}
              radius={4}
            />
            <Bar
              dataKey="completedFlashcardSets"
              fill={chartConfig.completedFlashcardSets.color}
              radius={4}
            />
            <Legend
              formatter={(value) => chartConfig[value]?.label || value}
              height={36}
              iconType="square"
              verticalAlign="bottom"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t border-emerald-100 dark:border-emerald-900/30 pt-4">
        <div className="flex gap-2 font-medium leading-none text-emerald-800 dark:text-emerald-300">
          Dữ liệu học tập theo năm <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Hiển thị thống kê quiz, tài liệu và flashcard trong 12 tháng gần nhất
        </div>
      </CardFooter>
    </Card>
  );
}
