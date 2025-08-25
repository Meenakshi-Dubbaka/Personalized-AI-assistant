import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "./MyContext";
import { toast } from "react-toastify";
import { clientServer } from './API/axios';
import './Auth.css';

 export default function Register(){
    const[username,setUsername]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const navigate = useNavigate();

    const handleRegister=async(e)=>{
        try{
             e.preventDefault();
            const response=await clientServer.post("/api/user/register",
               { username, email, password });
            const data=await response.data;
            console.log(data);
           
                 toast.success(" Registration successful! Please login.");
               navigate("/login"); 
     

        }catch(e){
            console.log(e);
            toast.error( e.response?.data?.message||"Registration failed");
            
        }
    }
     const goToRegister = () => {
    navigate("/login");
  };


    return(
        <div className="auth-page">
      <div className="watermark">MayaAI</div>
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
            <input placeholder="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
            <input placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input placeholder="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit" >Register</button>
            </form>
             <div className="switch-form" onClick={goToRegister}>
        Already have an account? Login
      </div>
        </div>
        </div>
    )

}