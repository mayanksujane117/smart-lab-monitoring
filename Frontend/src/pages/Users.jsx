import { useState } from "react";

function Users() {

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Lab Assistant");

  const createUser = () => {

    console.log({
      username,
      password,
      role,
    });

  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        User Management
      </h1>

      <div className="bg-slate-900 p-6 rounded-xl">

        <input
          placeholder="Username"
          className="w-full p-3 mb-4 rounded bg-slate-800"
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-3 mb-4 rounded bg-slate-800"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <select
          className="w-full p-3 mb-4 rounded bg-slate-800"
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <option>
            Lab Assistant
          </option>

          <option>
            Admin
          </option>

        </select>

        <button
          onClick={createUser}
          className="bg-blue-600 px-6 py-3 rounded"
        >
          Create User
        </button>

      </div>

    </div>
  );
}

export default Users;