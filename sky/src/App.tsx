// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import PostForm from "./components/Form/PostForm";
import "./App.css";
import Register from "./components/User/Resister";

function App() {

  return (
    <main className="container">
      <h1>Tauri-Sky</h1>
      <Register />
      <PostForm />
    </main>
  );
}

export default App;
