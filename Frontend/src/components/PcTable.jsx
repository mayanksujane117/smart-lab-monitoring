// PcTable.jsx

function PcTable({
  pcs,
  setSelectedPC,
}) {

  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 overflow-auto">

      <h2 className="text-2xl font-semibold mb-4">

        Live PCs

      </h2>

      <table className="w-full text-left">

        <thead>

          <tr className="text-slate-400 border-b border-slate-700">

            <th className="pb-3">
              PC
            </th>

            <th className="pb-3">
              IP
            </th>

            <th className="pb-3">
              CPU
            </th>

            <th className="pb-3">
              RAM
            </th>

            <th className="pb-3">
              Internet
            </th>

            <th className="pb-3">
              Status
            </th>

          </tr>

        </thead>

        <tbody>

          {pcs.map((pc, index) => (

            <tr
              key={index}

              onClick={() =>
                setSelectedPC(pc)
              }

              className="border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition"
            >

              <td className="py-4">
                {pc.pcName}
              </td>

              <td>
                {pc.ipAddress}
              </td>

              <td>
                {pc.cpuUsage}%
              </td>

              <td>
                {pc.ramUsage}%
              </td>

              <td>
                {pc.internetSpeed}
              </td>

              <td>

                <span
                  className={`
                  px-3 py-1 rounded-full text-sm

                  ${
                    pc.status === "Online"
                      ? "bg-green-500/20 text-green-400"

                      : pc.status === "Sleeping"
                      ? "bg-yellow-500/20 text-yellow-400"

                      : "bg-red-500/20 text-red-400"
                  }
                  `}
                >

                  {pc.status}

                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default PcTable;