import './Sidebar.css';
import { MyContext } from './MyContext';
import { useContext, useEffect } from 'react';
import {v1 as uuidv1} from 'uuid';
import { clientServer } from './API/axios';
export default function Sidebar(){
  const{allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(MyContext);


   let getAllThreads=async()=>{
    try{
      const response=await clientServer.get(`/api/thread`);
      const data=await response.data;
       if (response.status!==200) {
      console.log(data.message || "Failed to fetch threads");
      return;
    }
      const filteredData=data.map((thread)=>({
        threadId:thread.threadId, 
        title:thread.title
      }))
      console.log(filteredData);
      setAllThreads(filteredData)

    }catch(e){
      console.log(e.response?.data?.message||"Error")
    }
  };

  useEffect(()=>{
    getAllThreads();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currThreadId]);

  const createNewChat=()=>{  
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  }
  const changeThread=async (newThreadId)=>{
    setCurrThreadId(newThreadId)
    try{
      const response=await clientServer.get(`/api/thread/${newThreadId}`);
      const res=await response.data;
      console.log(res);
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    }catch(e){
      console.log(e)
    };
  };
  const delteThread=async(threadId)=>{
    try{
     const response=await clientServer.delete(`/api/thread/${threadId}`); 
     const res=await response.data;
     console.log(res);
     //update all threads 
     setAllThreads( prev=>prev.filter(thread=>thread.threadId!==threadId))
     //clear in current chats
     if(threadId===currThreadId){
      createNewChat();
     }

    }catch(e){
      console.log(e)
    };
  };
    return(
        <section className='sidebar' >
          <button >
            {/* <img src="src/assets/logo.png" alt="gpt-logo" className='logo' /> */}
            <span className='newchat'>New Chat</span>
            <span onClick={createNewChat}><i className="fa-solid fa-pen-to-square"></i></span>
          </button>
          <ul className='history'>
            <p className='chat-menu'>chats</p>
           {
            allThreads?.map((thread,idx)=>(
              <li key={idx} 
              onClick={()=>changeThread(thread.threadId)} 
              className={thread.threadId===currThreadId ?"highlighted":""}>
                {thread.title}
                <i className="fa-solid fa-trash" 
                onClick={(e)=>{
                  e.stopPropagation();
                  delteThread(thread.threadId)
                }}></i>
                </li>
            ))
           }
          </ul>

          <div className='sidebar-footer'> 
           <p style={{textAlign:"center"}}>© 2025 MayaAI | Powered by OpenAI</p>
          </div>
        </section>
    );
};