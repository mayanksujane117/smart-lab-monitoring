export function Header() {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-bold">Smart Lab Monitoring System</h1>
        <p className="text-slate-400 mt-2">
          Real-time college computer lab monitoring dashboard
        </p>
      </div>

      <button className="bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-2xl font-semibold shadow-lg">
        Live Monitoring
      </button>
    </div>
  );
}
export default Header;