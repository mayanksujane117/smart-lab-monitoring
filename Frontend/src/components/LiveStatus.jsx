export function LiveStatus() {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">Live Status</h2>
          <p className="text-slate-400 mt-1">
            Monitoring all labs in real time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 font-medium">
            System Running
          </span>
        </div>
      </div>
    </div>
  );
}
export default LiveStatus;