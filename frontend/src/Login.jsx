import { useState,useContext } from "react";
import {MyContext} from './MyContext'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './Auth.css';

export default function Login(){
    const[email,setEmail]=useState("");
    const [password, setPassword] = useState("");
    const { setUser } = useContext(MyContext);
    const navigate = useNavigate();
    const handleLogin=async(e)=>{
        try{
             e.preventDefault();
            const response=await fetch("http://localhost:8080/api/user/login",
                {
                method:"POST",
                headers:{ "Content-Type":"application/json"},
                credentials:"include",
                 body: JSON.stringify({ email, password }),
                });
                const data=await response.json();
                console.log(data);
                if (response.ok) {
                    const { user } = data;
                    setUser({ username: user.username, id: user.id });
                    toast.success("Successfully Logged in!");
                    navigate("/chat");
                  } else {
                    toast.error(data.message || "Login failed");
                   }

        }catch(e){
            console.log(e);
            toast.error("Something went wrong");
        }
    }
    
 const goToLogin = () => {
    navigate("/register");
  };
    return(
      
         <div className="auth-page">
      <div className="watermark">MayaAI</div>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button>Login</button>
        </form>
        <div className="switch-form" onClick={goToLogin}>
          Don't have an account? Register
        </div>
      </div>
    </div>
    )
}