// src/pages/Dashboard.jsx

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import StatCard from "../components/StatCard";
import PcTable from "../components/PcTable";
import Analytics from "../components/Analytics";
import PcDetails from "../components/PcDetails";

function AminDashboard() {

  const navigate = useNavigate();

  const role =
    localStorage.getItem("role");

  const username =
    localStorage.getItem("username");

  const [pcs, setPcs] =
    useState([]);

  const [selectedPC,
    setSelectedPC] =
    useState(null);

  // ==========================
  // AUTH CHECK
  // ==========================

  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (!token) {
      navigate("/login");
    }

  }, []);

  // ==========================
  // FETCH PCS
  // ==========================

  useEffect(() => {

    const fetchPCs =
      async () => {

        try {

          const response =
            await axios.get(
              "https://smart-lab-monitoring.onrender.com/api/pcs"
            );

          setPcs(
            response.data
          );

        }

        catch (error) {

          console.log(
            error
          );

        }

      };

    fetchPCs();

    const interval =
      setInterval(
        fetchPCs,
        10000
      );

    const socket =
      io(
        "https://smart-lab-monitoring.onrender.com"
      );

    socket.on(
      "pc-update",
      (updatedPC) => {

        setPcs((prev) => {

          const exists =
            prev.find(

              (pc) =>

                pc.pcName ===
                updatedPC.pcName

            );

          if (exists) {

            return prev.map(

              (pc) =>

                pc.pcName ===
                updatedPC.pcName

                  ? updatedPC

                  : pc

            );

          }

          return [

            ...prev,

            updatedPC,

          ];

        });

      }

    );

    return () => {

      clearInterval(
        interval
      );

      socket.disconnect();

    };

  }, []);

  // ==========================
  // STATS
  // ==========================

  const totalPCs =
    pcs.length;

  const onlinePCs =
    pcs.filter(

      (pc) =>

        pc.status ===
        "Online"

    ).length;

  const sleepingPCs =
    pcs.filter(

      (pc) =>

        pc.status ===
        "Sleeping"

    ).length;

  const offlinePCs =
    pcs.filter(

      (pc) =>

        pc.status ===
        "Offline"

    ).length;

  // ==========================
  // SHUTDOWN ALL
  // ==========================

  const shutdownAllPCs =
    async () => {

      const confirmShutdown =
        window.confirm(

          "Are you sure you want to shutdown ALL PCs ?"

        );

      if (!confirmShutdown)
        return;

      try {

        await axios.post(

          "https://smart-lab-monitoring.onrender.com/api/shutdown-all"

        );

        alert(
          "Shutdown command sent to all PCs"
        );

      }

      catch (error) {

        console.log(
          error
        );

        alert(
          "Failed to shutdown all PCs"
        );

      }

    };

  // ==========================
  // LOGOUT
  // ==========================

  const logout =
    () => {

      localStorage.clear();

      navigate(
        "/login"
      );

    };

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
      p-6
    ">

      <div className="
        max-w-7xl
        mx-auto
      ">

        {/* HEADER */}

        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">

          <div>

            <Header />

            <div className="
              mt-2
              flex
              items-center
              gap-3
              text-gray-400
            ">

              <span>
                {username}
              </span>

              <span className="
                bg-blue-600
                px-3
                py-1
                rounded-full
                text-sm
                text-white
              ">

                {role}

              </span>

            </div>

          </div>

          <div className="
            flex
            flex-col
            md:flex-row
            gap-4
            w-full
            md:w-auto

          ">

            {role === "Admin" && (

              <button

                onClick={() =>
                  navigate("/users")
                }

                className="
                  bg-blue-600
                  hover:bg-blue-700
                  px-6
                  py-3
                  rounded-2xl
                  font-bold
                "

              >

                User Management

              </button>

            )}

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
                font-bold
              "

            >

              Shutdown All PCs

            </button>

            <button

              onClick={logout}

              className="
                bg-slate-700
                hover:bg-slate-800
                px-6
                py-3
                rounded-2xl
                font-bold
              "

            >

              Logout

            </button>

          </div>

        </div>

        {/* CARDS */}

        <div className={`grid gap-6 mb-8 ${
          role === "Admin"
            ? "grid-cols-1 md:grid-cols-5"
            : "grid-cols-1 md:grid-cols-4"
        }`}>

          <StatCard
            title="Total PCs"
            value={totalPCs}
          />

          <StatCard
            title="Online"
            value={onlinePCs}
          />

          <StatCard
            title="Sleeping"
            value={sleepingPCs}
          />

          <StatCard
            title="Offline"
            value={offlinePCs}
          />

          
        </div>

        {/* TABLE + ANALYTICS */}

        <div className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
          mb-8
        ">

          <div className="
            lg:col-span-2
          ">

            <PcTable
              pcs={pcs}
              setSelectedPC={
                setSelectedPC
              }
            />

          </div>

          <Analytics
            pcs={pcs}
          />

        </div>

        {/* PC DETAILS */}

        <PcDetails
          selectedPC={
            selectedPC
          }
        />

      </div>

    </div>

  );

}

export default AminDashboard;