import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import StatCard from "../components/StatCard";

function AdminDashboard() {
  const navigate = useNavigate();

  const [pcs, setPcs] = useState([]);

  const [
  notifications,
  setNotifications
] = useState([]);

const [
  showNotifications,
  setShowNotifications
] = useState(false);

  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState({});
  const username = localStorage.getItem("username");
  
const organizationId =
  localStorage.getItem(
    "organizationId"
  );
  const [showLabModal, setShowLabModal] = useState(false);
  const [labName, setLabName] = useState("");

  const fetchPCs = async () => {
    try {
     const organizationId =
  localStorage.getItem(
    "organizationId"
  );

const response =
  await axios.get(

    `https://smart-lab-monitoring.onrender.com/api/pcs/${organizationId}`

  );
      setPcs(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const shutdownAllPCs =
async () => {

  const confirmAction =
    window.confirm(

      "Shutdown ALL PCs?"

    );

  if (
    !confirmAction
  )
    return;

  try {

    await axios.post(

      "https://smart-lab-monitoring.onrender.com/api/shutdown-all"

    );

    alert(
      "Command Sent"
    );

  }

  catch {

    alert(
      "Failed"
    );

  }

};

const fetchNotifications =
async () => {

  try {

    const res =
      await axios.get(

        "https://smart-lab-monitoring.onrender.com/api/notifications/Admin"

      );

    setNotifications(
      res.data
    );

  }

  catch (error) {

    console.log(error);

  }

};

const markAsRead =
async (id) => {

  

  try {

    await axios.put(

      `https://smart-lab-monitoring.onrender.com/api/notifications/read/${id}`

    );

    fetchNotifications();

  }

  catch (error) {

    console.log(error);

  }

};



const clearAllNotifications =
async () => {

  try {

    await axios.delete(

      "https://smart-lab-monitoring.onrender.com/api/notifications"

    );

    fetchNotifications();

  }

  catch (error) {

    console.log(error);

  }

};

  useEffect(() => {

 const role =
localStorage.getItem(
  "role"
);

if (
  role !== "Admin"
) {

  navigate(
    "/login"
  );

  return;

}

  fetchPCs();
  fetchLabs();

  const interval =
    setInterval(() => {

      fetchPCs();

    }, 3000);

  return () =>
    clearInterval(
      interval
    );

}, []);

useEffect(() => {

  fetchNotifications();

  const socket =
    io(
      "https://smart-lab-monitoring.onrender.com"
    );

  socket.on(
    "notification-update",
    () => {

      fetchNotifications();

    }
  );

  return () => {

    socket.disconnect();

  };

}, []);
  const fetchLabs = async () => {

  try {

    const response =
      await axios.get(
  `https://smart-lab-monitoring.onrender.com/api/labs/${organizationId}`
);

    setLabs(
      response.data
    );

  } catch (error) {

    console.log(error);

  }

};

  const addLab = async () => {
    try {
      await axios.post(
  "https://smart-lab-monitoring.onrender.com/api/labs",
  {

    name:
      labName,

    organizationId,

  }
);



      alert("Lab Added");

setLabName("");
setShowLabModal(false);

fetchLabs();
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

  const deleteLab =
  async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this lab?"
      );

    if (!confirmDelete)
      return;

    try {

      await axios.delete(
        `https://smart-lab-monitoring.onrender.com/api/labs/${id}`
      );

      fetchLabs();

      alert(
        "Lab Deleted"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Delete Failed"
      );

    }

  };

  const assignPCToLab = async (pcName) => {
  const lab = selectedLab[pcName];

  if (!lab) {
    alert("Please select a lab");
    return;
  }

  try {
    await axios.put(
      `https://smart-lab-monitoring.onrender.com/api/pcs/${encodeURIComponent(pcName)}/assign-lab`,
      {
        organizationId,
        lab,
      }
    );

    alert("PC assigned successfully");

    fetchPCs();

    setSelectedLab((prev) => ({
      ...prev,
      [pcName]: "",
    }));
  } catch (error) {
    console.log("ASSIGN PC ERROR:", error);

    alert(
      error.response?.data?.message ||
        "Failed to assign PC"
    );
  }
};

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  

  const totalPCs = pcs.length;
  const onlinePCs = pcs.filter((pc) => pc.status === "Online").length;
  const offlinePCs = pcs.filter((pc) => pc.status === "Offline").length;
  

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
            onClick={() => setShowLabModal(true)}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-2xl font-semibold"
          >
            Add Lab+
          </button>
          <button

  onClick={
    shutdownAllPCs
  }

  className="
  bg-red-600
  hover:bg-red-700
  px-6
  py-3
  rounded-2xl
  font-semibold
  
  "

>

  ⏻ Shutdown All PCs

</button>


          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-semibold flex gap-3 ml-auto"
          >
            Logout
          </button>
          <div className="relative">

  <button

    onClick={() =>
      setShowNotifications(
        !showNotifications
      )
    }

    className="
    text-2xl
    relative
    "

  >

    🔔

    {notifications.filter(
      n => !n.isRead
    ).length > 0 && (

      <span className="
      absolute
      -top-2
      -right-2
      bg-red-500
      text-white
      text-xs
      rounded-full
      px-2
      ">

        {
          notifications.filter(
            n => !n.isRead
          ).length
        }

      </span>

    )}

  </button>

  {showNotifications && (

    <div className="
    absolute
    right-0
    mt-2
    w-96
bg-lime-200
    border
    border-slate-300

text-black
    rounded-2xl
    shadow-xl
    z-50
    max-h-96
    overflow-y-auto
    ">

      <div className="
p-4
font-bold
border-b
flex
justify-between
items-center
">

  <span>
    Notifications
  </span>

  <button

    onClick={
      clearAllNotifications
    }

    className="
    text-red-500
    text-sm
    font-semibold
    "

  >

    Clear All

  </button>

</div>

      {

        notifications.length === 0

        ? (

          <div className="p-4">

            No Notifications

          </div>

        )

        : (

          notifications.map(
  (item) => (

    <div

      key={item._id}

      onClick={() =>
        markAsRead(
          item._id
        )
      }

      className={`

      p-4

      border-b

      cursor-pointer

      hover:bg-slate-50

      ${

        item.isRead

        ? "bg-white"

        : "bg-cyan-50"

      }

      `}

    >

      <p className="
      text-sm
      font-medium
      text-slate-800
      ">

        {item.message}

      </p>

      <p className="
      text-xs
      text-slate-500
      mt-1
      ">

        {

          new Date(
            item.createdAt
          ).toLocaleString()

        }

      </p>

    </div>

  )
)
        )

      }

    </div>

  )}

</div>
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
          
        </div>

        {/* UNASSIGNED PCs */}

{pcs.filter((pc) => pc.lab === "Unassigned").length > 0 && (
  <div className="mb-12">

    <h2 className="text-4xl font-bold mb-8">
      Unassigned PCs
    </h2>

    <div className="space-y-4">

      {pcs
        .filter((pc) => pc.lab === "Unassigned")
        .map((pc) => (

          <div
            key={pc._id}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 flex flex-wrap items-center gap-4"
          >

            {/* PC NAME */}

            <div className="flex-1">

              <h3 className="text-xl font-bold">
                💻 {pc.pcName}
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                Status:

                <span
                  className={
                    pc.status === "Online"
                      ? "text-green-400 ml-2"
                      : "text-red-400 ml-2"
                  }
                >
                  {pc.status}
                </span>

              </p>

            </div>

            {/* LAB SELECT */}

            <select
              value={selectedLab[pc.pcName] || ""}
              onChange={(e) =>
                setSelectedLab((prev) => ({
                  ...prev,
                  [pc.pcName]: e.target.value,
                }))
              }
              className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 min-w-[200px] text-white"
            >

              <option value="">
                Select Lab
              </option>

              {labs.map((lab) => (
                <option
                  key={lab._id}
                  value={lab.name}
                >
                  {lab.name}
                </option>
              ))}

            </select>

            {/* ASSIGN BUTTON */}

            <button
              onClick={() =>
                assignPCToLab(pc.pcName)
              }
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-semibold"
            >
              Assign
            </button>

          </div>

        ))}

    </div>

  </div>
)}

    {/* LABS */}

<div className="mb-7">

  <h2 className="text-3xl font-extrabold tracking-tight">
    Labs Overview
  </h2>

  <p className="text-slate-400 mt-1">
    Real-time summary of all computer labs in your organization
  </p>

</div>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

  {labs.map((lab) => {

    const stats =
      getLabStats(lab.name);

    const isAI =
      lab.name.toLowerCase().includes("ai");

    const isIOT =
      lab.name.toLowerCase().includes("iot");

    const isWeb =
      lab.name.toLowerCase().includes("web");

    const accent =
      isAI
        ? "cyan"
        : isIOT
        ? "purple"
        : isWeb
        ? "blue"
        : "emerald";


    const cardBorder =
      isAI
        ? "border-cyan-400/60 hover:shadow-cyan-500/30"
        : isIOT
        ? "border-purple-400/60 hover:shadow-purple-500/30"
        : isWeb
        ? "border-blue-400/60 hover:shadow-blue-500/30"
        : "border-emerald-400/60 hover:shadow-emerald-500/30";


    const cardGlow =
      isAI
        ? "bg-cyan-500"
        : isIOT
        ? "bg-purple-500"
        : isWeb
        ? "bg-blue-500"
        : "bg-emerald-500";


    const accentText =
      isAI
        ? "text-cyan-400"
        : isIOT
        ? "text-purple-400"
        : isWeb
        ? "text-blue-400"
        : "text-emerald-400";


    return (

      <div
        key={lab._id}

        onClick={() =>
          navigate(
            `/lab/${encodeURIComponent(
              lab.name
            )}`
          )
        }

        className={`
          group
          relative
          overflow-hidden
          rounded-2xl
          border
          bg-slate-950/80
          backdrop-blur-sm
          p-4
          cursor-pointer

          transition-all
          duration-300

          hover:-translate-y-2
          hover:shadow-2xl

          ${cardBorder}
        `}
      >

        {/* DOT PATTERN */}

        <div
          className="
            absolute
            top-0
            right-0
            w-32
            h-32
            opacity-20
            pointer-events-none

            bg-[radial-gradient(circle,_white_1px,_transparent_1px)]
            [background-size:10px_10px]
          "
        />


        {/* TOP */}

        <div className="relative flex items-center justify-between gap-2">

          <div className="min-w-0">

            <h2 className="text-xl font-extrabold truncate">
              {lab.name}
            </h2>

            <div
              className={`
                mt-2
                h-[2px]
                w-14
                rounded-full
                ${cardGlow}
              `}
            />

          </div>


          {/* DELETE BUTTON */}

          {lab.name !== "Unassigned" && (

            <button

              onClick={(e) => {

                e.stopPropagation();

                deleteLab(
                  lab._id
                );

              }}

              className="
                shrink-0
                px-3
                py-2
                rounded-lg

                border
                border-red-500/60

                bg-red-500/10
                text-red-400

                text-xs
                font-semibold

                hover:bg-red-500
                hover:text-white

                transition-all
                duration-300
              "
            >

              🗑 Delete

            </button>

          )}

        </div>


        {/* STATS */}

        <div className="grid grid-cols-3 gap-2 mt-5">


          {/* ONLINE */}

          <div
            className="
              rounded-xl
              border
              border-green-500/30
              bg-green-500/5
              px-2
              py-3
              text-center

              transition-all
              duration-300

              group-hover:bg-green-500/10
            "
          >

            <p className="text-xs text-slate-400">
              Online
            </p>

            <p className="
              text-2xl
              font-extrabold
              text-green-400
              mt-1
            ">
              {stats.online}
            </p>

          </div>


          {/* OFFLINE */}

          <div
            className="
              rounded-xl
              border
              border-red-500/30
              bg-red-500/5
              px-2
              py-3
              text-center

              transition-all
              duration-300

              group-hover:bg-red-500/10
            "
          >

            <p className="text-xs text-slate-400">
              Offline
            </p>

            <p className="
              text-2xl
              font-extrabold
              text-red-400
              mt-1
            ">
              {stats.offline}
            </p>

          </div>


          {/* TOTAL */}

          <div
            className={`
              rounded-xl
              px-2
              py-3
              text-center
              border

              ${
                isAI
                  ? "border-cyan-500/30 bg-cyan-500/5"
                  : isIOT
                  ? "border-purple-500/30 bg-purple-500/5"
                  : isWeb
                  ? "border-blue-500/30 bg-blue-500/5"
                  : "border-emerald-500/30 bg-emerald-500/5"
              }
            `}
          >

            <p className="text-xs text-slate-400">
              Total PCs
            </p>

            <p
              className={`
                text-2xl
                font-extrabold
                mt-1
                ${accentText}
              `}
            >
              {stats.total}
            </p>

          </div>

        </div>


        {/* FOOTER */}

        <div
          className="
            mt-4
            pt-3
            border-t
            border-dashed
            border-slate-700/70
          "
        >

          <div className="flex items-center justify-between gap-2">

            <span className="text-sm text-slate-300">
              Lab Status
            </span>


            <span
              className={`
                px-3
                py-1.5
                rounded-full
                text-xs
                font-semibold
                border

                ${
                  isAI
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                    : isIOT
                    ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
                    : isWeb
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                }
              `}
            >

              {stats.total} PC
              {stats.total !== 1 ? "s" : ""}
              {" "}in this lab

            </span>

          </div>

        </div>


        {/* HOVER ARROW */}

        <div
          className={`
            absolute
            bottom-3
            right-3

            w-6
            h-6
            rounded-full

            flex
            items-center
            justify-center

            text-xs
            text-white

            opacity-0
            translate-x-2

            group-hover:opacity-100
            group-hover:translate-x-0

            transition-all
            duration-300

            ${cardGlow}
          `}
        >
          →
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

