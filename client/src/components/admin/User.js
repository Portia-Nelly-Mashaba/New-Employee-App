import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    fetch('http://localhost:8001/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  // Grant admin access
  const grantAdminAccess = (id) => {
    fetch(`http://localhost:8001/grant-admin/${id}`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to grant admin access.');
        alert('Admin access granted!');
      })
      .catch((error) => alert('Error:', error.message));
  };

  // Revoke admin access
  const revokeAdminAccess = (id) => {
    fetch(`http://localhost:8001/revoke-admin/${id}`, { method: 'POST' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to revoke admin access.');
        alert('Admin access revoked!');
      })
      .catch((error) => alert('Error:', error.message));
  };

  // Render users
  return (
    <div className="container mt-5">
      <div style={{ textAlign: 'right' }}>
        <Link to="/add-user" className="btn btn-info mb-3" style={{ color: 'white' }}>
          Add User
        </Link>
      </div>
      <table className="table table-bordered" style={{ tableLayout: 'fixed' }}>
        <thead className="table-dark">
          <tr>
            <th scope="col" style={{ width: '5%' }}>#</th>
            <th scope="col">Full Name</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id || index}>
                <th scope="row">{index + 1}</th>
                <td>{user.firstname} {user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className="d-flex justify-content-center">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => grantAdminAccess(user.id)}
                  >
                    Grant Admin
                  </button>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => revokeAdminAccess(user.id)}
                  >
                    Revoke Admin
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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
