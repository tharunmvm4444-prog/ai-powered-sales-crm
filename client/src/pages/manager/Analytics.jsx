import Sidebar from "../../components/common/Sidebar";
import Header from "../../components/common/Header";
import "./Analytics.css";

function Analytics() {
  const callsPerDay = [
    { day: "Monday", value: 38 },
    { day: "Tuesday", value: 34 },
    { day: "Wednesday", value: 39 },
    { day: "Thursday", value: 28 },
    { day: "Friday", value: 32 },
    { day: "Saturday", value: 23 },
    { day: "Sunday", value: 15 },
  ];

  const callsPerHour = [
    { hour: "00:00", value: 6 },
    { hour: "03:00", value: 4 },
    { hour: "06:00", value: 2 },
    { hour: "09:00", value: 1 },
    { hour: "12:00", value: 2 },
    { hour: "15:00", value: 3 },
    { hour: "18:00", value: 6 },
    { hour: "21:00", value: 7 },
  ];

  const callDuration = [
    { city: "Chennai", value: 2.4, color: "blue" },
    { city: "TamilNadu", value: 1.7, color: "teal" },
    { city: "Andhra", value: 2.2, color: "red" },
    { city: "USA", value: 1.3, color: "yellow" },
    { city: "UK", value: 1.8, color: "purple" },
    { city: "Vellore", value: 2.1, color: "navy" },
  ];

  const weeklyData = [
    { week: "2020-26", values: [35, 156, 74, 70, 86, 49], total: 470 },
    { week: "2020-27", values: [93, 92, 87, 1, 52, 0], total: 325 },
    { week: "2020-28", values: [33, 109, 45, 80, 77, 39], total: 383 },
    { week: "2020-29", values: [64, 93, 56, 70, 83, 94], total: 460 },
    { week: "2020-30", values: [0, 57, 0, 28, 0, 0], total: 217 },
  ];

  return (
    <div className="container">
      <Sidebar />

      <div className="main">
        <Header />

        {/* ===== ROW 1 ===== */}
        <div className="analytics-row">
          {/* Average Calls Per Day */}
          <div className="analytics-card large">
            <div className="card-header">
              <h3>Average Calls Per Day</h3>
            </div>
{/* Y Axis + Chart */}
    <div className="v-chart-container">

      {/* Y Axis */}
      <div className="v-y-axis">
        <span>60</span>
        <span>40</span>
        <span>20</span>
        <span>0</span>
        <span className="v-y-label">Average Calls</span>
      </div>

      {/* Bars */}
      <div className="vertical-chart">
        {callsPerDay.map((item) => {
          const scale = 4;

          const answered = Math.round(item.value * 0.55);
          const notAnswered = Math.round(item.value * 0.25);
          const canceled = Math.round(item.value * 0.12);
          const busy = item.value - (answered + notAnswered + canceled);

          return (
            <div key={item.day} className="v-bar-wrapper">
              <div className="v-bar-group">
                <div
                  className="v-bar green"
                  style={{ height: answered * scale }}
                />
                <div
                  className="v-bar red"
                  style={{ height: notAnswered * scale }}
                />
                <div
                  className="v-bar black"
                  style={{ height: canceled * scale }}
                />
                <div
                  className="v-bar yellow"
                  style={{ height: busy * scale }}
                />
              </div>

              <span className="x-label">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>

    {/* X Axis Label */}
    <div className="v-x-label">Day of the Week</div>

    {/* Legend */}
    <div className="legend">
      <div><span className="dot green" /> Answered</div>
      <div><span className="dot red" /> Not Answered</div>
      <div><span className="dot black" /> Canceled</div>
      <div><span className="dot yellow" /> Busy</div>
    </div>
          </div>

          {/* World Map */}
            <div className="analytics-card large with-y-axis">

          <div className="card-header">
    <h3>Calls by Country</h3>
  </div>

  <div className="world-map-wrapper">
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
      alt="World Map"
      className="world-map"
    />

    {/* Heat overlays */}
    <span className="heat usa" title="USA: 1,735 calls"></span>
    <span className="heat europe" title="Europe: 1,120 calls"></span>
    <span className="heat india" title="India: 980 calls"></span>
    <span className="heat australia" title="Australia: 620 calls"></span>
  </div>

  {/* Legend */}
  <div className="map-legend">
    <span>Low</span>
    <div className="legend-bar"></div>
    <span>High</span>
  </div>
          </div>
        </div>

        {/* ===== ROW 2 ===== */}
        <div className="analytics-row bottom">
          {/* Calls Per Hour */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Average Calls Per Hour</h3>
            </div>

            <div className="horizontal-chart">
              {callsPerHour.map((item) => (
                <div key={item.hour} className="h-row">
                  <span className="y-label">{item.hour}</span>
                  <div className="h-track">
                    <div
                      className="h-fill green"
                      style={{ width: `${item.value * 12}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="legend">
              <div><span className="dot green" /> Answered</div>
              <div><span className="dot red" /> Not Answered</div>
              <div><span className="dot black" /> Canceled</div>
              <div><span className="dot yellow" /> Busy</div>
            </div>
          </div>

         <div className="analytics-card">
  <div className="card-header">
    <h3>Average Call Duration</h3>
  </div>

  <div className="duration-chart">
    {/* Y Axis label */}
    <div className="y-axis-title">Place</div>

    {/* Chart area */}
    <div className="duration-chart-body">
      {/* Vertical axis line */}
      <div className="y-axis-line" />

      <div className="horizontal-chart thick">
        {callDuration.map((item) => (
          <div key={item.city} className="h-row thick">
            <span className="y-label">{item.city}</span>

            <div className="h-track thick">
              <div
                className={`h-fill thick ${item.color}`}
                style={{ width: `${item.value * 45}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* X Axis */}
    <div className="x-axis">
      <span>0</span>
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>

    <div className="x-axis-title">Minutes</div>
  </div>
</div>

         

          {/* Calls by Brand */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Calls by Person (Mon–Sun)</h3>
              <br></br>
            </div>

            <div className="stacked-chart">
              {weeklyData.map((week) => (
                <div key={week.week} className="stack-col">
                  {week.values.map((_, i) => (
                    <div key={i} className={`stack s${i}`} />
                  ))}
                  <span className="stack-total">{week.total}</span>
                  <span className="x-label">{week.week}</span>
                </div>
              ))}
            </div>

            <div className="legend brands">
              <div><span className="dot blue" /> Chennai</div>
              <div><span className="dot teal" /> TamilNadu</div>
              <div><span className="dot red" /> Andhra</div>
              <div><span className="dot yellow" /> USA</div>
              <div><span className="dot purple" /> UK </div>
              <div><span className="dot navy" />  Vellore</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;