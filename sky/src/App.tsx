// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import PostForm from "./components/PostForm";
import "./App.css";

function App() {

  return (
    <main className="container">
      <h1>Welcome to Tauri-Sky</h1>
      <PostForm />
    </main>
  );
}

export default App;
