import type { Option, Vote } from "@prisma/client";
import React, { useMemo } from "react";
import type { PieLabel } from "recharts";
import { Tooltip } from "recharts";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const COLORS = [
  "#f43f5e",
  "#d946ef",
  "#3b82f6",
  "#06b6d4",
  "#14b8a6",
  "#84cc16",
  "#f97316",
  "#ef4444",
  "#78716c",
];

type CurrentStatusProps = {
  options: (Option & {
    vote: Vote[];
  })[];
};

const RADIAN = Math.PI / 180;

const CurrentStatus: React.FC<CurrentStatusProps> = ({ options }) => {
  const graphOptions = useMemo(() => {
    return options.map((op) => ({ name: op.text, votes: op.vote.length }));
  }, [options]);

  const renderCustomizedLabel: PieLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <ResponsiveContainer width="100%" height={600}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={graphOptions}
          dataKey="votes"
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {graphOptions.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CurrentStatus;
