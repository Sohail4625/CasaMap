import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const OwnerHouses = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [houses, setHouses] = useState(null);
  useEffect(() => {
    async function get_houses() {
      const response = await fetch(`/api/userHouses/${id}`);
      const respjson = await response.json();
      console.log(respjson.message)
      setHouses(respjson.message)
    }
    get_houses();
  }, []);
  if (houses) {
    var items = houses.map((q) => {
      return (
        <div className="border-0 border-black bg-white shadow-md p-2 pl-4 pt-3 hover:translate-y-[-5px] hover:translate-x-[-5px] hover:scale-103 rounded-xl">
            <p><span className="font-semibold">Property Name:</span> {q.houseName}</p>
            <p><span className="font-semibold">Property type:</span> {q.property_type}</p>
            <p>
              <span className="font-semibold">Address:</span> {q.address}, {q.city}, {q.state}, {q.zipcode}
            </p>
            <p><span className="font-semibold">Bedrooms:</span> {q.bedrooms}</p>
            <p><span className="font-semibold">Bathrooms:</span> {q.bathrooms}</p>
            <p><span className="font-semibold">Square Footage:</span> {q.square_footage}</p>
            <p><span className="font-semibold">Price:</span> {q.price}</p>
            <a onClick={() => navigate(`/house/${q._id}`)} className="text-blue-800 cursor-pointer underline">More Info</a>
          </div>
      );
    });
  }
  console.log(items)
  return (
    <div>
      <p>.</p>
      <h2 className="mt-8 text-lg mx-2 font-bold">Properties listed by {id}</h2>
      {items}
    </div>
  );
};

export default OwnerHouses;
