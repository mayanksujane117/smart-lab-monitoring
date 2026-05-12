import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RamChart({ pcs }) {

  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-xl font-semibold mb-4">
        RAM Usage
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <PieChart>

          <Pie
            data={pcs}
            dataKey="ramUsage"
            nameKey="pcName"
            outerRadius={80}
          />

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}

export default RamChart;
