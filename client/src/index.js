import React from 'react';
import ReactDom from 'react-dom/client';
import {useState} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InputHouse from './input';
import "./index.css"
import OwnerHouses from './Owner';
import NavBar from "./NavBar";
import Login from "./login"
import Register from "./register"
import Filtermix from './Filter'
import LoginCallback from './LoginCallback';
import Profile from './Profile'
import House from "./House"
function App() {
  var [Data,setData] = useState(1);
  var handle = (num) => {
    console.log(Data);
    console.log("Handle function called")
    setData(num);
  }
  return (
    <BrowserRouter>
    <NavBar/>
      <Routes>  
        <Route path='/login' element={<Login/>}/>
        <Route path='/userHouses/:id' element={<OwnerHouses/>}/>
        <Route path='/house/:id' element={<House/>}/>
        <Route path='/callback' element={<LoginCallback/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/' element={<Filtermix data={handle}/>}/>
        <Route path='/addProperty' element={<InputHouse/>}/>
      </Routes>
    </BrowserRouter>
  );
} 
const root = ReactDom.createRoot(document.getElementById('root'));
root.render(<App/>);


