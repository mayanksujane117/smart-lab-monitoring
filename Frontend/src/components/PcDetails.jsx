// PcDetails.jsx

import { useEffect, useState } from "react";

import axios from "axios";

import {

  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,

} from "recharts";

function PcDetails({

  selectedPC,

}) {

  const [history, setHistory] =
  useState([]);

  // ==========================
  // FETCH HISTORY
  // ==========================

  useEffect(() => {

    if (!selectedPC) return;

    const fetchHistory =
    async () => {

      try {

        const response =
        await axios.get(

          `https://smart-lab-monitoring.onrender.com/api/history/${selectedPC.pcName}`

        );

        setHistory(
          response.data.reverse()
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

    try {

      await axios.post(

        "https://smart-lab-monitoring.onrender.com/api/shutdown",

        {

          pcName:
          selectedPC.pcName,

        }

      );

      alert(
        "Shutdown command sent 🚀"
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

      </div>

      {/* LIVE STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        mb-8
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

      {/* GRAPH SECTION */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-3
        gap-6
      ">

        {/* CPU GRAPH */}

        <div className="
          bg-[#020817]
          p-6
          rounded-3xl
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">

            CPU Graph

          </h2>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <LineChart
              data={history}
            >

              <CartesianGrid
                stroke="#1e293b"
              />

              <XAxis hide />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="cpuUsage"
                stroke="#ffffff"
                strokeWidth={4}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* RAM GRAPH */}

        <div className="
          bg-[#020817]
          p-6
          rounded-3xl
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">

            RAM Graph

          </h2>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <LineChart
              data={history}
            >

              <CartesianGrid
                stroke="#1e293b"
              />

              <XAxis hide />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="ramUsage"
                stroke="#22c55e"
                strokeWidth={4}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* INTERNET GRAPH */}

        <div className="
          bg-[#020817]
          p-6
          rounded-3xl
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">

            Internet Speed Graph

          </h2>

          <ResponsiveContainer
            width="100%"
            height={260}
          >

            <LineChart
              data={history}
            >

              <CartesianGrid
                stroke="#1e293b"
              />

              <XAxis hide />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="internetSpeed"
                stroke="#facc15"
                strokeWidth={4}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}

export default PcDetails;