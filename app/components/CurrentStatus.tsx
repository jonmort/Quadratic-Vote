import type { Option, Vote } from "@prisma/client";
import React, { useMemo } from "react";
import type { PieLabel } from "recharts";
import { Legend } from "recharts";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
    "#E52B50",
    "#FFBF00",
    "#9966CC",
    "#FBCEB1",
    "#7FFFD4",
    "#007FFF",
    "#89CFF0",
    "#F5F5DC",
    "#CB4154",
    "#000000",
    "#0000FF",
    "#0095B6",
    "#8A2BE2",
    "#DE5D83",
    "#CD7F32",
    "#993300",
    "#800020",
    "#702963",
    "#960018",
    "#DE3163",
    "#007BA7",
    "#F7E7CE",
    "#7FFF00",
    "#7B3F00",
    "#0047AB",
    "#6F4E37",
    "#B87333",
    "#FF7F50",
    "#DC143C",
    "#00FFFF",
    "#EDC9AF",
    "#7DF9FF",
    "#50C878",
    "#00FF3F",
    "#FFD700",
    "#BEBEBE",
    "#008001",
    "#3FFF00",
    "#4B0082",
    "#FFFFF0",
    "#00A86B",
    "#29AB87",
    "#B57EDC",
    "#FFF700",
    "#C8A2C8",
    "#BFFF00",
    "#FF00FF",
    "#FF00AF",
    "#800000",
    "#E0B0FF",
    "#000080",
    "#CC7722",
    "#808000",
    "#FF6600",
    "#FF4500",
    "#DA70D6",
    "#FFE5B4",
    "#D1E231",
    "#CCCCFF",
    "#1C39BB",
    "#FFC0CB",
    "#8E4585",
    "#003153",
    "#CC8899",
    "#6A0DAD",
    "#E30B5C",
    "#FF0000",
    "#C71585",
    "#FF007F",
    "#E0115F",
    "#FA8072",
    "#92000A",
    "#0F52BA",
    "#FF2400",
    "#C0C0C0",
    "#708090",
    "#A7FC00",
    "#00FF7F",
    "#D2B48C",
    "#483C32",
    "#008080",
    "#40E0D0",
    "#3F00FF",
    "#7F00FF",
    "#40826D",
    "#FFFFFF",
    "#FFFF00",
    // "#b4433a",
    // "#60b14d",
    // "#9751c3",
    // "#b6b241",
    // "#6169d8",
    // "#d9943b",
    // "#d971db",
    // "#4bad89",
    // "#dd4f93",
    // "#757f38",
    // "#a83f93",
    // "#db582f",
    // "#46aed7",
    // "#de4762",
    // "#6b8ed8",
    // "#9d612e",
    // "#7161a4",
    // "#e18e76",
    // "#d28dc7",
    // "#a34b69",
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
      <div className="p-2 rounded shadow bg-grey2">
        <h5 className="font-bold">{props?.payload[0]?.name}</h5>
        <p className="text-sm text-white">
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
