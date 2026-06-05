import { useEffect, useState } from "react";
import axios from "axios";

function Users() {

  const [users, setUsers] =
    useState([]);

  const [newUsername,
    setNewUsername] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  // ==========================
  // FETCH USERS
  // ==========================

  const fetchUsers =
    async () => {

      try {

        const response =
          await axios.get(
            "https://smart-lab-monitoring.onrender.com/api/users"
          );

        setUsers(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  useEffect(() => {

    fetchUsers();

  }, []);

  // ==========================
  // ADD USER
  // ==========================

  const addUser =
    async () => {

      if (
        !newUsername ||
        !newPassword
      ) {

        alert(
          "Fill all fields"
        );

        return;

      }

      try {

        await axios.post(

          "https://smart-lab-monitoring.onrender.com/api/add-user",

          {

            username:
              newUsername,

            password:
              newPassword,

          }

        );

        setNewUsername("");
        setNewPassword("");

        fetchUsers();

        alert(
          "Lab In-charge Added Successfully"
        );

      }

      catch (error) {

        console.log(error);

        alert(
          error?.response?.data?.message ||
          "Failed To Add User"
        );

      }

    };

  // ==========================
  // DELETE USER
  // ==========================

  const deleteUser =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this user?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(

          `https://smart-lab-monitoring.onrender.com/api/users/${id}`

        );

        fetchUsers();

        alert(
          "User Deleted"
        );

      }

      catch (error) {

        console.log(error);

        alert(
          "Delete Failed"
        );

      }

    };

  return (

    <div className="
      min-h-screen
      bg-slate-950
      text-white
      p-6
    ">

      <div className="
        max-w-6xl
        mx-auto
      ">

        {/* HEADER */}

        <div className="
          flex
          justify-between
          items-center
          mb-8
        ">

          <h1 className="
            text-4xl
            font-bold
          ">

            User Management

          </h1>

          <button

            onClick={() =>
              window.location.href =
              "/admin"
            }

            className="
              bg-slate-700
              hover:bg-slate-800
              px-5
              py-3
              rounded-xl
            "

          >

            Back

          </button>

        </div>

        {/* ADD USER */}

        <div className="
          bg-slate-900
          p-6
          rounded-2xl
          mb-8
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">

            Add Lab In-charge

          </h2>

          <div className="
            grid
            md:grid-cols-3
            gap-4
          ">

            <input

              type="text"

              placeholder="Username"

              value={newUsername}

              onChange={(e) =>
                setNewUsername(
                  e.target.value
                )
              }

              className="
                bg-slate-800
                p-4
                rounded-xl
                outline-none
              "

            />

            <input

              type="password"

              placeholder="Password"

              value={newPassword}

              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }

              className="
                bg-slate-800
                p-4
                rounded-xl
                outline-none
              "

            />

            <button

              onClick={addUser}

              className="
                bg-green-600
                hover:bg-green-700
                rounded-xl
                font-bold
              "

            >

              Add User

            </button>

          </div>

        </div>

        {/* USERS TABLE */}

        <div className="
          bg-slate-900
          rounded-2xl
          p-6
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">

            Lab In-charges

          </h2>

          <table className="
            w-full
            text-left
          ">

            <thead>

              <tr className="
                border-b
                border-slate-700
              ">

                <th className="
                  pb-4
                ">
                  Username
                </th>

                <th className="
                  pb-4
                ">
                  Role
                </th>

                <th className="
                  pb-4
                ">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {users.map(
                (user) => (

                  <tr

                    key={user._id}

                    className="
                      border-b
                      border-slate-800
                    "

                  >

                    <td className="
                      py-4
                    ">

                      {user.username}

                    </td>

                    <td>

                      {user.role}

                    </td>

                    <td>

                      <button

                        onClick={() =>
                          deleteUser(
                            user._id
                          )
                        }

                        className="
                          bg-red-600
                          hover:bg-red-700
                          px-4
                          py-2
                          rounded-lg
                        "

                      >

                        Delete

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Users;