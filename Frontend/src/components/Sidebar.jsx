import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">
        Smart Lab
      </h1>

      <div className="flex flex-col gap-4">

        <Link to="/">
          Dashboard
        </Link>

        <Link to="/pc-management">
          PC Management
        </Link>

        <Link to="/notifications">
          Notifications
        </Link>

        {role === "Admin" && (
          <Link to="/users">
            User Management
          </Link>
        )}

      </div>
    </div>
  );
}

export default Sidebar;