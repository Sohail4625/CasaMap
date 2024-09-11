import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleImage from "./Google-Symbol.png" 
const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [res, setRes] = useState(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, email, username }),
      });
      if (response.ok) {
        const resjson = await response.json();
        setRes(resjson.message);
        navigate("/");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const handleGoogle = async (event) => {
    window.location.href = "/auth/google";
  }
  return (
    <form className="" onSubmit={handleSubmit}>
      <label className="mx-2">
        Name:{" "}
        <input
        className="mt-16 lg:mt-14 border-2 border-black rounded-lg"
        required
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <br />
      <label className="mx-2">
        Username:{" "}
        <input
        className="border-2 mt-1 border-black rounded-lg"
        required
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </label>
      <br />
      <label className="mx-2">
        Password:{" "}
        <input
        className="border-2 mt-1 border-black rounded-lg"
        required
          type="password" // Use password type to hide the input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <br />
      <label className="mx-2">
        Email:{" "}
        <input
        className="border-2 mt-1 border-black rounded-lg"
          required
          type="email" // Use email type for validation
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <br />
      <button className="mx-2 mt-1 bg-green-500 hover:bg-green-600 text-white rounded-lg p-1" type="submit">Register</button>
    <div className="border-2 mt-1 border-slate-500 p-1 mx-2 flex-row rounded-lg w-48 flex justify-center"><img className="w-10 h-6" src={GoogleImage}></img><button onClick={handleGoogle}>Login with Google</button></div>
      <div>{res}</div>
    </form>
  );
};

export default Register;
