// App.jsx

import { useEffect, useState } from "react";

import axios from "axios";

import io from "socket.io-client";

import Header from "./components/Header";
import StatCard from "./components/StatCard";
import PcTable from "./components/PcTable";
import Analytics from "./components/Analytics";
import PcDetails from "./components/PcDetails";

function App() {

  const [pcs, setPcs] =
  useState([]);

  const [selectedPC,
  setSelectedPC] =
  useState(null);

  // ==========================
  // FETCH PCS
  // ==========================

  useEffect(() => {

    const fetchPCs =
    async () => {

      try {

        const response =
        await axios.get(

          "http://localhost:5000/api/pcs"

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

    // ==========================
    // SOCKET
    // ==========================

    const socket =
    io(

      "http://localhost:5000"

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

    return () =>
    socket.disconnect();

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
  // SHUTDOWN ALL PCs
  // ==========================

  const shutdownAllPCs =
  async () => {

    try {

      await axios.post(

        "http://localhost:5000/api/shutdown-all"

      );

      alert(

        "Shutdown command sent to all PCs 🚀"

      );

    }

    catch (error) {

      console.log(
        error
      );

      alert(

        "Failed to shutdown all PCs ❌"

      );

    }

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

        {/* ==========================
            TOP HEADER
        ========================== */}

        <div className="
        flex
        justify-between
        items-center
        mb-8
        ">

          <Header />

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
            shadow-lg
            transition-all
            "

          >

            Shutdown All PCs

          </button>

        </div>

        {/* ==========================
            TOP CARDS
        ========================== */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-6
        mb-8
        ">

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

        {/* ==========================
            MAIN SECTION
        ========================== */}

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

        {/* ==========================
            SELECTED PC DETAILS
        ========================== */}

        <PcDetails

          selectedPC={
            selectedPC
          }

        />

      </div>

    </div>

  );

}

export default App;