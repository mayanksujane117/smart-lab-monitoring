// App.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

import Header from "./components/Header";
import StatCard from "./components/StatCard";
import PcTable from "./components/PcTable";
import Analytics from "./components/Analytics";
import CpuChart from "./components/CpuChart";
import RamChart from "./components/RamChart";
import InternetChart from "./components/InternetChart";
import PcDetails from "./components/PcDetails";

function App() {

  const [pcs, setPcs] = useState([]);

  const [selectedPC, setSelectedPC] =
    useState(null);

  useEffect(() => {

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

    fetchPCs();

    const socket = io(
      "https://smart-lab-monitoring.onrender.com"
    );

    socket.on("pc-update", (updatedPC) => {

      setPcs((prev) => {

        const exists = prev.find(
          (pc) =>
            pc.pcName === updatedPC.pcName
        );

        if (exists) {

          return prev.map((pc) =>
            pc.pcName === updatedPC.pcName
              ? updatedPC
              : pc
          );
        }

        return [...prev, updatedPC];
      });
    });

    return () => socket.disconnect();

  }, []);

  const totalPCs = pcs.length;

  const onlinePCs = pcs.filter(
    (pc) => pc.status === "Online"
  ).length;

  const sleepingPCs = pcs.filter(
    (pc) => pc.status === "Sleeping"
  ).length;

  const offlinePCs = pcs.filter(
    (pc) => pc.status === "Offline"
  ).length;

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-7xl mx-auto">

        <Header />

        {/* TOP CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

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

        {/* MAIN SECTION */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          <div className="lg:col-span-2">

            <PcTable
              pcs={pcs}
              setSelectedPC={setSelectedPC}
            />

          </div>

          <Analytics pcs={pcs} />

        </div>

        {/* SELECTED PC DETAILS */}

        <PcDetails
          selectedPC={selectedPC}
        />

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

          <CpuChart pcs={pcs} />

          <RamChart pcs={pcs} />

          <InternetChart pcs={pcs} />

        </div>

      </div>

    </div>
  );
}

export default App;