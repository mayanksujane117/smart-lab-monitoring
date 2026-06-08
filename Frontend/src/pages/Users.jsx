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

const [role,
  setRole] =
  useState(
    "Lab Assistant"
  );

const [assignedLabs,
  setAssignedLabs] =
  useState([]);

const [labs,
  setLabs] =
  useState([]);

  const [editingUser,
  setEditingUser] =
  useState(null);

const [editRole,
  setEditRole] =
  useState("");

const [editLabs,
  setEditLabs] =
  useState([]);

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

        console.log(
          response.data
      );

        setUsers(
          response.data
        );

      }

      catch (error) {

        console.log(error);

      }

    };

  const fetchLabs = async () => {

    try {

      const response = await axios.get(
        "https://smart-lab-monitoring.onrender.com/api/labs"
      );

      setLabs(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    const init = async () => {
      await fetchUsers();
      await fetchLabs();
    };

    init();

  }, []);

  // ==========================
  // ADD USER
  // ==========================

  const addUser =
    async () => {

      if (!newUsername || !newPassword) {
        alert("Fill all fields");
        return;
      }

      try {
        await axios.post(
          "https://smart-lab-monitoring.onrender.com/api/add-user",
          {
            username: newUsername,
            password: newPassword,
            role,
            assignedLabs,
          }
        );

        setNewUsername("");
        setNewPassword("");
        setRole("Lab Assistant");
        setAssignedLabs([]);

        fetchUsers();
        alert("User Added Successfully");
      } catch (error) {
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

      const openEditModal =
  (user) => {

    setEditingUser(
      user
    );

    setEditRole(
      user.role
    );

    setEditLabs(
      user.assignedLabs || []
    );

  };

const saveUser =
  async () => {

    try {

      await axios.put(

        `https://smart-lab-monitoring.onrender.com/api/users/${editingUser._id}`,

        {

          role:
            editRole,

          assignedLabs:
            editLabs,

        }

      );

      fetchUsers();

      setEditingUser(
        null
      );

      alert(
        "User Updated"
      );

    }

    catch (error) {

      console.log(error);

      alert(
        "Update Failed"
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

            Add Lab Assistant

          </h2>

          <div className="
grid
md:grid-cols-2
lg:grid-cols-5
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

<select

  value={role}

  onChange={(e) =>
    setRole(
      e.target.value
    )
  }

  className="
  bg-slate-800
  p-4
  rounded-xl
  outline-none
  "

>

  <option value="Lab Assistant">
    Lab Assistant
  </option>

  <option value="Admin">
    Admin
  </option>

</select>

<div className="
col-span-2
lg:col-span-5
">

  <p className="
  mb-3
  font-semibold
  ">

    Assign Labs

  </p>

  <div className="
  grid
  grid-cols-2
  md:grid-cols-3
  gap-3
  ">

    {labs.map(
      (lab) => (

        <label

          key={lab._id}

          className="
          bg-slate-800
          p-3
          rounded-xl
          flex
          gap-2
          cursor-pointer
          "

        >

          <input

            type="checkbox"

            checked={assignedLabs.includes(
              lab.name
            )}

            onChange={(e) => {

              if (
                e.target.checked
              ) {

                setAssignedLabs([
                  ...assignedLabs,
                  lab.name
                ]);

              }

              else {

                setAssignedLabs(

                  assignedLabs.filter(
                    item =>
                      item !==
                      lab.name
                  )

                );

              }

            }}

          />

          {lab.name}

        </label>

      )
    )}

  </div>

</div>
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

            Lab Assistants

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
  Assigned Labs
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
                    <td className="py-4">
                      {user.username}
                    </td>

                    <td >
                      {user.role}
                    </td>

                    <td>
                      {user.assignedLabs?.join(", ") || "-"}
                    </td>

                    <td className="flex gap-2">

                    <button
                      onClick={() =>
                        openEditModal(user)
                      }

                      className="
                    bg-blue-600
                    hover:bg-blue-700
                      px-4
                      py-2
                      rounded-lg"

                    >
                    Edit

                    </button>

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

      {editingUser && (

<div className="
fixed
inset-0
bg-black/70
flex
items-center
justify-center
z-50
">

<div className="
bg-slate-900
p-8
rounded-3xl
w-[700px]
">

<h2 className="
text-3xl
font-bold
mb-6
">

Edit User

</h2>

<select

value={editRole}

onChange={(e) =>
setEditRole(
e.target.value
)
}

className="
w-full
bg-slate-800
p-4
rounded-xl
mb-6
"

>

<option>
Admin
</option>

<option>
Lab Assistant
</option>

</select>

<div className="
grid
grid-cols-2
md:grid-cols-3
gap-3
mb-6
">

{labs.map(
(lab) => (

<label

key={lab._id}

className="
bg-slate-800
p-3
rounded-xl
flex
gap-2
"

>

<input

type="checkbox"

checked={editLabs.includes(
lab.name
)}

onChange={(e) => {

if (
e.target.checked
) {

setEditLabs([
...editLabs,
lab.name
]);

}

else {

setEditLabs(

editLabs.filter(
item =>
item !==
lab.name
)

);

}

}}

 />

{lab.name}

</label>

)
)}

</div>

<div className="
flex
gap-3
">

<button

onClick={saveUser}

className="
flex-1
bg-green-600
py-3
rounded-xl
"

>

Save

</button>

<button

onClick={() =>
setEditingUser(
null
)
}

className="
flex-1
bg-slate-700
py-3
rounded-xl
"

>

Cancel

</button>

</div>

</div>

</div>

)}

    </div>

  );

}

export default Users;