import { useState } from "react";

export const LineChart = () => {
  const data = [
    { day: "Mon", value: 120 },
    { day: "Tue", value: 180 },
    { day: "Wed", value: 150 },
    { day: "Thu", value: 230 },
    { day: "Fri", value: 210 },
    { day: "Sat", value: 260 },
    { day: "Sun", value: 240 }
  ];

  const [tooltip, setTooltip] = useState(null);

  const width = 700;
  const height = 220;
  const paddingLeft = 50;
  const paddingBottom = 30;
  const paddingTop = 20;

  const maxValue = Math.max(...data.map(d => d.value));
  const xStep = (width - paddingLeft - 20) / (data.length - 1);
  const yScale = (height - paddingTop - paddingBottom) / maxValue;

  const points = data
    .map((d, i) => {
      const x = paddingLeft + i * xStep;
      const y = height - paddingBottom - d.value * yScale;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div style={{ width: "100%", padding: "8px", position: "relative" }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ overflow: "visible" }}
      >
        {/* Y Axis */}
        <line
          x1={paddingLeft}
          y1={paddingTop}
          x2={paddingLeft}
          y2={height - paddingBottom}
          stroke="#9ca3af"
        />

        {/* X Axis */}
        <line
          x1={paddingLeft}
          y1={height - paddingBottom}
          x2={width - 20}
          y2={height - paddingBottom}
          stroke="#9ca3af"
        />

        {/* Grid + Y labels */}
        {[0, maxValue / 2, maxValue].map((val, i) => {
          const y = height - paddingBottom - val * yScale;
          return (
            <g key={i}>
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#6b7280"
              >
                {Math.round(val)}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
            </g>
          );
        })}

        {/* Line */}
        <polyline
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          points={points}
        />

        {/* Points + Hover */}
        {data.map((d, i) => {
          const x = paddingLeft + i * xStep;
          const y = height - paddingBottom - d.value * yScale;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="6"                     // bigger hit area
              fill="#10b981"
              style={{ cursor: "pointer" }}
              onMouseMove={(e) =>
                setTooltip({
                  day: d.day,
                  value: d.value,
                  x: e.pageX,
                  y: e.pageY
                })
              }
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}

        {/* X labels */}
        {data.map((d, i) => {
          const x = paddingLeft + i * xStep;
          return (
            <text
              key={i}
              x={x}
              y={height - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {d.day}
            </text>
          );
        })}
      </svg>

      {/* TOOLTIP */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y - 45,
            left: tooltip.x + 12,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            padding: "6px 10px",
            fontSize: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
            pointerEvents: "none",
            zIndex: 1000
          }}
        >
          <strong>{tooltip.day}</strong>
          <div>Sales: {tooltip.value}</div>
        </div>
      )}
    </div>
  );
};