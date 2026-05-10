import { useEffect, useState } from "react";

import axios from "axios";
import io from "socket.io-client";

import Header from "./components/Header";
import StatCard from "./components/StatCard";
import PcTable from "./components/PcTable";
import Analytics from "./components/Analytics";
import LabActivity from "./components/LabActivity";
import LiveStatus from "./components/LiveStatus";


function App() {

  // State
  const [pcs, setPcs] = useState([]);



  // Realtime Socket + Initial Data
  useEffect(() => {

    let isMounted = true;

    // Load Existing PCs
    (async () => {
      try {
        const response = await axios.get(
          "https://smart-lab-monitoring.onrender.com/api/pcs"        );
        if (isMounted) setPcs(response.data);
      } catch (error) {
        console.log(error);
      }
    })();

    // Socket Connection
    const socket = io("https://smart-lab-monitoring.onrender.com");


    // Listen Realtime Updates
    socket.on("pc-update", (newPC) => {

      setPcs((prev) => {

        const existing = prev.find(
          (pc) => pc.pcName === newPC.pcName
        );

        // Update Existing PC
        if (existing) {

          return prev.map((pc) =>
            pc.pcName === newPC.pcName
              ? newPC
              : pc
          );
        }

        // Add New PC
        return [...prev, newPC];

      });
    });

    // Disconnect Socket
    return () => socket.disconnect();

  }, []);

  // Counts
  const totalPCs = pcs.length;

  const onlinePCs = pcs.filter(
    (pc) => pc.status === "Online"
  ).length;

  const offlinePCs = pcs.filter(
    (pc) => pc.status === "Offline"
  ).length;

  // Lab Wise Data
  const labs = [

  {
    name: "Lab 1",

    total: pcs.filter(
      (pc) => pc.lab === "Lab 1"
    ).length,

    online: pcs.filter(
      (pc) =>
        pc.lab === "Lab 1" &&
        pc.status === "Online"
    ).length,

    onlinePCs: pcs.filter(
      (pc) =>
        pc.lab === "Lab 1" &&
        pc.status === "Online"
    ),
  },

  {
    name: "Lab 2",

    total: pcs.filter(
      (pc) => pc.lab === "Lab 2"
    ).length,

    online: pcs.filter(
      (pc) =>
        pc.lab === "Lab 2" &&
        pc.status === "Online"
    ).length,

    onlinePCs: pcs.filter(
      (pc) =>
        pc.lab === "Lab 2" &&
        pc.status === "Online"
    ),
  },

  {
    name: "Lab 3",

    total: pcs.filter(
      (pc) => pc.lab === "Lab 3"
    ).length,

    online: pcs.filter(
      (pc) =>
        pc.lab === "Lab 3" &&
        pc.status === "Online"
    ).length,

    onlinePCs: pcs.filter(
      (pc) =>
        pc.lab === "Lab 3" &&
        pc.status === "Online"
    ),
  },

];

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <Header />

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <StatCard
            title="Total PCs"
            value={totalPCs}
          />

          <StatCard
            title="Online PCs"
            value={onlinePCs}
            color="green"
          />

          <StatCard
            title="Offline PCs"
            value={offlinePCs}
            color="red"
          />

        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* PC Table */}
          <div className="lg:col-span-2">

            <PcTable pcs={pcs} />

          </div>

          {/* Analytics */}
          <div className="space-y-6">

            <Analytics
              totalPCs={totalPCs}
              onlinePCs={onlinePCs}
              offlinePCs={offlinePCs}
            />

            <LabActivity labs={labs} />

          </div>

        </div>

        {/* Live Status */}
        <LiveStatus />

      </div>

    </div>
  );
}

export default App;