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

      const user =
        response.data.user;

      const token =
        response.data.token;

      // Save Data

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "role",
        user.role
      );

      localStorage.setItem(
        "username",
        user.username
      );

      localStorage.setItem(
        "assignedLabs",
        JSON.stringify(
          user.assignedLabs || []
        )
      );

      // Check Selected Role

      if (
        user.role !== role
      ) {

        localStorage.clear();

        alert(
          `This account is ${user.role}. Please select correct role.`
        );

        return;

      }

      // Redirect

      if (
        user.role === "Admin"
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

      console.log(error);

      alert(

        error?.response?.data?.message ||

        "Login Failed"

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
            setRole(
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

        >

          <option value="Admin">
            Admin
          </option>

          <option value="Lab Assistant">
            Lab Assistant
          </option>

        </select>

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

          type="submit"

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