import { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

    const [
  loading,
  setLoading
] = useState(false);
  const [role, setRole] = useState("Super Admin");
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

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

        console.log("FULL RESPONSE");
console.log(response.data);

console.log("USER DATA");
console.log(user);

console.log("ORG ID");
console.log(user.organizationId);

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

      localStorage.setItem(
  "organizationId",
  user.organizationId
);



console.log(
  "ORG ID:",
  user.organizationId
);

      // Check Selected Role

      if (
        user.role !== role
      ) {

        localStorage.clear();

        alert(
          `This account is ${user.role}. Please select correct role.`
        );
setLoading(false);
        return;

      }

      setLoading(false);

      // Redirect

      if (
  user.role ===
  "Super Admin"
) {

  window.location.href =
    "/super-admin";

}

else if (
  user.role ===
  "Admin"
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

      setLoading(false);

      console.log(error);

      alert(

        error?.response?.data?.message ||

        "Login Failed"

      );

    }

  };

  if (loading) {

  return (

    <div className="
    min-h-screen
    bg-gradient-to-br
from-slate-50
via-cyan-50
to-blue-100
    flex
    items-center
    justify-center
    px-6
    ">

      <div className="
      bg-white
      border
      border-slate-200
      rounded-3xl
      shadow-2xl
      p-12
      w-full
      max-w-md
      text-center
      ">

        <div className="
        w-16
        h-16
        mx-auto
        border-4
        border-cyan-600
        border-t-transparent
        rounded-full
        animate-spin
        " />

        <h1 className="
        text-3xl
        font-bold
        text-slate-900
        mt-6
        ">

          Smart Lab

        </h1>

        <p className="
        text-slate-500
        mt-2
        ">

          Monitoring System

        </p>

        <div className="
        mt-6
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-full
        bg-cyan-50
        text-cyan-700
        text-sm
        font-medium
        ">

          <span className="
          w-2
          h-2
          bg-cyan-600
          rounded-full
          animate-pulse
          " />

          Logging In...

        </div>

      </div>

    </div>

  );

}

  return (

  <div className="
  min-h-screen
  bg-gradient-to-br
from-slate-50
via-cyan-50
to-blue-100
  flex
  items-center
  justify-center
  px-6
  ">

    <div className="
    w-full
    max-w-6xl
    grid
    lg:grid-cols-2
    gap-12
    items-center
    ">

      {/* Left Side */}

      <div className="hidden lg:block">

        <span className="
        px-4
        py-2
        rounded-full
        bg-cyan-100
        text-cyan-700
        text-sm
        font-medium
        ">

          Smart Lab Monitoring SaaS
        </span>

        <h1 className="
        text-6xl
        font-bold
        text-slate-900
        mt-6
        leading-tight
        ">

          The intelligent way to

          <span className="
          text-cyan-600
          block
          ">

            monitor your labs

          </span>

        </h1>

        <p className="
        text-slate-500
        text-lg
        mt-6
        max-w-xl
        ">

          Real-time monitoring,
          inventory management,
          analytics and multi-college
          administration from a
          single platform.

        </p>


      </div>

      {/* Right Side Login */}

      <div className="
      bg-white
      border
      border-slate-200
      rounded-3xl
      shadow-xl
      p-10
      w-full
      max-w-md
      mx-auto
      ">

        <div className="text-center">

          <div className="
          w-18
          h-14
          rounded-2xl
          bg-cyan-600
          text-white
          flex
          items-center
          justify-center
          mx-auto
          text-2xl
          font-bold
          ">

            SLMS

          </div>

          <h1 className="
          text-4xl
          font-bold
          text-slate-900
          mt-4
          ">

            Welcome Back

          </h1>

          <p className="
          text-slate-500
          mt-2
          ">

            Sign in to continue

          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="mt-8"
        >

          <label className="
          text-slate-700
          font-medium
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
            mt-2
            p-4
            rounded-xl
            border
            border-slate-300
            bg-white
            "

          >

            <option value="Super Admin">
              Super Admin
            </option>

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
            mt-4
            p-4
            rounded-xl
            border
            border-slate-300
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
            mt-4
            p-4
            rounded-xl
            border
            border-slate-300
            "

          />

          <button

            type="submit"

            disabled={loading}

            className="
            w-full
            mt-6
            bg-cyan-600
            hover:bg-cyan-700
            text-white
            py-4
            rounded-xl
            font-semibold
            transition
            "

          >

            {loading
              ? "Logging In..."
              : "Login"}

          </button>

        </form>

      </div>

    </div>

  </div>

);

}

export default Login;