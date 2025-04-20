// "use client";

// import { TrendingUp } from "lucide-react";

// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   Tooltip,
//   Legend,
// } from "@/components/ui/chart";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartContainer,
//   ChartTooltipContent,
//   ChartConfig,
// } from "@/components/ui/chart";

// interface WeeklyStat {
//   date: string;
//   studyTime: number;
//   dailyGoalAchieved: boolean;
// }

// interface WeeklyStatsChartProps {
//   data: WeeklyStat[];
//   title?: string;
//   description?: string;
// }

// const chartConfig: ChartConfig = {
//   studyTime: {
//     label: "Thời gian học (phút)",
//     color: "hsl(var(--chart-1))",
//   },
// };

// export function WeeklyStatsChart({
//   data,
//   title = "Thống kê học tập theo tuần",
//   description = "Hiển thị thời gian học trong 7 ngày gần nhất",
// }: WeeklyStatsChartProps) {
//   return (
//     <Card className="border-emerald-100 dark:border-emerald-900/30">
//       <CardHeader>
//         <CardTitle className="text-emerald-950 dark:text-emerald-50">
//           {title}
//         </CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={data}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               axisLine={false}
//               dataKey="date"
//               tickFormatter={(value) =>
//                 new Date(value).toLocaleDateString("vi-VN", {
//                   day: "2-digit",
//                   month: "2-digit",
//                 })
//               }
//               tickLine={false}
//               tickMargin={10}
//             />
//             <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
//             <Bar
//               dataKey="studyTime"
//               fill={chartConfig.studyTime.color}
//               radius={4}
//             />
//             <Legend
//               formatter={(value) => chartConfig[value]?.label || value}
//               height={36}
//               iconType="square"
//               verticalAlign="bottom"
//             />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm border-t border-emerald-100 dark:border-emerald-900/30 pt-4">
//         <div className="flex gap-2 font-medium leading-none text-emerald-800 dark:text-emerald-300">
//           Dữ liệu học tập theo tuần <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">
//           Hiển thị thời gian học trong 7 ngày gần nhất
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

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

interface WeeklyStat {
  date: string;
  studyTime: number;
  dailyGoalAchieved: boolean;
}

interface WeeklyStatsChartProps {
  data: WeeklyStat[];
  title?: string;
  description?: string;
}

const chartConfig: ChartConfig = {
  studyTime: {
    label: "Thời gian học (phút)",
    color: "hsl(var(--chart-1))", // Default color for dailyGoalAchieved: false
  },
  achieved: {
    label: "Mục tiêu đạt được",
    color: "hsl(142, 71%, 45%)", // Green for dailyGoalAchieved: true
  },
};

export function WeeklyStatsChart({
  data,
  title = "Thống kê học tập theo tuần",
  description = "Hiển thị thời gian học trong 7 ngày gần nhất",
}: WeeklyStatsChartProps) {
  // Map data to include fill color based on dailyGoalAchieved
  const chartData = data.map((item) => ({
    ...item,
    fill: item.dailyGoalAchieved
      ? chartConfig.achieved.color
      : chartConfig.studyTime.color,
  }));

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
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })
              }
              tickLine={false}
              tickMargin={10}
            />
            <Tooltip content={<ChartTooltipContent indicator="dashed" />} />
            <Bar
              dataKey="studyTime"
              fill="var(--color-fill)" // Use dynamic fill from chartData
              radius={4}
            />
            <Legend
              formatter={(value) =>
                value === "studyTime" ? chartConfig.studyTime.label : value
              }
              height={36}
              iconType="square"
              verticalAlign="bottom"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm border-t border-emerald-100 dark:border-emerald-900/30 pt-4">
        <div className="flex gap-2 font-medium leading-none text-emerald-800 dark:text-emerald-300">
          Dữ liệu học tập theo tuần <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Hiển thị thời gian học trong 7 ngày gần nhất
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          <span className="inline-block w-3 h-3 mr-1 rounded-sm bg-[hsl(142,71%,45%)]" />
          Đã đạt mục tiêu hàng ngày
          <span className="inline-block w-3 h-3 mr-1 ml-4 rounded-sm bg-[hsl(var(--chart-1))]" />
          Chưa đạt mục tiêu hàng ngày
        </div>
      </CardFooter>
    </Card>
  );
}
