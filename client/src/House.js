import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const House1 = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  useEffect(() => {
    async function get_house() {
      const response = await fetch(`/api/house/${id}`);
      const respjson = await response.json();
      console.log(respjson.message);
      setHouse(respjson.message);
    }
    get_house();
  }, [id]);
  function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const simpleDateFormat = dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return simpleDateFormat;
  }
  const saveHouse = async () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          houseName: house.houseName,
          house_id: house._id,
        }),
      });
      const respjson = await response.json();
      console.log(respjson.message);
      alert(respjson.message);
    } else {
      alert("Login to save the house");
    }
  };
  return (
    <div>
      {house && (
        <div>
          <p>.</p>
          <div className="mt-10 flex gap-4 h-48">
          {house.images.map((image, index) => (
        <img
        className="mb-4 rounded-lg shadow-md"
          key={index}
          src={`data:${image.contentType};base64,${image.data}`}
          alt="Property pic"
          style={{ width: '300px', height: 'auto' }}
        />
      ))}
      </div>
      <div className="mx-2">
          <p className=""><span className="font-semibold">Property Name:</span> {house.houseName}</p>
          <p><span className="font-semibold">Property Type:</span> {house.property_type}</p>
          <p>
          <span className="font-semibold">Address:</span> {house.address}, {house.city}, {house.state},{" "}
            {house.zipcode}
          </p>
          <p><span className="font-semibold">Bedrooms:</span> {house.bedrooms}</p>
          <p><span className="font-semibold">Bathrooms:</span> {house.bathrooms}</p>
          <p><span className="font-semibold">Square Footage:</span> {house.square_footage}</p>
          <p><span className="font-semibold">Price:</span> {house.price}</p>
          <p><span className="font-semibold">Seller:</span> {house.owner}</p>
          <p><span className="font-semibold">Ph no:</span>{house.Ph_no}</p>
          <p><span className="font-semibold">Date Listed:</span> {formatDate(house.DatePosted)}</p>
          <a className="text-blue-800 underline cursor-pointer" onClick={() => navigate(`/userHouses/${house.owner_id}`)}>More houses from {house.owner}</a>
          <br></br>
          <button className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-1 mt-2 w-28" onClick={saveHouse}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default House1;
