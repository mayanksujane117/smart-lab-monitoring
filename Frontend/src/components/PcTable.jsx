function PcTable({ pcs }) {

  return (

    <div className="bg-slate-900 p-6 rounded-2xl">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          Lab Status
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700">

              <th className="text-left py-3">
                PC Name
              </th>

              <th className="text-left py-3">
                Lab
              </th>

              <th className="text-left py-3">
                IP Address
              </th>

              <th className="text-left py-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {pcs.map((pc, index) => (

              <tr
                key={index}
                className="border-b border-slate-800"
              >

                <td className="py-4">
                  {pc.pcName}
                </td>

                <td className="py-4">
                  {pc.lab}
                </td>

                <td className="py-4">
                  {pc.ipAddress}
                </td>

                <td className="py-4">

                  <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold ${
                      pc.status === "Online"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {pc.status}
                  </span>

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