import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function InternetChart({ pcs }) {

  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-xl font-semibold mb-4">
        Internet Speed
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={pcs}>

          <XAxis dataKey="pcName" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="internetSpeed"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default InternetChart;
