import type { Option, Vote } from "@prisma/client";
import React, { useMemo } from "react";
import type { PieLabel } from "recharts";
import { Legend } from "recharts";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#0000cd",
  "#ba55d3",
  "#00ff7f",
  "#00ffff",
  "#00bfff",
  "#adff2f",
  "#ff00ff",
  "#f0e68c",
  "#dda0dd",
  "#d3d3d3",
  "#800000",
  "#808000",
  "#483d8b",
  "#3cb371",
  "#008b8b",
  "#ff0000",
  "#ff8c00",
  "#ffd700",
  "#ff1493",
  "#ffa07a",
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
        <text
          x={x - 5}
          y={y - 5}
          fill="white"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          className="text-sm md:text-md"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    ) : null;
  };

  const renderCustomTooltip = (props: any) => {
    return (
      <div className="p-2 rounded shadow bg-secondary3">
        <h5 className="font-bold">{props?.payload[0]?.name}</h5>
        <p className="text-sm text-secondary">
          {props?.payload[0]?.value} votes
        </p>
      </div>
    );
  };

  return (
    <div
      className={`w-4/5 lg:w-full mx-auto ${
        options.length > 5 ? "h-[700px] lg:h-[800px]" : "h-[400px] lg:h-[600px]"
      }`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            innerRadius={closed ? 0 : "40%"}
            isAnimationActive={false}
            data={graphOptions}
            dataKey="votes"
            nameKey="name"
            label={renderCustomizedLabel}
            labelLine={false}
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
          <Legend fontSize="0.5rem" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurrentStatus;
