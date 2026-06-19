import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

function AssistantDashboard() {
  const navigate = useNavigate();

  const [pcs, setPcs] = useState([]);
  const [labs, setLabs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);



  const username = localStorage.getItem("username");

  const assignedLabs = JSON.parse(
    localStorage.getItem("assignedLabs") || "[]"
  );

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

  const fetchLabs = async () => {
    try {
      const response = await axios.get(
        "https://smart-lab-monitoring.onrender.com/api/labs"
      );
      setLabs(response.data);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchNotifications =
async () => {

  try {

    const res =
      await axios.get(

        "https://smart-lab-monitoring.onrender.com/api/notifications/Lab Assistant"

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

    setNotifications([]);

  }

  catch (error) {

    console.log(error);

  }

};
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "Lab Assistant") {
      navigate("/login");
      return;
    }

    // ESLint prefers not to call setState directly in effect; these
    // functions only run once after mount and are required for data loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchPCs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchLabs();

    const interval = setInterval(() => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      fetchPCs();
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getLabStats = (lab) => {
    const labPCs = pcs.filter((pc) => pc.lab === lab);

    return {
      total: labPCs.length,
      online: labPCs.filter((pc) => pc.status === "Online").length,
      offline: labPCs.filter((pc) => pc.status === "Offline").length,
    };
  };

  const visibleLabs = labs.filter((lab) =>
    assignedLabs.includes(lab.name)
  );

  useEffect(() => {
    const socket = io(
      "https://smart-lab-monitoring.onrender.com"
    );

    const handler = () => {
      // schedule to avoid react exhaustive-deps eslint warning
      Promise.resolve().then(() => fetchNotifications());
    };

    socket.on("notification-update", handler);

    // initial load
    fetchNotifications();

    return () => {
      socket.off("notification-update", handler);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050816] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div
          className="flex justify-end items-center gap-4 mb-8"
        >

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
      bg-white
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

                  className="
                  p-4
                  border-b
                  cursor-pointer
                  hover:bg-slate-100
                  "

                >

                  <p>
                    {item.message}
                  </p>

                  <p className="
                  text-xs
                  text-gray-500
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

  <button
    onClick={logout}
    className="
    bg-red-600
    hover:bg-red-700
    px-6
    py-3
    rounded-2xl
    font-semibold
    "
  >
    Logout
  </button>

</div>

        <div className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-10 mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Welcome Back, {username}
          </h1>

          <p className="text-xl text-cyan-100">
            Monitor your assigned labs in real-time.
          </p>
        </div>

        <h2 className="text-4xl font-bold mb-8">
          Assigned Labs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleLabs.map((lab) => {
            const stats = getLabStats(lab.name);

            return (
              <div
                key={lab._id}
                onClick={() =>
                  navigate(
                    `/lab/${encodeURIComponent(lab.name)}`
                  )
                }
                className="cursor-pointer rounded-3xl border border-slate-800 bg-[#0B1220] p-8 hover:border-cyan-500 hover:scale-105 transition-all duration-300"
              >
                <h2 className="text-3xl font-bold mb-8">
                  {lab.name}
                </h2>

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

export default AssistantDashboard;