// PcDetails.jsx

import { useEffect } from "react";

import axios from "axios";

function PcDetails({

  selectedPC,

}) {

  // ==========================
  // FETCH HISTORY
  // ==========================

  useEffect(() => {

    if (!selectedPC) return;

    const fetchHistory =
    async () => {

      try {

        await axios.get(

          `https://smart-lab-monitoring.onrender.com/api/history/${selectedPC.pcName}`

        );

      }

      catch (error) {

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

  // ==========================
  // SHUTDOWN
  // ==========================

  const shutdownPC =
  async () => {

    const confirmShutdown =
    window.confirm(

      `Are you sure you want to shutdown ${selectedPC.pcName} ?`

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
        "Shutdown command sent "
      );

    }

    catch (error) {

      console.log(error);

      alert(
        "Shutdown failed ❌"
      );

    }

  };

  // ==========================
  // DELETE PC
  // ==========================

  const deletePC =
  async () => {

    const confirmDelete =
    window.confirm(

      `Are you sure you want to delete ${selectedPC.pcName} ?`

    );

    if (!confirmDelete) return;

    try {

      await axios.delete(

        `https://smart-lab-monitoring.onrender.com/api/delete-pc/${selectedPC.pcName}`

      );

      alert(
        "PC Deleted "
      );

      window.location.reload();

    }

    catch (error) {

      console.log(error);

      alert(
        "Delete Failed ❌"
      );

    }

  };

  // ==========================
  // NO PC SELECTED
  // ==========================

  if (!selectedPC) {

    return (

      <div className="
        mt-8
        bg-[#081028]
        p-6
        rounded-3xl
      ">

        <h2 className="
          text-3xl
          font-bold
          text-white
        ">

          Select a PC

        </h2>

      </div>

    );

  }

  return (

    <div className="
      mt-8
      bg-[#081028]
      p-6
      rounded-3xl
      text-white
    ">

      {/* HEADER */}

      <div className="
        flex
        justify-between
        items-center
        mb-8
      ">

        <div>

          <h1 className="
            text-4xl
            font-bold
          ">

            {selectedPC.pcName}

          </h1>

          <p className="
            text-gray-400
            mt-2
          ">

            {selectedPC.ipAddress}

          </p>

        </div>

        <div className="
          flex
          gap-4
        ">

          {/* SHUTDOWN */}

          <button

            onClick={shutdownPC}

            className="
            bg-red-600
            hover:bg-red-700
            px-6
            py-3
            rounded-2xl
            font-bold
            transition-all
            "

          >

            Shutdown

          </button>

          {/* DELETE */}

          <button

            onClick={deletePC}

            className="
            bg-slate-700
            hover:bg-slate-800
            px-6
            py-3
            rounded-2xl
            font-bold
            transition-all
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

        {/* CPU */}

        <div className="
          bg-[#020817]
          p-8
          rounded-3xl
          shadow-lg
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">

            CPU Usage

          </h2>

          <h1 className="
            text-7xl
            font-bold
            text-white
          ">

            {selectedPC.cpuUsage}%

          </h1>

        </div>

        {/* RAM */}

        <div className="
          bg-[#020817]
          p-8
          rounded-3xl
          shadow-lg
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">

            RAM Usage

          </h2>

          <h1 className="
            text-7xl
            font-bold
            text-green-400
          ">

            {selectedPC.ramUsage}%

          </h1>

        </div>

        {/* INTERNET */}

        <div className="
          bg-[#020817]
          p-8
          rounded-3xl
          shadow-lg
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-4
          ">

            Internet Speed

          </h2>

          <h1 className="
            text-6xl
            font-bold
            text-yellow-400
          ">

            {selectedPC.internetSpeed}

            <span className="
              text-3xl
              ml-2
            ">

              Mbps

            </span>

          </h1>

        </div>

      </div>

    </div>

  );

}

export default PcDetails;