import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

function SuperAdmin() {

  const navigate =
    useNavigate();

    const [stats, setStats] =
  useState({

    totalOrganizations: 0,

    totalAdmins: 0,

    totalLabs: 0,

    totalPCs: 0,

  });

const [
  organizations,
  setOrganizations
] = useState([]);

  const logout = () => {

    localStorage.clear();

    navigate("/login");

  };

  const fetchStats =
async () => {

  try {

    const response =
      await axios.get(

        "https://smart-lab-monitoring.onrender.com/api/super-admin/stats"

      );

    setStats(
      response.data
    );

  }

  catch (error) {

    console.log(error);

  }

};

const fetchOrganizations =
async () => {

  try {

    const response =
      await axios.get(

        "https://smart-lab-monitoring.onrender.com/api/super-admin/organizations"

      );

    setOrganizations(
      response.data
    );

  }

  catch (error) {

    console.log(error);

  }

};

useEffect(() => {

  fetchStats();

  fetchOrganizations();

}, []);

  return (

    <div className="min-h-screen bg-[#050816] text-white">

      {/* TOP BAR */}

      <div className="border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">

              Super Admin

            </h1>

            <p className="text-slate-400 mt-1">

              Smart Lab Monitoring SaaS

            </p>

          </div>

          <button

            onClick={logout}

            className="
            bg-red-600
            hover:bg-red-700
            px-5
            py-3
            rounded-xl
            font-semibold
            "

          >

            Logout

          </button>

        </div>

      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto p-8">

        {/* HERO */}

        <div className="
        rounded-3xl
        bg-gradient-to-r
        from-cyan-600
        to-blue-700
        p-10
        mb-10
        ">

          <h2 className="
          text-5xl
          font-bold
          mb-3
          ">

            Multi College SaaS Control Panel

          </h2>

          <p className="
          text-cyan-100
          text-xl
          ">

            Manage Organizations, Admins,
            Labs and PCs from one place.

          </p>

        </div>

        {/* STATS */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        mb-10
        ">

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              Organizations

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

            {stats.totalOrganizations}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              Users

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

              {stats.totalAdmins}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              Labs

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

              {stats.totalLabs}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              PCs

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

              {stats.totalPCs}

            </h2>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="
        flex
        flex-wrap
        gap-4
        mb-10
        ">

          <button

            className="
            bg-cyan-600
            hover:bg-cyan-700
            px-6
            py-3
            rounded-2xl
            font-semibold
            "

          >

            + Create Organization

          </button>

          <button

            className="
            bg-slate-800
            hover:bg-slate-700
            px-6
            py-3
            rounded-2xl
            font-semibold
            "

          >

            + Create Admin

          </button>

        </div>

        {/* ORGANIZATION TABLE */}

        <div className="
        bg-[#0B1220]
        border
        border-slate-800
        rounded-3xl
        overflow-hidden
        ">

          <div className="
          px-6
          py-5
          border-b
          border-slate-800
          ">

            <h2 className="
            text-2xl
            font-bold
            ">

              Organizations

            </h2>

          </div>

          <div className="p-6">

            <p className="text-slate-400">

              No organizations found

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default SuperAdmin;