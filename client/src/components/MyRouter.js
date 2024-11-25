import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Create from './Create';
import Employees from './Employees';
import Register from './Register';
import Edit from './Edit';
import User from './admin/User';
import CreateUser from './admin/CreateUser';



function MyRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="/home" element={<Home />}/>
            <Route path="/add" element={<Create />}/>
            <Route path="/edit/:id" element={<Edit />}/>
            <Route path="/users" element={<User />}/>
            <Route path="/add-user" element={<CreateUser />}/>
            <Route path="/list" element={<Employees />}/>
            <Route path="/register" element={<Register />}/>
        </Routes>
    );
}

export default MyRouter
