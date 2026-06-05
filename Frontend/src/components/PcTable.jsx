function PcTable({
  pcs,
  setSelectedPC,
}) {

  return (

    <div className="
    rounded-3xl
    border
    border-slate-800
    bg-[#0B1220]
    p-6
    overflow-hidden
    ">

      <div className="
      flex
      justify-between
      items-center
      mb-6
      ">

        <div>

          <h2 className="
          text-3xl
          font-bold
          text-white
          ">

            Live PCs

          </h2>

          <p className="
          text-slate-400
          mt-1
          ">

            Real-time connected systems

          </p>

        </div>

        <div className="
        bg-cyan-500/10
        text-cyan-400
        px-4
        py-2
        rounded-xl
        font-medium
        ">

          {pcs.length} Systems

        </div>

      </div>

      <div className="
      overflow-x-auto
      ">

        <table className="
        w-full
        ">

          <thead>

            <tr className="
            border-b
            border-slate-800
            text-slate-400
            ">

              <th className="
              py-4
              text-left
              ">
                PC Name
              </th>

              <th className="
              py-4
              text-left
              ">
                Lab
              </th>

              <th className="
              py-4
              text-left
              ">
                IP Address
              </th>

              <th className="
              py-4
              text-left
              ">
                CPU
              </th>

              <th className="
              py-4
              text-left
              ">
                RAM
              </th>

              <th className="
              py-4
              text-left
              ">
                Network
              </th>

              <th className="
              py-4
              text-left
              ">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {pcs.map((pc) => (

              <tr

                key={pc._id}

                onClick={() =>
                  setSelectedPC(pc)
                }

                className="
                border-b
                border-slate-900
                hover:bg-slate-900/60
                cursor-pointer
                transition-all
                duration-300
                "

              >

                <td className="
                py-5
                font-semibold
                text-white
                ">
                  {pc.pcName}
                </td>

                <td>
                  {pc.lab}
                </td>

                <td className="
                text-slate-400
                ">
                  {pc.ipAddress}
                </td>

                <td>

                  <span className="
                  text-cyan-400
                  font-semibold
                  ">

                    {pc.cpuUsage}%

                  </span>

                </td>

                <td>

                  <span className="
                  text-green-400
                  font-semibold
                  ">

                    {pc.ramUsage}%

                  </span>

                </td>

                <td>

                  <span className="
                  text-yellow-400
                  font-semibold
                  ">

                    {pc.internetSpeed} Mbps

                  </span>

                </td>

                <td>

                  {pc.status ===
                  "Online" ? (

                    <span className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1
                    rounded-full
                    bg-green-500/10
                    text-green-400
                    ">

                      <div className="
                      w-2
                      h-2
                      rounded-full
                      bg-green-400
                      animate-pulse
                      " />

                      Online

                    </span>

                  ) : (

                    <span className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1
                    rounded-full
                    bg-red-500/10
                    text-red-400
                    ">

                      <div className="
                      w-2
                      h-2
                      rounded-full
                      bg-red-400
                      " />

                      Offline

                    </span>

                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default PcTable;