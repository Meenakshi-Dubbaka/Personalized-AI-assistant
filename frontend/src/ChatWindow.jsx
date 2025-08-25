import './ChatWindow.css'
import Chat from './Chat'
import { MyContext } from './MyContext'
import { useContext, useEffect, useState } from 'react'
import {ScaleLoader} from 'react-spinners';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function ChatWindow(){
  const{prompt,setPrompt,reply,setReply,setCurrThreadId,currThreadId,setPrevChats,setNewChat,setAllThreads,setUser,user}=useContext(MyContext);
  const [loading,setLoding]=useState(false);
  const [isOpen,setIsOpen]=useState(false);//set default false value
  const navigate = useNavigate();
  const getResponse=async()=>{
    setLoding(true);
    setNewChat(false);
    const options={
      method:"POST",
      credentials: "include", 
      headers:{
         "Content-Type":"application/json"
      },
      body:JSON.stringify({
        message:prompt,
        threadId:currThreadId,
      })
    }
    try{
      const response=await fetch("http://localhost:8080/api/chat/",options);
      const res= await response.json();
      console.log(res);
      setReply(res.reply);

    }catch(e){
      console.log(e)

    }
    setLoding(false)
  }

  // append new chats to prevchats
  
  useEffect(()=>{
    if(prompt&&reply){
      setPrevChats(prevChats=>(
        [...prevChats,{
          role:"user",
          content:prompt,
        },{
          role:"assistant",
          content:reply
        }]
      ))
    }
    setPrompt("")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[reply]);
  const handleProfile=()=>{
    setIsOpen(!isOpen)
  }

  const logout=async()=>{
    try{
       const response = await fetch("http://localhost:8080/api/user/logout", {
      method: "POST",
      credentials: "include",
    });
     const data = await response.json();
    console.log(data.message);
    setUser(null)
    setPrevChats([]);
    setCurrThreadId(null);
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setAllThreads([]);
    navigate("/login");
    }catch(e){
      console.log(e)
    }
  }
  const notify=()=>{
    toast.success("sucessfully logged out !")
  };



    return(
        <div className='chatwindow'>
          <div className="navbar">
            <span className='brand-name'>MayaAI</span>
            <div className="usericondiv">
              <span className='usericon' onClick={handleProfile}><i className="fa-solid fa-circle-user" style={{color:" #74C0FC",fontSize:"1.25rem"}}></i>
              &nbsp;{user?user.username:"Guest"}
              </span>
              </div>
          </div>
          {
            isOpen&&
            <div className='dropdown'>
              <div className="dropdownitem" onClick={()=>{
                logout();
                notify();

              }} ><i className="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
            </div>
          }

          <Chat></Chat>
          <ScaleLoader color='#fff' loading={loading}></ScaleLoader>

          <div className="chatinput">
            <div className="inputbox">
                <input  placeholder='Ask anything' value={prompt} onChange={(e)=>setPrompt(e.target.value)} onKeyDown={(e)=>e.key==="Enter"?getResponse():""} ></input>
                <div id='submit' onClick={getResponse}><i className="fa-solid fa-paper-plane"></i></div>
            </div>
            <p className='info'>
              MayaAI can make mistakes. check important info. see <a className='cookies'>cookies prefernces</a>.
            </p>

          </div>
       
        </div>
    )
}