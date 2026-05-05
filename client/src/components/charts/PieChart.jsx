import { useState } from "react";

export const BarChart = () => {
  const [tooltip, setTooltip] = useState(null);

  const data = [
    { name: "Rajesh", value: 120, color: "#4F46E5" },
    { name: "Sasi", value: 95, color: "#22C55E" },
    { name: "Tamizh", value: 80, color: "#F59E0B" },
    { name: "Kamali", value: 60, color: "#EF4444" },
    { name: "Vimala", value: 55, color: "#8B5CF6" },
    { name: "Rathna", value: 50, color: "#06B6D4" },
    { name: "Ezhil", value: 45, color: "#F97316" }
  ];

  const size = 260;        // 🔥 BIGGER PIE
  const radius = 120;
  const cx = size / 2;
  const cy = size / 2;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  let cumulative = 0;

  const getPath = (value) => {
    const angle = (value / total) * 360;
    const start = cumulative;
    cumulative += angle;

    const x1 = cx + radius * Math.cos((Math.PI / 180) * start);
    const y1 = cy + radius * Math.sin((Math.PI / 180) * start);
    const x2 = cx + radius * Math.cos((Math.PI / 180) * cumulative);
    const y2 = cy + radius * Math.sin((Math.PI / 180) * cumulative);

    const largeArc = angle > 180 ? 1 : 0;

    return `
      M ${cx} ${cy}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0
      }}
    >
      {/* PIE */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: "block" }}
      >
        {data.map((slice, index) => (
          <path
            key={index}
            d={getPath(slice.value)}
            fill={slice.color}
            onMouseEnter={(e) =>
              setTooltip({
                name: slice.name,
                value: slice.value,
                x: e.clientX,
                y: e.clientY
              })
            }
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>

      {/* LEGEND */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginTop: "8px",
          fontSize: "13px"
        }}
      >
        {data.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: item.color
              }}
            />
            {item.name}
          </div>
        ))}
      </div>

      {/* TOOLTIP */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: tooltip.y - 40,
            left: tooltip.x + 12,
            background: "white",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "12px",
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            zIndex: 1000
          }}
        >
          <strong>{tooltip.name}</strong>
          <div>Calls: {tooltip.value}</div>
        </div>
      )}
    </div>
  );
};