import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import saveimage from "./OIP.jpeg"
import DeleteImage from "./DeleteImage.jpeg"
const Profile = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwtToken");
    const [username,setUsername] = useState(null);
    const [name,setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [saved, setSaved] = useState(null);
    const [listed, setListed] = useState(null);
    useEffect(() => {
        async function FetchProfile(){
            const response = await fetch("/api/profile",{
                headers: {
                    Authorization: `bearer ${token}`
                }
            });
            const respjson = await response.json();
            console.log(respjson.message)
            setUsername(respjson.message.username)
            setName(respjson.message.name)
            setEmail(respjson.message.email)
            setSaved(respjson.message.saved)
            setListed(respjson.message.listed)
        }
        FetchProfile();
    },[saved,listed])
    const [fvisible, setFvisible] = useState(true);
    const toggle = () => {
        setFvisible(!fvisible);
    }
    const unsaveItem = async (id) => {
        const response = await fetch(`/api/unsave/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(response);
        const respjson = await response.json();
        console.log(respjson);
        navigate("/profile")
    }
    const delItem = async (id) => {
        const response = await fetch(`/api/housedel/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const respjson = await response.json();
        console.log(respjson.message);
        navigate("/profile")
    }
    const logout = () => {
        localStorage.removeItem("jwtToken");
        navigate("/")
    }
    return(
        <div className="mx-2">
            <p>.</p>
            <p className="mt-8"><span className="font-semibold">UserID:</span> {username}</p>
            <p><span className="font-semibold">Name:</span> {name}</p>
            <p><span className="font-semibold">Email:</span> {email}</p>
            <button className="bg-green-500 hover:bg-green-600 rounded-lg p-1 text-white mt-1" onClick={logout}>Logout</button>
            <br></br>
            <button className=" rounded-lg p-1 mt-1" onClick={toggle}>{fvisible? <p className="bg-gray-200 p-1 rounded-lg">Saved</p>: <p className="p-1">Saved</p>}</button>
            <button className=" rounded-lg p-1 mt-1" onClick={toggle}>{fvisible? <p className="p-1">Listed</p>: <p className="bg-gray-200 p-1 rounded-lg">Listed</p>}</button>
            <hr></hr>
            {fvisible? (
                saved && saved.map(item => {
                    return (
                        <div className="flex-row rounded-lg mt-1 hover:translate-y-[-1px] hover:translate-x-[-1px] hover:scale-103  flex justify-between p-2 space-x-10 space-y-1 shadow-md w-1/2">
                        <p><a className="cursor-pointer" onClick={() => navigate(`/house/${item.house_id}`)}>{item.houseName}</a></p>
                        <button className="cursor-pointer" onClick={() => unsaveItem(item.house_id)}><img className="w-8" src={saveimage}></img></button>
                        </div>
                    )
                })
            ): (
                listed && listed.map(item => {
                    return (
                        <div className="flex-row mt-1 rounded-lg hover:translate-y-[-1px] hover:translate-x-[-1px] hover:scale-103 flex justify-between p-2 space-x-10 space-y-1 shadow-md w-1/2">
                       <p><a className="cursor-pointer" onClick={() => navigate(`/house/${item.house_id}`)}>{item.houseName}</a></p>
                        <button onClick={() => delItem(item.house_id)}><img className="w-8" src={DeleteImage}></img></button>
                        </div>
                    )
                })
            )}
        </div>
    )
}
export default Profile;