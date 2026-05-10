function LabActivity({ labs }) {

  return (

    <div className="bg-slate-900 p-6 rounded-2xl">

      <h2 className="text-3xl font-bold mb-8">
        Lab Wise Activity
      </h2>

      <div className="space-y-8">

        {labs.map((lab, index) => {

          const percentage =
            lab.total > 0
              ? (lab.online / lab.total) * 100
              : 0;

          return (

            <div key={index}>

              {/* Header */}
              <div className="flex justify-between mb-3">

                <h3 className="text-xl font-semibold">
                  {lab.name}
                </h3>

                <span className="text-lg font-bold">
                  {lab.online}/{lab.total}
                </span>

              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden">

                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                  }}
                ></div>

              </div>

              {/* Online PCs */}
              <div className="mt-4">

                {
                  lab.onlinePCs &&
                  lab.onlinePCs.length > 0 ? (

                    <div className="flex flex-wrap gap-2">

                      {lab.onlinePCs.map(
                        (pc, idx) => (

                          <span
                            key={idx}
                            className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm"
                          >
                            {pc.pcName}
                          </span>

                        )
                      )}

                    </div>

                  ) : (

                    <p className="text-slate-400">
                      No Online PCs
                    </p>

                  )
                }

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default LabActivity;