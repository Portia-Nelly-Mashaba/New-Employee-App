import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8001/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Grant Admin Access
  const grantAdminAccess = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/grant-admin/${id}`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to grant admin access.');
      console.log('Admin access granted!');
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Revoke Admin Access
  const revokeAdminAccess = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/revoke-admin/${id}`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to revoke admin access.');
      console.log('Admin access revoked!');
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 lg:p-8 xl:p-10 mt-2">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-title-md2 font-bold text-black">All Users</h2>
        </div>
        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8">
          <div className="align-middle rounded-tl-lg rounded-tr-lg inline-block w-full py-4 overflow-hidden bg-white shadow-lg px-12">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Email</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Role</th>
                  <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-blue-500 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                        <div className="flex space-x-3 mt-2">
                          {user.role !== 'admin' ? (
                            <button
                              className="px-2 py-1 border-blue-500 border text-blue-500 rounded transition duration-300 hover:bg-blue-700 hover:text-white focus:outline-none"
                              onClick={() => grantAdminAccess(user.id)}
                            >
                              Grant Admin
                            </button>
                          ) : (
                            <button
                              className="px-2 py-1 border-red-500 border text-red-500 rounded transition duration-300 hover:bg-red-700 hover:text-white focus:outline-none"
                              onClick={() => revokeAdminAccess(user.id)}
                            >
                              Revoke Admin
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center px-6 py-4 border-b border-gray-500">No users available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Users;


// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTrash } from "@fortawesome/free-solid-svg-icons";
// import { Link } from "react-router-dom";

// const Users = () => {
//   const [users, setUsers] = useState([]);

//   // Fetch users on component mount
//   useEffect(() => {
//     fetch("http://localhost:8001/users")
//       .then((res) => res.json())
//       .then((data) => {
//         setUsers(data); // Set fetched users to state
//       })
//       .catch((error) => console.error("Error fetching users:", error));
//   }, []);

//   // Delete a user by ID
//   const deleteUser = (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       fetch(`http://localhost:8001/delete-users/${id}`, {
//         method: "DELETE",
//       })
//         .then((res) => {
//           if (!res.ok) {
//             throw new Error("Failed to delete user.");
//           }
//           // Remove deleted user from state
//           setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
//           alert("User deleted successfully!");
//         })
//         .catch((error) => {
//           console.error("Error deleting user:", error);
//           alert("Failed to delete the user. Please try again.");
//         });
//     }
//   };

//   // Render the table with users
//   return (
//     <div className="container mt-5">
//       <div style={{ textAlign: "right" }}>
//         <Link to="/add-user" className="btn btn-info mb-3" style={{ color: "white" }}>
//           Add User
//         </Link>
//       </div>
//       <table className="table table-bordered" style={{ tableLayout: "fixed" }}>
//         <thead className="table-dark">
//           <tr>
//             <th scope="col" style={{ width: "5%" }}>#</th>
//             <th scope="col">Full Name</th>
//             <th scope="col">Email</th>
//             <th scope="col">Phone</th>
//             <th scope="col" >Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length > 0 ? (
//             users.map((user, index) => (
//               <tr key={user.id || index}>
//                 <th scope="row">{index + 1}</th>
//                 <td>{user.firstname}  {user.lastName}</td>
//                 <td>{user.email}</td>
//                 <td>{user.phone}</td>
//                 <td className="d-flex justify-content-center">
//                   {/* Edit button */}
//                   <button className="btn-outline btn-info me-2" >
//                     Admin Access
//                   </button>
//                   {/* Delete button */}
//                   <button
//                     className="btn btn-danger"
//                     onClick={() => deleteUser(user.id)}
//                   >
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center">
//                 No users found
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Users;
