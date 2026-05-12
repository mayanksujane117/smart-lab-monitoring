import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CpuChart({ pcs }) {

  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-xl font-semibold mb-4">
        CPU Usage
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <BarChart data={pcs}>

          <XAxis dataKey="pcName" />

          <Tooltip />

          <Bar dataKey="cpuUsage" />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default CpuChart;
