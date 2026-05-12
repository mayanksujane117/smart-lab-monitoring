function StatCard({ title, value, color }) {

  return (

    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-slate-400 text-sm mb-2">
        {title}
      </h2>

      <p className="text-4xl font-bold">
        {value}
      </p>

    </div>
  );
}

export default StatCard;
