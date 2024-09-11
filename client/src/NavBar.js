import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "./usericon.jpg"
const NavBar = () => {
    const [topleft, setTopleft] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("jwtToken");
    const handleProfile = () => {
        navigate("/profile");
    }
    useEffect(()=>{
        if(!token){
            setTopleft(<button className=" h-10 w-16 lg:h-full border-0 bg-blue-500 hover:bg-blue-600 text-white border-black rounded-lg p-1 px-3" onClick={() => navigate("/login")}>Login</button>)
        }
        else {
            setTopleft(<a className="cursor-pointer" onClick={handleProfile}><img className="w-8 rounded-full" src={ProfileIcon}></img></a>)
        }
    },[token,navigate]);
    const handleAdd = () => {
        const token = localStorage.getItem("jwtToken");
        if(token){
            navigate("/addProperty");
        }
        else {
            alert("Login to add properties");
        }
    }
  return (
    <div>
    <div className="flex justify-between fixed w-full items-center bg-green-900 p-2">
      <a onClick={() => navigate("/")} className="text-white cursor-pointer font-lobster text-xl lg:ml-3">CasaMap</a>
      <div className="space-x-1 lg:space-x-10 flex flex-row">
      <button className="border-0 bg-blue-500 hover:bg-blue-600 text-white border-black rounded-lg p-1 px-3" onClick={handleAdd}>+ Add Property</button>
      {topleft}
      </div>
    </div>
    </div>
  );
};
export default NavBar;
