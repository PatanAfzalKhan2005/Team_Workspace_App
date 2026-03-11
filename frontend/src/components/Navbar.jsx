export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location = "/";
  };

  return (
    <div className="navbar">
      <h3>Team Workspace</h3>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
