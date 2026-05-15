import {

  useState,

} from "react";

import axios from "axios";

function ForgotPassword() {

  const [username,
  setUsername] =
  useState("");

  const [newPassword,
  setNewPassword] =
  useState("");

  const handleReset =
  async (e) => {

    e.preventDefault();

    try {

      await axios.post(

        "https://smart-lab-monitoring.onrender.com/api/forgot-password",

        {

          username,

          newPassword,

        }

      );

      alert(
        "Password Updated "
      );

      window.location.href =
      "/login";

    }

    catch (error) {

      alert(
        "Reset Failed ❌"
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
          handleReset
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

          Forgot Password

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

          placeholder="New Password"

          value={newPassword}

          onChange={(e) =>
            setNewPassword(
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
          bg-red-600
          hover:bg-red-700
          p-4
          rounded-xl
          text-white
          font-bold
          "

        >

          Reset Password

        </button>

      </form>

    </div>

  );

}

export default ForgotPassword;