import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function InputHouse() {
  const token = localStorage.getItem("jwtToken");
  var navigate = useNavigate();
  var [message, setMessage] = useState("");
  const [form, setForm] = useState({
    houseName: "",
    price: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    property_type: "House",
    bedrooms: 0,
    bathrooms: 0,
    square_footage: 0,
    Ph_no: "",
  });
  const [images, setImages] = useState([]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    for (const [key, value] of Object.entries(form)) {
      formData.append(key, value);
    }
    images?.forEach((image) => {
      formData.append('images', image);
    });
    try {
      const response = await fetch("/api/addProperty", {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
        },
        body: formData
      }); 
      if(response.ok){
        setMessage("Property added successfully");
        navigate("/")
      }
      else {
        setMessage("Error adding property, provide complete address");
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
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
    <form onSubmit={submitForm}>
      <div>
        <p>.</p>
        <label className="mx-2 mt-10" htmlFor="houseName">Name of the Property:</label>
        <input
        placeholder="Name.."
        className="lg:mt-8 mt-10 border-2 border-black rounded-lg"
          type="text"
          id="houseName"
          name="houseName"
          value={form.houseName}
          onChange={change}
          required
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="price">Price:</label>
        <input
        className="border-2 mt-1 border-black rounded-lg"
          type="number"
          id="price"
          name="price"
          value={form.price}
          onChange={change}
          required
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="address">Address:</label>
        <input
        className="border-2 mt-1 border-black rounded-lg"
          type="text"
          id="address"
          name="address"
          value={form.address}
          onChange={change}
          required
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="city">City:</label>
        <input
        className="mt-1 border-2 border-black rounded-lg"
          type="text"
          id="city"
          name="city"
          value={form.city}
          onChange={change}
          required
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="state">State:</label>
        <input
        className="mt-1 border-2 border-black rounded-lg"
          type="text"
          id="state"
          name="state"
          value={form.state}
          onChange={change}
          required
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="zipcode">Zipcode:</label>  
        <input
        className="mt-1 border-2 border-black rounded-lg"
          type="text"
          id="zipcode"
          name="zipcode"
          value={form.zipcode}
          onChange={change}
          required
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="property_type">Property Type:</label>
        <select
        className="mt-1 border-2 border-black rounded-lg"
          id="property_type"
          name="property_type"
          value={form.property_type}
          onChange={change}
          required
        >
          <option value="">Select Property Type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mx-2" htmlFor="bedrooms">Bedrooms:</label>
        <input
        className="mt-1 border-2 border-black rounded-lg"
          type="number"
          id="bedrooms"
          name="bedrooms"
          value={form.bedrooms}
          onChange={change}
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="bathrooms">Bathrooms:</label>
        <input
        className="mt-1 border-2 border-black rounded-lg"
          type="number"
          id="bathrooms"
          name="bathrooms"
          value={form.bathrooms}
          onChange={change}
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="square_footage">Square Footage:</label>
        <input
        className="mt-1 border-2 border-black rounded-lg"
          type="number"
          id="square_footage"
          name="square_footage"
          value={form.square_footage}
          onChange={change}
          required
        />
      </div>
      <div>
        <label className="mx-2" htmlFor="state">Ph_no: </label>
        <input
        className="mt-1 border-2 border-black rounded-lg"
          type="text"
          id="Ph_no"
          name="Ph_no"
          value={form.Ph_no}
          onChange={change}
          required
        />
      </div>
      <div>
      <label className="mx-2" htmlFor="image1">Image 1 </label>
        <input
        className="mt-1"
          type="file"
          id="image1"
          name="image1"
          onChange={handleImageChange}
          required
        />
      </div>
      <div>
      <label className="mx-2" htmlFor="image2">Image 2 </label>
        <input
          type="file"
          id="image2"
          name="image2"
          onChange={handleImageChange}
          required
        />
      </div>
      <div>
      <label className="mx-2" htmlFor="image3">Image 3 </label>
        <input
          type="file"
          id="image3"
          name="image3"
          onChange={handleImageChange}
          required
        />
      </div>
      <button className="mx-2 mt-1 bg-green-500 hover:bg-green-600 w-48 text-white p-1 rounded-lg" type="submit" onClick={submitForm}>
        Submit
      </button>
      <p>{message}</p>
    </form>
  );
}

export default InputHouse;
