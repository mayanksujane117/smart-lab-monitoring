function StatCard({

  title,

  value,

  icon,

}) {

  return (

    <div className="
    relative
    overflow-hidden
    rounded-3xl
    border
    border-slate-800
    bg-[#0B1220]
    p-6
    hover:border-cyan-500
    transition-all
    duration-300
    hover:scale-[1.02]
    ">

      <div className="
      absolute
      top-0
      right-0
      w-24
      h-24
      bg-cyan-500/10
      rounded-full
      blur-3xl
      "></div>

      <div className="
      flex
      justify-between
      items-start
      ">

        <div>

          <p className="
          text-slate-400
          text-sm
          mb-3
          uppercase
          tracking-wider
          ">

            {title}

          </p>

          <h2 className="
          text-5xl
          font-bold
          text-white
          ">

            {value}

          </h2>

        </div>

        <div className="
        w-14
        h-14
        rounded-2xl
        bg-cyan-500/10
        flex
        items-center
        justify-center
        text-2xl
        ">

          {icon}

        </div>

      </div>

    </div>

  );

}

export default StatCard;