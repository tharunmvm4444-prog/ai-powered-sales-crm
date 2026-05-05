import "./Header.css";

function Header({ title = "Manager Dashboard", subtitle = "Welcome Back, Manager" }) {
  return (
    <div className="header">
      <div className="header-left">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

    </div>
  );
}

export default Header;
