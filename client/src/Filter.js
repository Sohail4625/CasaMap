import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "./marker.png";
const myIcon = L.icon({
  iconUrl: markerIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
function FilterMix() {
  var [query, setQuery] = useState([]);
  const zipcode = useRef(null);
  const priceRangefrom = useRef(0);
  const priceRangeto = useRef(100000);
  const bedrooms = useRef(0);
  const propertyType = useRef("House");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      console.log(token);
      localStorage.setItem('jwtToken', token);
      navigate('/', { replace: true });
    }
  }, [location, navigate]);
  useEffect(() => {
    const bedroomsCheck = localStorage.getItem("bedrooms");
    if (bedroomsCheck != null) {
      try {
        zipcode.current.value = localStorage.getItem("zipcode") || "";
        priceRangefrom.current.value =
          localStorage.getItem("priceRangefrom") || 0;
        priceRangeto.current.value =
          localStorage.getItem("priceRangeto") || 10000000;
        bedrooms.current.value = localStorage.getItem("bedrooms") || 0;
        propertyType.current.value = localStorage.getItem("propertyType") || "";
        async function get_houses() {
          const data = {
            zipcode: localStorage.getItem("zipcode"),
            priceRangefrom: localStorage.getItem("priceRangefrom"),
            priceRangeto: localStorage.getItem("priceRangeto"),
            bedrooms: localStorage.getItem("bedrooms"),
            propertyType: localStorage.getItem("propertyType"),
          };
          var response = await fetch("/api/get_houses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const respjson = await response.json();
          console.log(respjson.message);
          setQuery(respjson.message);
        }
        get_houses();
      } catch (error) {
        console.error("Error parsing filters from localStorage:", error);
      }
    } else {
      async function get_houses() {
        const response = await fetch("/api/get_houses");
        const respjson = await response.json();
        const houses = respjson.message;
        console.log(houses);
        setQuery(houses);
      }
      get_houses();
    }
  }, []);
  const handleFilter = async () => {
    localStorage.setItem("zipcode", zipcode.current.value);
    localStorage.setItem("priceRangefrom", priceRangefrom.current.value);
    localStorage.setItem("priceRangeto", priceRangeto.current.value);
    localStorage.setItem("bedrooms", bedrooms.current.value);
    localStorage.setItem("propertyType", propertyType.current.value);
    const data = {
      zipcode: zipcode.current.value,
      priceRangefrom: priceRangefrom.current.value,
      priceRangeto: priceRangeto.current.value,
      bedrooms: bedrooms.current.value,
      propertyType: propertyType.current.value,
    };
    var response = await fetch("/api/get_houses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const respjson = await response.json();
    console.log(respjson.message);
    setQuery(respjson.message);
  };
  const clearFilter = async () => {
    localStorage.removeItem("zipcode");
    localStorage.removeItem("priceRangefrom");
    localStorage.removeItem("priceRangeto");
    localStorage.removeItem("propertyType");
    localStorage.removeItem("bedrooms");
    async function get_houses() {
      const response = await fetch("/api/get_houses");
      const respjson = await response.json();
      const houses = respjson.message;
      console.log(houses);
      setQuery(houses);
    }
    get_houses();
  };
  const Filter = () => {
    const propertyTypes = [
      "House",
      "Apartment",
      "Independent House",
      "Villa",
      "Flat",
      "Duplex",
      "Triplex",
      "Bungalow",
      "Plot",
      "Condo",
      "Townhouse",
      "Other",
    ];
    return (
      <div className="lg:border-2 lg:border-black rounded-lg p-2 m-1 lg:w-full flex flex-col lg:flex-col lg:space-x-1 lg:space-y-1">
        <p className="text-xs mt-12 lg:mt-0">Apply Filters</p>
        <div className="space-x-1">
          <label htmlFor="zipcode">Zipcode:</label>
          <input
            type="text"
            id="zipcode"
            className="border-2 lg:mt-0 bg-gray-50 border-black rounded-md"
            ref={zipcode}
          />
          <label htmlFor="bedrooms">Bedrooms:</label>
          <input
            type="number"
            className="border-2 bg-gray-50 border-black rounded-md"
            id="bedrooms"
            ref={bedrooms}
          />
        </div>
        <div className="lg:space-x-1 ">
          <label htmlFor="from">Price From: </label>
          <input
            type="number"
            className="border-2 bg-gray-50 border-black rounded-md"
            id="from"
            ref={priceRangefrom}
          />
          <label htmlFor="to">To: </label>
          <input
            type="number"
            className="border-2 bg-gray-50 border-black rounded-md"
            id="to"
            ref={priceRangeto}
          />
        </div>
        <div className="space-x-1">
          <label htmlFor="property_type">Property Type:</label>
          <select
            className="border-2 border-black bg-gray-50 rounded-md text-sm"
            id="property_type"
            name="property_type"
            ref={propertyType}
            required
          >
            <option value="">Select Property Type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            onClick={handleFilter}
            className="border-0 bg-green-500 text-white hover:bg-green-600 rounded-md text-sm mt-1 lg:mt-0 p-1"
          >
            Filter
          </button>
          <button
            onClick={clearFilter}
            className="border-0 bg-green-500 text-white hover:bg-green-600 text-sm p-1 rounded-md"
          >
            View All
          </button>
        </div>
      </div>
    );
  };

  const Map = () => {
    let desiredLocation = [28.676991, 77.114232];
    if (query) {
      var markers = query?.map((q) => {
        const lat = q.latitude?.$numberDecimal
          ? parseFloat(q.latitude.$numberDecimal)
          : null;
        const lng = q.longitude?.$numberDecimal
          ? parseFloat(q.longitude.$numberDecimal)
          : null;
        if (!isNaN(lat) && !isNaN(lng)) {
          desiredLocation = [lat, lng];
          console.log(lat, lng);
          return (
            <Marker key={q._id} position={[lat, lng]} icon={myIcon}>
              <Popup>
                <p>{q.houseName}</p>
                <p>{q.property_type}</p>
                <p>Bedrooms {q.bedrooms}</p>
                <p>Price {q.price}</p>
                <a className="cursor-pointer" onClick={() => navigate(`/house/${q._id}`)}>More Info</a>
              </Popup>
            </Marker>
          );
        } else return null;
      });
    }
    return (
      <div className="w-80 lg:w-full h-80 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px]">
        <MapContainer
          center={desiredLocation}
          zoom={15}
          className="w-full h-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers}
        </MapContainer>
      </div>
    );
  };
  function List() {
    if (query) {
      var items = query.map((q) => {
        return (
          <div className="border-0 border-black bg-white shadow-md p-2 pl-4 pt-3 hover:translate-y-[-5px] hover:translate-x-[-5px] hover:scale-103 rounded-xl">
            <p>
              <span className="font-semibold">Property Name:</span>{" "}
              {q.houseName}
            </p>
            <p>
              <span className="font-semibold">Property type:</span>{" "}
              {q.property_type}
            </p>
            <p>
              <span className="font-semibold">Address:</span> {q.address},{" "}
              {q.city}, {q.state}, {q.zipcode}
            </p>
            <p>
              <span className="font-semibold">Bedrooms:</span> {q.bedrooms}
            </p>
            <p>
              <span className="font-semibold">Bathrooms:</span> {q.bathrooms}
            </p>
            <p>
              <span className="font-semibold">Square Footage:</span>{" "}
              {q.square_footage}
            </p>
            <p>
              <span className="font-semibold">Price:</span> {q.price}
            </p>
            <a onClick={() => navigate(`/house/${q._id}`)} className="text-blue-800 cursor-pointer underline">
              More Info
            </a>
          </div>
        );
      });
    }
    return (
      <div className="mb-2 m-1 p-1">
        <p className="text-2xl">{items && items.length} Matching Results</p>
        <hr></hr>
        {localStorage.getItem("bedrooms") && (
          <div>
            Price Range: {localStorage.getItem("priceRangefrom")} -{" "}
            {localStorage.getItem("priceRangeto")}
          </div>
        )}
        <div className="space-y-1">{items}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col lg:flex-row bg-gray-50">
      <div className="lg:w-1/2 lg:fixed  flex flex-col mt:10 lg:mt-14">
        <div className="flex-none">
          <Filter />
        </div>
        <div className="lg:h-full lg:w-full">
          <Map />
        </div>
      </div>
      <div className="lg:w-1/2 ml-auto overflow-y-auto lg:mt-12">
        <List />
      </div>
    </div>
  );
}
export default FilterMix;
