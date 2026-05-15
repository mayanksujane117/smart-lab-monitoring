import {

  useState,

} from "react";

import axios from "axios";

function Register() {

  const [username,
  setUsername] =
  useState("");

  const [password,
  setPassword] =
  useState("");

  const [confirmPassword,
  setConfirmPassword] =
  useState("");

  const handleRegister =
  async (e) => {

    e.preventDefault();

    try {

      await axios.post(

        "https://smart-lab-monitoring.onrender.com/api/register",

        {

          username,

          password,

          confirmPassword,

        }

      );

      alert(
        "Registered Successfully "
      );

      window.location.href =
      "/login";

    }

    catch (error) {

      alert(

        error.response.data.message

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
          handleRegister
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

          Register

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
          mb-4
          bg-slate-900
          text-white
          outline-none
          "

        />

        <input

          type="password"

          placeholder="Confirm Password"

          value={confirmPassword}

          onChange={(e) =>
            setConfirmPassword(
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

          Register

        </button>

      </form>

    </div>

  );

}

export default Register;