import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import Register from './Register';
import Login from './Login';
import { MyContext } from './MyContext';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { BrowserRouter as Router, Routes, Route,Navigate} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './App.css';

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [user, setUser] = useState(null);


  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
    user, setUser,
  };

  return (
    <MyContext.Provider value={providerValues}>
      <ToastContainer
    position="top-center"
    autoClose={3000}
    hideProgressBar
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="dark"
    
  />
      <Router>
        <Routes>
        
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/chat" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/chat" />} />

         
          <Route path="/chat" element={user ? (
            <div className='app'>
              <Sidebar />
              <ChatWindow />
            </div>
          ) : <Navigate to="/login" />} />

 
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </MyContext.Provider>
  );
}

export default App;
