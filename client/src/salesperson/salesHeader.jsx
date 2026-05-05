import "./salesHeader.css";

function SalesHeader({
  title = "Sales Person Dashboard",
  subtitle = "Welcome Back, Sales Person"
}) {
  return (
    <div className="dashboard-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  );
}

export default SalesHeader;
