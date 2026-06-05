import { useEffect } from "react";
import axios from "axios";

function PcDetails({ selectedPC }) {

  useEffect(() => {

    if (!selectedPC) return;

    const fetchHistory = async () => {

      try {

        await axios.get(
          `https://smart-lab-monitoring.onrender.com/api/history/${selectedPC.pcName}`
        );

      } catch (error) {

        console.log(error);

      }

    };

    fetchHistory();

    const interval =
      setInterval(
        fetchHistory,
        5000
      );

    return () =>
      clearInterval(interval);

  }, [selectedPC]);

  const shutdownPC =
    async () => {

      if (!selectedPC) return;

      const confirmShutdown =
        window.confirm(
          `Shutdown ${selectedPC.pcName} ?`
        );

      if (!confirmShutdown) return;

      try {

        await axios.post(
          "https://smart-lab-monitoring.onrender.com/api/shutdown",
          {
            pcName:
              selectedPC.pcName,
          }
        );

        alert(
          "Shutdown command sent"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Shutdown Failed"
        );

      }

    };

  const deletePC =
    async () => {

      if (!selectedPC) return;

      const confirmDelete =
        window.confirm(
          `Delete ${selectedPC.pcName} ?`
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(
          `https://smart-lab-monitoring.onrender.com/api/delete-pc/${selectedPC.pcName}`
        );

        alert(
          "PC Deleted Successfully"
        );

        window.location.reload();

      } catch (error) {

        console.log(error);

        alert(
          "Delete Failed"
        );

      }

    };

  if (!selectedPC) {

    return (

      <div className="
      rounded-3xl
      border
      border-slate-800
      bg-[#0B1220]
      p-12
      text-center
      ">

        <h2 className="
        text-4xl
        font-bold
        text-white
        ">

          Select a PC

        </h2>

        <p className="
        text-slate-400
        mt-3
        ">

          Click any PC from the table
          to view details

        </p>

      </div>

    );

  }

  return (

    <div className="
    rounded-3xl
    border
    border-slate-800
    bg-[#0B1220]
    p-8
    mt-8
    ">

      {/* HEADER */}

      <div className="
      flex
      flex-col
      lg:flex-row
      justify-between
      gap-6
      mb-10
      ">

        <div>

          <div className="
          flex
          items-center
          gap-3
          mb-4
          ">

            <div className={`
            w-3
            h-3
            rounded-full

            ${
              selectedPC.status === "Online"
              ? "bg-green-500"
              : selectedPC.status === "Sleeping"
              ? "bg-yellow-500"
              : "bg-red-500"
            }
            `} />

            <span className="
            text-slate-400
            ">

              {selectedPC.status}

            </span>

          </div>

          <h1 className="
          text-5xl
          font-bold
          text-white
          ">

            {selectedPC.pcName}

          </h1>

          <p className="
          text-slate-400
          mt-2
          ">

            {selectedPC.ipAddress}

          </p>

        </div>

        <div className="
        flex
        flex-wrap
        gap-3
        ">

          <button

            onClick={shutdownPC}

            className="
            bg-red-600
            hover:bg-red-700
            px-6
            py-3
            rounded-2xl
            font-semibold
            "

          >

            Shutdown

          </button>

          <button

            onClick={deletePC}

            className="
            bg-slate-700
            hover:bg-slate-600
            px-6
            py-3
            rounded-2xl
            font-semibold
            "

          >

            Delete PC

          </button>

        </div>

      </div>

      {/* LIVE STATS */}

      <div className="
      grid
      grid-cols-1
      md:grid-cols-3
      gap-6
      ">

        <div className="
        bg-slate-900
        rounded-3xl
        p-8
        border
        border-slate-800
        ">

          <p className="
          text-slate-400
          mb-3
          ">

            CPU Usage

          </p>

          <h2 className="
          text-6xl
          font-bold
          text-cyan-400
          ">

            {selectedPC.cpuUsage}%

          </h2>

        </div>

        <div className="
        bg-slate-900
        rounded-3xl
        p-8
        border
        border-slate-800
        ">

          <p className="
          text-slate-400
          mb-3
          ">

            RAM Usage

          </p>

          <h2 className="
          text-6xl
          font-bold
          text-green-400
          ">

            {selectedPC.ramUsage}%

          </h2>

        </div>

        <div className="
        bg-slate-900
        rounded-3xl
        p-8
        border
        border-slate-800
        ">

          <p className="
          text-slate-400
          mb-3
          ">

            Internet Speed

          </p>

          <h2 className="
          text-5xl
          font-bold
          text-yellow-400
          ">

            {selectedPC.internetSpeed}

          </h2>

          <p className="
          text-slate-500
          mt-2
          ">

            Mbps

          </p>

        </div>

      </div>

      {/* EXTRA INFO */}

      <div className="
      mt-8
      bg-slate-900
      rounded-3xl
      border
      border-slate-800
      p-6
      ">

        <h2 className="
        text-2xl
        font-bold
        mb-6
        ">

          System Information

        </h2>

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
        ">

          <div>

            <p className="
            text-slate-400
            mb-1
            ">

              Lab

            </p>

            <h3 className="
            text-xl
            font-semibold
            ">

              {selectedPC.lab}

            </h3>

          </div>

          <div>

            <p className="
            text-slate-400
            mb-1
            ">

              Active Application

            </p>

            <h3 className="
            text-xl
            font-semibold
            ">

              {selectedPC.activeApp || "Unknown"}

            </h3>

          </div>

          <div>

            <p className="
            text-slate-400
            mb-1
            ">

              Last Status

            </p>

            <h3 className="
            text-xl
            font-semibold
            ">

              {selectedPC.status}

            </h3>

          </div>

          <div>

            <p className="
            text-slate-400
            mb-1
            ">

              IP Address

            </p>

            <h3 className="
            text-xl
            font-semibold
            ">

              {selectedPC.ipAddress}

            </h3>

          </div>

        </div>

      </div>

    </div>

  );

}

export default PcDetails;