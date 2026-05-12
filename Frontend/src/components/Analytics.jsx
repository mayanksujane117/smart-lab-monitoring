function Analytics({ pcs }) {

  const avgCPU = (
    pcs.reduce(
      (acc, pc) =>
        acc + Number(pc.cpuUsage || 0),
      0
    ) / (pcs.length || 1)
  ).toFixed(2);

  const avgRAM = (
    pcs.reduce(
      (acc, pc) =>
        acc + Number(pc.ramUsage || 0),
      0
    ) / (pcs.length || 1)
  ).toFixed(2);

  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-2xl font-semibold mb-6">
        Analytics
      </h2>

      <div className="space-y-4">

        <div>
          <p className="text-slate-400">
            Average CPU
          </p>
          <h3 className="text-3xl font-bold">
            {avgCPU}%
          </h3>
        </div>

        <div>
          <p className="text-slate-400">
            Average RAM
          </p>
          <h3 className="text-3xl font-bold">
            {avgRAM}%
          </h3>
        </div>

      </div>

    </div>
  );
}

export default Analytics;
