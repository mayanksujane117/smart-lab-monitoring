export function StatCard({ title, value, color }) {
  const colorStyles = {
    green: 'border-green-500/20 text-green-400',
    red: 'border-red-500/20 text-red-400',
    default: 'border-slate-800 text-white',
  };

  return (
    <div
      className={`bg-slate-900 rounded-3xl p-6 border shadow-xl ${
        color ? colorStyles[color] : colorStyles.default
      }`}
    >
      <h2 className="text-lg">{title}</h2>
      <p className="text-5xl font-bold mt-4">{value}</p>
    </div>
  );
}
export default StatCard;