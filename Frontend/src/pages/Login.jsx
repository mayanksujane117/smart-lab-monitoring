import {

  useState,

} from "react";

import axios from "axios";

function Login() {

  const [username,
  setUsername] =
  useState("");

  const [password,
  setPassword] =
  useState("");

  const handleLogin =
  async (e) => {

    e.preventDefault();

    try {

      const response =
      await axios.post(

        "https://smart-lab-monitoring.onrender.com/api/login",

        {

          username,

          password,

        }

      );

      localStorage.setItem(

        "token",

        response.data.token

      );

      window.location.href =
      "/";

    }

    catch (error) {

      alert(
        "Login Failed ❌"
      );

    }

  };

  return (

    <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-slate-950
    ">

      <form

        onSubmit={
          handleLogin
        }

        className="
        bg-[#081028]
        p-10
        rounded-3xl
        w-[400px]
        "

      >

        <h1 className="
        text-4xl
        text-white
        font-bold
        mb-8
        text-center
        ">

          Admin Login

        </h1>

        <input

          type="text"

          placeholder="Username"

          value={username}

          onChange={(e) =>
            setUsername(
              e.target.value
            )
          }

          className="
          w-full
          p-4
          rounded-xl
          mb-4
          bg-slate-900
          text-white
          outline-none
          "

        />

        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          className="
          w-full
          p-4
          rounded-xl
          mb-6
          bg-slate-900
          text-white
          outline-none
          "

        />

        <button

          className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          p-4
          rounded-xl
          text-white
          font-bold
          "

        >

          Login

        </button>
        <p className="
text-center
text-gray-400
mt-6
">

  Don't have an account?

  <span

    onClick={() =>
      window.location.href =
      "/register"
    }

    className="
    text-blue-400
    ml-2
    cursor-pointer
    hover:underline
    "

  >

    Register

  </span>

</p>

      </form>

    </div>

  );

}

export default Login;