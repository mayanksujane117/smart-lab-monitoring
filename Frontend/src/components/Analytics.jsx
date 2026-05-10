function Analytics({
  totalPCs,
  onlinePCs,
  offlinePCs,
}) {

  return (

    <div className="bg-slate-900 p-6 rounded-2xl">

      <h2 className="text-2xl font-bold mb-6">
        System Analytics
      </h2>

      <div className="space-y-4">

        <div>

          <div className="flex justify-between mb-2">

            <span>Online PCs</span>

            <span>{onlinePCs}</span>

          </div>

          <div className="w-full bg-slate-700 h-3 rounded-full">

            <div
              className="bg-green-500 h-3 rounded-full"
              style={{
                width: `${(onlinePCs / totalPCs) * 100}%`,
              }}
            ></div>

          </div>

        </div>

        <div>

          <div className="flex justify-between mb-2">

            <span>Offline PCs</span>

            <span>{offlinePCs}</span>

          </div>

          <div className="w-full bg-slate-700 h-3 rounded-full">

            <div
              className="bg-red-500 h-3 rounded-full"
              style={{
                width: `${(offlinePCs / totalPCs) * 100}%`,
              }}
            ></div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;