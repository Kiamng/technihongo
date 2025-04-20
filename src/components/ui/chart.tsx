// "use client";

// import {
//   LineChart as RechartsLineChart,
//   BarChart as RechartsBarChart,
//   PieChart as RechartsPieChart,
//   Line,
//   Bar,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { ReactElement } from "react";

// import { cn } from "@/lib/utils";

// // Định nghĩa ChartConfig
// export interface ChartConfig {
//   [key: string]: {
//     label: string;
//     color?: string;
//   };
// }

// interface ChartContainerProps {
//   config: ChartConfig;
//   children: ReactElement;
//   className?: string;
// }

// export function ChartContainer({
//   config,
//   children,
//   className,
// }: ChartContainerProps) {
//   return (
//     <div className={cn("w-full", className)}>
//       <ResponsiveContainer height={400} width="100%">
//         {children}
//       </ResponsiveContainer>
//     </div>
//   );
// }

// interface ChartTooltipContentProps {
//   active?: boolean;
//   payload?: any[];
//   label?: string;
//   indicator?: "line" | "dashed" | "dot";
//   className?: string;
// }

// export function ChartTooltipContent({
//   active,
//   payload,
//   label,
//   indicator = "dot",
//   className,
// }: ChartTooltipContentProps) {
//   if (!active || !payload || !payload.length) return null;

//   return (
//     <div
//       className={cn("rounded-lg border bg-background p-2 shadow-sm", className)}
//     >
//       <div className="text-sm font-medium">{label}</div>
//       <div className="mt-1 space-y-1">
//         {payload.map((entry, index) => (
//           <div key={index} className="flex items-center space-x-2">
//             <span
//               className={cn(
//                 "h-3 w-3 rounded-full",
//                 indicator === "dashed" && "border-2 border-dashed",
//                 indicator === "dot" && "border",
//                 { "bg-[var(--color)]": entry.color },
//               )}
//               style={{ borderColor: entry.color, backgroundColor: entry.color }}
//             />
//             <span className="text-sm">
//               {entry.name}: {entry.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export {
//   RechartsLineChart as LineChart,
//   RechartsBarChart as BarChart,
//   RechartsPieChart as PieChart,
//   Line,
//   Bar,
//   Pie,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// };

"use client";

import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ReactElement } from "react";

import { cn } from "@/lib/utils";

// Định nghĩa ChartConfig
export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}

interface ChartContainerProps {
  config: ChartConfig;
  children: ReactElement;
  className?: string;
}

export function ChartContainer({
  config,
  children,
  className,
}: ChartContainerProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer height={400} width="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  indicator?: "line" | "dashed" | "dot";
  className?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  className,
}: ChartTooltipContentProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className={cn("rounded-lg border bg-background p-2 shadow-sm", className)}
    >
      <div className="text-sm font-medium">{label}</div>
      <div className="mt-1 space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span
              className={cn(
                "h-3 w-3 rounded-full",
                indicator === "dashed" && "border-2 border-dashed",
                indicator === "dot" && "border",
                { "bg-[var(--color)]": entry.color },
              )}
              style={{ borderColor: entry.color, backgroundColor: entry.color }}
            />
            <span className="text-sm">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Export ChartTooltip as a wrapper for recharts Tooltip
export function ChartTooltip({
  content = <ChartTooltipContent />,
  ...props
}: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip content={content} {...props} />;
}

export {
  RechartsLineChart as LineChart,
  RechartsBarChart as BarChart,
  RechartsPieChart as PieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
};
