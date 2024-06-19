import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import TodoList from "./components/TodoList";

const App = () => {
  return (
    <>
      {/* <Router> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<TodoList />} />
      </Routes>
      {/* </Router> */}
      {/* <Login/> */}
    </>
  );
};

export default App;
