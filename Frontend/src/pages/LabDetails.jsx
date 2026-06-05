import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import PcTable from "../components/PcTable";
import Analytics from "../components/Analytics";
import PcDetails from "../components/PcDetails";

function LabDetails() {

  const { labName } =
    useParams();

  const decodedLab =
    decodeURIComponent(
      labName
    );

  const navigate =
    useNavigate();

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
              "https://smart-lab-monitoring.onrender.com/api/pcs"
            );

          const filteredPCs =
            response.data.filter(

              (pc) =>
                pc.lab ===
                decodedLab

            );

          setPcs(
            filteredPCs
          );

          // LIVE UPDATE
          if (selectedPC) {

            const updatedPC =
              filteredPCs.find(

                (pc) =>
                  pc.pcName ===
                  selectedPC.pcName

              );

            if (updatedPC) {

              setSelectedPC(
                updatedPC
              );

            }

          }

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
        5000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [
    decodedLab,
    selectedPC,
  ]);

  // ==========================
  // EXTRA LIVE SYNC
  // ==========================

  useEffect(() => {

    if (!selectedPC)
      return;

    const latestPC =
      pcs.find(

        (pc) =>
          pc.pcName ===
          selectedPC.pcName

      );

    if (latestPC) {

      setSelectedPC(
        latestPC
      );

    }

  }, [pcs]);

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

  const offlinePCs =
    pcs.filter(

      (pc) =>
        pc.status ===
        "Offline"

    ).length;

  const sleepingPCs =
    pcs.filter(

      (pc) =>
        pc.status ===
        "Sleeping"

    ).length;

  return (

    <div className="
    min-h-screen
    bg-[#050816]
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

            <h1 className="
            text-5xl
            font-bold
            ">

              {decodedLab}

            </h1>

            <p className="
            text-slate-400
            mt-2
            ">

              Real-Time Lab Monitoring

            </p>

          </div>

          <button

            onClick={() =>
              navigate(-1)
            }

            className="
            bg-slate-800
            hover:bg-slate-700
            px-6
            py-3
            rounded-2xl
            font-semibold
            "

          >

            ← Back

          </button>

        </div>

        {/* CARDS */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-4
        gap-6
        mb-8
        ">

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="
            text-slate-400
            ">

              Total PCs

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

              {totalPCs}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="
            text-slate-400
            ">

              Online

            </p>

            <h2 className="
            text-5xl
            font-bold
            text-green-400
            mt-3
            ">

              {onlinePCs}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="
            text-slate-400
            ">

              Offline

            </p>

            <h2 className="
            text-5xl
            font-bold
            text-red-400
            mt-3
            ">

              {offlinePCs}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="
            text-slate-400
            ">

              Sleeping

            </p>

            <h2 className="
            text-5xl
            font-bold
            text-yellow-400
            mt-3
            ">

              {sleepingPCs}

            </h2>

          </div>

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

export default LabDetails;