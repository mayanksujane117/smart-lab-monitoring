import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import StatCard from "../components/StatCard";

function AdminDashboard() {
  const navigate = useNavigate();

  const [pcs, setPcs] = useState([]);
  const username = localStorage.getItem("username");

  const [showLabModal, setShowLabModal] = useState(false);
  const [labName, setLabName] = useState("");

  const fetchPCs = async () => {
    try {
      const response = await axios.get(
        "https://smart-lab-monitoring.onrender.com/api/pcs"
      );
      setPcs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchPCs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLab = async () => {
    try {
      await axios.post(
        "https://smart-lab-monitoring.onrender.com/api/labs",
        { name: labName }
      );

      alert("Lab Added");
      window.location.reload();
    } catch (error) {

  console.log(error);

  console.log(error.response?.data);

  alert(
    JSON.stringify(
      error.response?.data
    )
  );

}
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const labs = [...new Set(pcs.map((pc) => pc.lab))];

  const totalPCs = pcs.length;
  const onlinePCs = pcs.filter((pc) => pc.status === "Online").length;
  const offlinePCs = pcs.filter((pc) => pc.status === "Offline").length;
  const sleepingPCs = pcs.filter((pc) => pc.status === "Sleeping").length;

  const getLabStats = (lab) => {
    const labPCs = pcs.filter((pc) => pc.lab === lab);

    return {
      total: labPCs.length,
      online: labPCs.filter((pc) => pc.status === "Online").length,
      offline: labPCs.filter((pc) => pc.status === "Offline").length,
    };
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <Header />

        {/* MODAL */}
        {showLabModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#0B1220] p-8 rounded-3xl w-[400px]">
              <h2 className="text-3xl font-bold mb-6">Add Lab</h2>

              <input
                type="text"
                placeholder="Lab Name"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900 mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={addLab}
                  className="flex-1 bg-cyan-600 py-3 rounded-xl"
                >
                  Save
                </button>

                <button
                  onClick={() => setShowLabModal(false)}
                  className="flex-1 bg-slate-700 py-3 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate("/users")}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-2xl font-semibold"
          >
            User Management
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-semibold"
          >
            Logout
          </button>

          <button
            onClick={() => setShowLabModal(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-2xl font-semibold"
          >
            + Add Lab
          </button>
        </div>

        {/* HERO */}
        <div className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-10 mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Welcome Back, {" "}
            {username}
          </h1>
          <p className="text-xl text-cyan-100">
            Monitor and manage all computer labs in real-time.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total PCs" value={totalPCs} icon="💻" />
          <StatCard title="Online" value={onlinePCs} icon="🟢" />
          <StatCard title="Offline" value={offlinePCs} icon="🔴" />
          <StatCard title="Sleeping" value={sleepingPCs} icon="🌙" />
        </div>

        {/* LABS */}
        <h2 className="text-4xl font-bold mb-8">Labs Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {labs.map((lab) => {
            const stats = getLabStats(lab);
            return (
              <div
                key={lab}
                onClick={() => navigate(`/lab/${lab}`)}
                className="cursor-pointer rounded-3xl border border-slate-800 bg-[#0B1220] p-8 hover:border-cyan-500 hover:scale-105 transition-all duration-300"
              >
                <h2 className="text-3xl font-bold mb-8">{lab}</h2>

                <div className="space-y-3">
                  <div className="bg-green-500/10 text-green-400 p-4 rounded-xl">
                    Online: {stats.online}
                  </div>

                  <div className="bg-red-500/10 text-red-400 p-4 rounded-xl">
                    Offline: {stats.offline}
                  </div>

                  <div className="bg-slate-800 p-4 rounded-xl">
                    Total PCs: {stats.total}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

