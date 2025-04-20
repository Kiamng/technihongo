// "use client";

// import { TrendingUp } from "lucide-react";
// import {
//   CartesianGrid,
//   Dot,
//   Line,
//   LineChart,
//   XAxis,
//   LabelList,
// } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// interface LineChartData {
//   [key: string]: any;
// }

// interface LineChartProps {
//   data: LineChartData[];
//   dataKey: string;
//   xAxisKey: string;
//   title?: string;
//   description?: string;
//   chartConfig: ChartConfig;
//   fillKey?: string;
//   strokeColor?: string;
//   xAxisFormatter?: (value: any) => string;
//   labelPosition?: "top" | "bottom" | "left" | "right" | "inside" | "outside";
//   labelOffset?: number;
//   labelFontSize?: number;
// }

// export function LineChartComponent({
//   data,
//   dataKey,
//   xAxisKey,
//   title = "Line Chart",
//   description = "Data visualization",
//   chartConfig,
//   fillKey,
//   strokeColor = "hsl(var(--chart-1))",
//   xAxisFormatter = (value: string) =>
//     new Date(value).toLocaleDateString("vi-VN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//     }),
//   labelPosition = "top",
//   labelOffset = 12,
//   labelFontSize = 12,
// }: LineChartProps) {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <LineChart
//             accessibilityLayer
//             data={data}
//             margin={{
//               top: 24,
//               left: 24,
//               right: 24,
//               bottom: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               axisLine={false}
//               dataKey={xAxisKey}
//               tickFormatter={xAxisFormatter}
//               tickLine={false}
//               tickMargin={8}
//             />
//             <ChartTooltip
//               content={<ChartTooltipContent indicator="line" />}
//               cursor={false}
//             />
//             <Line
//               activeDot={{ r: 6 }}
//               dataKey={dataKey}
//               dot={(props) => {
//                 const payload = props.payload as LineChartData;
//                 const fill = fillKey ? payload[fillKey] : strokeColor;

//                 return (
//                   <Dot
//                     key={payload[xAxisKey]}
//                     cx={props.cx}
//                     cy={props.cy}
//                     fill={fill}
//                     r={5}
//                     stroke={fill}
//                   />
//                 );
//               }}
//               stroke={strokeColor}
//               strokeWidth={2}
//               type="natural"
//             >
//               <LabelList
//                 className="fill-foreground"
//                 dataKey={dataKey}
//                 fontSize={labelFontSize}
//                 offset={labelOffset}
//                 position={labelPosition}
//               />
//             </Line>
//           </LineChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col items-start gap-2 text-sm">
//         <div className="flex gap-2 font-medium leading-none">
//           Dữ liệu thống kê <TrendingUp className="h-4 w-4" />
//         </div>
//         <div className="leading-none text-muted-foreground">{description}</div>
//       </CardFooter>
//     </Card>
//   );
// }

"use client";

import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  XAxis,
  LabelList,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface LineChartData {
  [key: string]: any;
}

interface LineChartProps {
  data: LineChartData[];
  dataKey: string;
  xAxisKey: string;
  title?: string;
  description?: string;
  chartConfig: ChartConfig;
  fillKey?: string;
  strokeColor?: string;
  xAxisFormatter?: (value: any) => string;
  labelPosition?: "top" | "bottom" | "left" | "right" | "inside" | "outside";
  labelOffset?: number;
  labelFontSize?: number;
}

export function LineChartComponent({
  data,
  dataKey,
  xAxisKey,
  title = "Line Chart",
  description = "Data visualization",
  chartConfig,
  fillKey,
  strokeColor = "hsl(var(--chart-1))",
  xAxisFormatter = (value: string) =>
    new Date(value).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  labelPosition = "top",
  labelOffset = 12,
  labelFontSize = 12,
}: LineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 24,
              left: 30,
              right: 30,
              bottom: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey={xAxisKey}
              domain={["dataMin", "dataMax"]}
              interval={0} // Force rendering of all ticks without skipping
              tick={{ fontSize: 12 }} // Adjust tick font size if needed
              tickFormatter={xAxisFormatter}
              tickLine={false}
              tickMargin={8}
              ticks={data.map((item) => item[xAxisKey])} // Explicitly include all dates
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
            />
            <Line
              activeDot={{ r: 6 }}
              connectNulls={true}
              dataKey={dataKey}
              dot={(props) => {
                const payload = props.payload as LineChartData;

                console.log("Rendering dot for:", payload);
                const fill = fillKey ? payload[fillKey] : strokeColor;

                return (
                  <Dot
                    key={payload[xAxisKey]}
                    cx={props.cx}
                    cy={props.cy}
                    fill={fill}
                    r={5}
                    stroke={fill}
                  />
                );
              }}
              stroke={strokeColor}
              strokeWidth={2}
              type="natural"
            >
              <LabelList
                className="fill-foreground"
                dataKey={dataKey}
                fontSize={labelFontSize}
                offset={labelOffset}
                position={labelPosition}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Dữ liệu thống kê <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  );
}
