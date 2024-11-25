import React from "react";
import { useAuth } from "./AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user?.name || "User"}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Profile;
