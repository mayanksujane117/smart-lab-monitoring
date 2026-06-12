import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

function SuperAdmin() {

  const navigate =
    useNavigate();

    const [stats, setStats] =
  useState({

    totalOrganizations: 0,

    totalAdmins: 0,

    totalLabs: 0,

    totalPCs: 0,

  });

const [
  organizations,
  setOrganizations
] = useState([]);

const [
  selectedOrg,
  setSelectedOrg
] = useState(null);

const [
  showPasswordModal,
  setShowPasswordModal
] = useState(false);

const [
  resetUsername,
  setResetUsername
] = useState("");

const [
  newPassword,
  setNewPassword
] = useState("");

const [
  showCreateModal,
  setShowCreateModal
] = useState(false);

const [orgName,
  setOrgName] =
  useState("");

const [orgCode,
  setOrgCode] =
  useState("");

const [adminName,
  setAdminName] =
  useState("");

const [adminUsername,
  setAdminUsername] =
  useState("");

const [adminPassword,
  setAdminPassword] =
  useState("");

const [plan,
  setPlan] =
  useState("Free");

  const logout = () => {

    localStorage.clear();

    navigate("/login");

  };

  const createOrganization =
async () => {

  try {

    await axios.post(

      "https://smart-lab-monitoring.onrender.com/api/organizations",

      {

        name:
          orgName,

        code:
          orgCode,

        adminName,

        adminUsername,

        adminPassword,

        plan,

      }

    );

    alert(
      "Organization Created"
    );

    setShowCreateModal(
      false
    );

    fetchOrganizations();

    fetchStats();

  }

  catch (error) {

    console.log(error);

    alert(

      error.response?.data?.message ||

      "Failed"

    );

  }

};

const toggleOrganization =
async (id) => {

  try {

    await axios.put(

      `https://smart-lab-monitoring.onrender.com/api/super-admin/organization/${id}/status`

    );

    fetchOrganizations();

  }

  catch (error) {

    console.log(error);

    alert("Failed");

  }

};

const resetAdminPassword =
async () => {

  try {

    await axios.put(

      "https://smart-lab-monitoring.onrender.com/api/super-admin/reset-password",

      {

        username:
          resetUsername,

        newPassword,

      }

    );

    alert(
      "Password Reset Successfully"
    );

    setShowPasswordModal(
      false
    );

    setNewPassword("");

  }

  catch (error) {

    console.log(error);

    alert(
      "Failed"
    );

  }

};

const deleteOrganization =
async (id) => {

   

  const confirmDelete =
    window.confirm(
      "Delete Organization?"
    );

  if (!confirmDelete)
    return;

  try {

    await axios.delete(

      `https://smart-lab-monitoring.onrender.com/api/super-admin/organization/${id}`

    );

    fetchOrganizations();

    fetchStats();

  }

  catch (error) {

    console.log(error);

  }

};


  const fetchStats =
async () => {

    

  try {

    const response =
      await axios.get(

        "https://smart-lab-monitoring.onrender.com/api/super-admin/stats"

      );

    setStats(
      response.data
    );

  }

  catch (error) {

    console.log(error);

  }

};

const fetchOrganizations =
async () => {

   

  try {

    const response =
      await axios.get(

        "https://smart-lab-monitoring.onrender.com/api/super-admin/organizations"

      );

    setOrganizations(
      response.data
    );

  }

  catch (error) {

    console.log(error);

  }

};

useEffect(() => {

  fetchStats();

  fetchOrganizations();

}, []);

  return (

    <>

{showCreateModal && (

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
bg-[#0B1220]
p-8
rounded-3xl
w-[500px]
">

<h2 className="
text-3xl
font-bold
mb-6
">

Create Organization

</h2>

<input
placeholder="Organization Name"
value={orgName}
onChange={(e)=>
setOrgName(
e.target.value
)}
className="
w-full
p-4
rounded-xl
bg-slate-900
mb-4
"
/>

<input
placeholder="Organization Code"
value={orgCode}
onChange={(e)=>
setOrgCode(
e.target.value
)}
className="
w-full
p-4
rounded-xl
bg-slate-900
mb-4
"
/>

<input
placeholder="Admin Name"
value={adminName}
onChange={(e)=>
setAdminName(
e.target.value
)}
className="
w-full
p-4
rounded-xl
bg-slate-900
mb-4
"
/>

<input
placeholder="Admin Username"
value={adminUsername}
onChange={(e)=>
setAdminUsername(
e.target.value
)}
className="
w-full
p-4
rounded-xl
bg-slate-900
mb-4
"
/>

<input
placeholder="Admin Password"
value={adminPassword}
onChange={(e)=>
setAdminPassword(
e.target.value
)}
className="
w-full
p-4
rounded-xl
bg-slate-900
mb-4
"
/>

<select

value={plan}

onChange={(e)=>
setPlan(
e.target.value
)}

className="
w-full
p-4
rounded-xl
bg-slate-900
mb-6
"

>

<option>
Free
</option>

<option>
Basic
</option>

<option>
Premium
</option>

</select>

<div className="
flex
gap-3
">

<button

onClick={
createOrganization
}

className="
flex-1
bg-cyan-600
py-3
rounded-xl
"

>

Create

</button>

<button

onClick={()=>
setShowCreateModal(
false
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



    <div className="min-h-screen bg-[#050816] text-white">

      {/* TOP BAR */}

      <div className="border-b border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-bold">

              Super Admin

            </h1>

            <p className="text-slate-400 mt-1">

              Smart Lab Monitoring SaaS

            </p>

          </div>

          <button

            onClick={logout}

            className="
            bg-red-600
            hover:bg-red-700
            px-5
            py-3
            rounded-xl
            font-semibold
            "

          >

            Logout

          </button>

        </div>

      </div>

      {/* MAIN */}

      <div className="max-w-7xl mx-auto p-8">

        {/* HERO */}

        <div className="
        rounded-3xl
        bg-gradient-to-r
        from-cyan-600
        to-blue-700
        p-10
        mb-10
        ">

          <h2 className="
          text-5xl
          font-bold
          mb-3
          ">

            Multi College SaaS Control Panel

          </h2>

          <p className="
          text-cyan-100
          text-xl
          ">

            Manage Organizations, Admins,
            Labs and PCs from one place.

          </p>

        </div>

        {/* STATS */}

        <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4
        gap-6
        mb-10
        ">

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              Organizations

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

            {stats.totalOrganizations}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              Users

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

              {stats.totalAdmins}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              Labs

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

              {stats.totalLabs}

            </h2>

          </div>

          <div className="
          bg-[#0B1220]
          border
          border-slate-800
          rounded-3xl
          p-6
          ">

            <p className="text-slate-400">

              PCs

            </p>

            <h2 className="
            text-5xl
            font-bold
            mt-3
            ">

              {stats.totalPCs}

            </h2>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="
        flex
        flex-wrap
        gap-4
        mb-10
        ">

          <button

  onClick={() =>
    setShowCreateModal(
      true
    )
  }

  className="
  bg-cyan-600
  hover:bg-cyan-700
  px-6
  py-3
  rounded-2xl
  font-semibold
  "

>

  + Create Organization

</button>

          <button

            className="
            bg-slate-800
            hover:bg-slate-700
            px-6
            py-3
            rounded-2xl
            font-semibold
            "

          >

            + Create Admin

          </button>

        </div>

        {/* ORGANIZATION TABLE */}

        <div className="
        bg-[#0B1220]
        border
        border-slate-800
        rounded-3xl
        overflow-hidden
        ">

          <div className="
          px-6
          py-5
          border-b
          border-slate-800
          ">

            <h2 className="
            text-2xl
            font-bold
            ">

              Organizations

            </h2>

          </div>

          <div className="overflow-x-auto">

  <table className="w-full">

    <thead>

      <tr className="border-b border-slate-800">

        <th className="text-left p-4">
          Organization
        </th>

        <th className="text-left p-4">
          Code
        </th>

        <th className="text-left p-4">
          Plan
        </th>

        <th className="text-left p-4">
          Status
        </th>

        <th className="text-left p-4">
          Created
        </th>

        <th className="text-left p-4">
  Actions
</th>

      </tr>

    </thead>

    <tbody>

      {organizations.map((org) => (

        <tr
          key={org._id}
          className="
          border-b
          border-slate-800
          hover:bg-slate-900
          "
        >

            

          <td className="p-4">

            {org.name}

          </td>

          <td className="p-4">

            {org.code}

          </td>

          <td className="p-4">

            {org.plan || "Free"}

          </td>

          

          <td className="p-4">

            <span
              className={
                org.status ===
                "Active"

                  ? "text-green-400"

                  : "text-red-400"
              }
            >

              {org.status}

            </span>

          </td>

          <td className="p-4">

            {new Date(
              org.createdAt
            ).toLocaleDateString()}

          </td>

        <td className="p-4">

  <div className="
  flex
  gap-2
  ">

    <button

  onClick={() =>
    setSelectedOrg(org)
  }

  className="
  bg-cyan-600
  hover:bg-cyan-700
  px-4
  py-2
  rounded-xl
  text-sm
  mr-2
  "

>

  View

</button>

    <button
  onClick={() =>
    toggleOrganization(org._id)
  }
  className={`
    px-4
    py-2
    rounded-xl
    text-sm
    font-semibold
    ${
      org.status === "Active"
        ? "bg-green-600 hover:bg-green-700"
        : "bg-yellow-500 hover:bg-yellow-600 text-black"
    }
  `}
>
  {
    org.status === "Active"
      ? "Enabled"
      : "Disabled"
  }
</button>

<button

  onClick={() => {

    setResetUsername(
      org.adminUsername
    );

    setShowPasswordModal(
      true
    );

  }}

  className="
  bg-purple-600
  hover:bg-purple-700
  px-3
  py-2
  rounded-lg
  text-sm
  "

>

  Reset Password

</button>

    <button

      onClick={() =>
        deleteOrganization(
          org._id
        )
      }

      className="
      bg-red-600
      px-3
      py-2
      rounded-lg
      text-sm
      "

    >

      Delete

    </button>

  </div>

</td>

        </tr>

      ))}

    </tbody>

  </table>

</div>

        </div>

        {
  showPasswordModal && (

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
      bg-[#0B1220]
      p-8
      rounded-3xl
      w-[450px]
      ">

        <h2 className="
        text-3xl
        font-bold
        mb-6
        ">

          Reset Password

        </h2>

        <input

          value={
            resetUsername
          }

          disabled

          className="
          w-full
          p-4
          rounded-xl
          bg-slate-800
          mb-4
          "

        />

        <input

          type="password"

          placeholder="New Password"

          value={
            newPassword
          }

          onChange={(e)=>

            setNewPassword(
              e.target.value
            )

          }

          className="
          w-full
          p-4
          rounded-xl
          bg-slate-900
          mb-6
          "

        />

        <div className="
        flex
        gap-3
        ">

          <button

            onClick={
              resetAdminPassword
            }

            className="
            flex-1
            bg-purple-600
            py-3
            rounded-xl
            "

          >

            Save

          </button>

          <button

            onClick={() =>

              setShowPasswordModal(
                false
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

  )
}

        {
  selectedOrg && (

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
      bg-[#0B1220]
      w-[700px]
      rounded-3xl
      p-8
      border
      border-slate-800
      ">

        <div className="
        flex
        justify-between
        mb-6
        ">

          <h2 className="
          text-3xl
          font-bold
          ">

            Organization Details

          </h2>

          <button

            onClick={() =>
              setSelectedOrg(null)
            }

            className="
            text-red-400
            text-xl
            "

          >

            ✕

          </button>

        </div>

        <div className="
        grid
        grid-cols-2
        gap-6
        ">

          <div>
            <p className="text-slate-400">
              Organization
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.name}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">
              Code
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.code}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">
              Admin
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.adminName}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">
              Username
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.adminUsername}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">
              Plan
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.plan}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">
              Status
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.status}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">
              Labs
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.totalLabs}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">
              PCs
            </p>
            <h3 className="text-xl font-bold">
              {selectedOrg.totalPCs}
            </h3>
          </div>

        </div>

      </div>

    </div>

  )
}

      </div>

    </div>
      </>
  );

}

export default SuperAdmin;