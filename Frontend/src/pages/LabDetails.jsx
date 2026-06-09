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

  const [
  screenshot,
  setScreenshot
] = useState("");

  // ==========================
  // FETCH PCS
  // ==========================

  useEffect(() => {

    const fetchPCs = async () => {

      try {

        const response = await axios.get(
          "https://smart-lab-monitoring.onrender.com/api/pcs"
        );

        const filteredPCs = response.data.filter(
          (pc) => pc.lab === decodedLab
        );

        setPcs(filteredPCs);

      } catch (error) {

        console.log(error);

      }

    };

    

    fetchPCs();

    const interval = setInterval(fetchPCs, 5000);

    return () => clearInterval(interval);

  }, [decodedLab]);

  useEffect(() => {

  if (!selectedPC) return;

  const updatedPC = pcs.find(

    (pc) =>
      pc.pcName ===
      selectedPC.pcName

  );

  if (updatedPC) {

    setSelectedPC(
      updatedPC
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

  const shutdownLab = async () => {

    const text = prompt(`Type Piemr to confirm shutdown of ${decodedLab}`);

    if (text !== "Piemr") {

      alert("Shutdown cancelled");

      return;

    }

    try {

      await axios.post(
        "https://smart-lab-monitoring.onrender.com/api/shutdown-lab",
        { lab: decodedLab }
      );

      alert("Shutdown command sent");

    } catch (error) {

      console.log(error);

      alert("Failed to send command");

    }

  };

  const takeScreenshot =
async (pcName) => {

  try {

    await axios.post(

      "https://smart-lab-monitoring.onrender.com/api/request-screenshot",

      {
        pcName
      }

    );

    setTimeout(
      async () => {

        const response =
          await axios.get(

            `https://smart-lab-monitoring.onrender.com/api/screenshot/${pcName}`

          );

        setScreenshot(

          response.data
            .screenshot

        );

      },

      2000

    );

  }

  catch (error) {

    console.log(error);

  }

};

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

        {/* HEADER */}

<div className="
flex
justify-between
items-center
mb-16
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

  <div className="
  flex
  items-center
  justify-end
  gap-3
  ml-auto
  ">

    <button

      onClick={shutdownLab}

      className="
      bg-red-600
      hover:bg-red-700
      px-6
      py-3
      rounded-2xl
      font-semibold
      shadow-lg
      transition-all
      "

    >

      ⏻ Shutdown Lab PCs

    </button>

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
      transition-all
      "

    >

      ← Back

    </button>

  </div>

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

        

        <>
  <PcDetails
    selectedPC={
      selectedPC
    }
  />

  {selectedPC && (

    <button

      onClick={() =>
        takeScreenshot(
          selectedPC.pcName
        )
      }

      className="
      mt-4
      bg-cyan-600
      px-5
      py-3
      rounded-xl
      "

    >

      Screenshot

    </button>

  )}

  {screenshot && (

    <div className="
    mt-6
    bg-[#0B1220]
    p-6
    rounded-3xl
    ">

      <img

        src={`data:image/png;base64,${screenshot}`}

        alt="Screenshot"

        className="
        w-full
        rounded-xl
        "

      />

    </div>

  )}

</>

      </div>

    </div>

  );

}

export default LabDetails;