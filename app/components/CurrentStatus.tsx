import type { Option, Vote } from "@prisma/client";
import React, { useMemo } from "react";
import type { PieLabel } from "recharts";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

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
  closed?: boolean;
};

const RADIAN = Math.PI / 180;

const CurrentStatus: React.FC<CurrentStatusProps> = ({
  options,
  closed = false,
}) => {
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
    ...rest
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0 ? (
      <>
        {!closed && (
          <text
            x={x + (radius * Math.cos(-midAngle * RADIAN)) / 2}
            y={y + (radius * Math.sin(-midAngle * RADIAN)) / 2}
            fill="#0E2446"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
          >
            {rest.name}
          </text>
        )}
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    ) : null;
  };

  const renderCustomTooltip = (props: any) => {
    return <div className="bg-secondary3 p-2 shadow rounded">
      <h5 className="font-bold">{props?.payload[0]?.name}</h5>
      <p className="text-sm text-secondary">{props?.payload[0]?.value} votes</p>
    </div>
  }

  return (
    <ResponsiveContainer width="100%" height={600}>
      <PieChart>
        <Pie
          innerRadius={closed ? 0 : 120}
          isAnimationActive={false}
          data={graphOptions}
          dataKey="votes"
          nameKey="name"
          label={(params) => renderCustomizedLabel({ ...params, closed })}
          labelLine={!closed}
        >
          {graphOptions.map((entry, index) => (
            <Cell
              className="testy-test"
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
        {closed && <Tooltip content={renderCustomTooltip} />}
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CurrentStatus;
