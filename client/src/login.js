import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoogleImage from "./Google-Symbol.png"
const Login = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    const respond = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Specify JSON body
      body: JSON.stringify({ username, password }), // Stringify data
    });
    if (respond.ok) {
      const resjson = await respond.json();
      console.log(resjson.message);
      setResponse(resjson.message)
      navigate("/")
    }
  };
  const handleGoogle = async (event) => {
    window.location.href = "/auth/google";
  }
  return (
    <div className="space-y-2 border-0">
    <form className="" onSubmit={handleSubmit}>
      <label className="mx-2">
        Username:{" "}
        <input
        className="mt-20 lg:mt-14 border-2 border-black rounded-lg"
        required
          type="text"
          value={username}
          onChange={(event) => {
            setName(event.target.value);
          }}
        ></input>
      </label>
      <br></br>
      <label className="mx-2">
        Password:{" "}
        <input
        className="border-2 mt-1 border-black rounded-lg"
          required
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
      </label>
      <br></br>
      <button className="bg-green-500 mx-2 hover:bg-green-600 text-white p-1 w-64 mt-1 rounded-lg" type="submit">Login</button>
      {response && <div>{response}</div>}
    </form>
    <div className="border-2 border-slate-500 p-1 mx-2 flex-row rounded-lg w-64 flex justify-center"><img className="w-10 h-6" src={GoogleImage}></img><button onClick={handleGoogle}>Login with Google</button></div>
    <a className="text-blue-800 mx-2 underline cursor-pointer" onClick={() => navigate(`/register`)}>Create New Account</a>
    </div>
  );
};

export default Login;
