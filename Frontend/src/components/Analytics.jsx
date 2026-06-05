function Analytics({ pcs }) {

  
  return (

    <div className="
    rounded-3xl
    border
    border-slate-800
    bg-[#0B1220]
    p-6
    ">

      <h2 className="
      text-3xl
      font-bold
      mb-8
      text-white
      ">

        Analytics

      </h2>

      
      {/* SUMMARY */}

      <div className="
      mt-10
      grid
      grid-cols-3
      gap-3
      ">

        <div className="
        bg-slate-900
        rounded-2xl
        p-4
        text-center
        ">

          <h3 className="
          text-2xl
          font-bold
          text-cyan-400
          ">

            {pcs.length}

          </h3>

          <p className="
          text-xs
          text-slate-400
          mt-1
          ">

            Devices

          </p>

        </div>

        <div className="
        bg-slate-900
        rounded-2xl
        p-4
        text-center
        ">

          <h3 className="
          text-2xl
          font-bold
          text-green-400
          ">

            {pcs.filter(
              pc =>
              pc.status === "Online"
            ).length}

          </h3>

          <p className="
          text-xs
          text-slate-400
          mt-1
          ">

            Online

          </p>

        </div>

        <div className="
        bg-slate-900
        rounded-2xl
        p-4
        text-center
        ">

          <h3 className="
          text-2xl
          font-bold
          text-red-400
          ">

            {pcs.filter(
              pc =>
              pc.status === "Offline"
            ).length}

          </h3>

          <p className="
          text-xs
          text-slate-400
          mt-1
          ">

            Offline

          </p>

        </div>

      </div>

    </div>

  );

}

export default Analytics;