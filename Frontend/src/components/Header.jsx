function Header() {

  const username =
    localStorage.getItem(
      "username"
    );

  return (

    <div className="
    flex
    justify-between
    items-center
    mb-10
    ">

      <div>

        <h1 className="
        text-5xl
        font-bold
        text-white
        ">

          Smart Lab

        </h1>

        <p className="
        text-slate-400
        mt-2
        text-lg
        ">

          Real-Time Monitoring Platform

        </p>

      </div>

      <div className="
      flex
      items-center
      gap-4
      ">

        <div className="
        text-right
        ">

          <h2 className="
          font-semibold
          ">

            {username}

          </h2>

          <p className="
          text-sm
          text-slate-400
          ">

            Administrator

          </p>

        </div>

        <div className="
        w-12
        h-12
        rounded-full
        bg-cyan-500
        flex
        items-center
        justify-center
        font-bold
        text-black
        ">

          {username?.charAt(0)}

        </div>

      </div>

    </div>

  );

}

export default Header;