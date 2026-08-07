import Layout  from "./pages/Layout.jsx";
import Home from "./pages/Home.jsx";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import Preview from "./pages/Preview";
import { useDispatch } from "react-redux";
import api from "./config/api.js";
import { login, setLoading } from "./app/features/authSlice.js";
import { useEffect } from "react";
import {Toaster} from 'react-hot-toast';
import Login from "./pages/Login.jsx";
import ForgotPass from "./pages/ForgotPass.jsx";
      
const App=()=>{
        
  const dispatch=useDispatch();
        
  const getUserData=async () =>{
    const token=localStorage.getItem('token');
    try {
      if (token) {
        const {data}=await api.get('/api/users/data',{headers:{Authorization:token}});
        if (data.user) {
        dispatch(login({token,user:data.user}))
      }
      }else{
        dispatch(setLoading(false));
      }
       dispatch(setLoading(false));
    }  catch (error){
       dispatch(setLoading(false));
       console.log(error.message);
    }
  }

  useEffect(()=>{
    getUserData();
  },[]);

  return(
    <>
        <Toaster/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/app' element={<Layout/>}>
         <Route index element={<Dashboard/>}/>
         <Route path="builder/:resumeId" element={<ResumeBuilder/>}/>
        </Route>
        <Route path="/forgot-password" element={<ForgotPass/>}/>
        <Route path="view/:resumeId" element={<Preview/>}/>
      </Routes>
    </>
  )

}

export default App