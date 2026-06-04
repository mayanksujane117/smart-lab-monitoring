import { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Lab Assistant");

  const handleLogin = async (e) => {

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

      localStorage.setItem(
        "role",
        response.data.user.role
      );

      localStorage.setItem(
        "username",
        response.data.user.username
      );

      if (
        response.data.user.role !== role
      ) {

        alert(
          "Selected role does not match account role"
        );

        return;

      }

      if (
  response.data.user.role === "Admin"
) {

  window.location.href =
  "/admin";

}

else {

  window.location.href =
  "/assistant";

}

    }

    catch (error) {

      alert(
        error?.response?.data?.message ||
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
      px-4
    ">

      <form

        onSubmit={handleLogin}

        className="
          bg-[#081028]
          border
          border-slate-800
          p-10
          rounded-3xl
          w-full
          max-w-md
          shadow-2xl
        "

      >

        <h1 className="
          text-4xl
          text-white
          font-bold
          text-center
          mb-2
        ">

          Smart Lab

        </h1>

        <p className="
          text-center
          text-gray-400
          mb-8
        ">

          Monitoring System

        </p>

        {/* ROLE */}

        <label className="
          text-gray-300
          block
          mb-2
        ">
          Login As
        </label>

        <select

          value={role}

          onChange={(e) =>
            setRole(e.target.value)
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

        >

          <option>
            Admin
          </option>

          <option>
            Lab Assistant
          </option>

        </select>

        {/* USERNAME */}

        <input

          type="text"

          placeholder="Username"

          value={username}

          onChange={(e) =>
            setUsername(e.target.value)
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

        {/* PASSWORD */}

        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(e.target.value)
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
            transition
          "

        >

          Login

        </button>

        <p className="
          text-center
          text-gray-500
          mt-6
        ">

          Smart Lab Monitoring System

        </p>

      </form>

    </div>

  );

}

export default Login;