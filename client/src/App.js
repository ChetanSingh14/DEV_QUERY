import { fetchallusers } from './action/users';
import './App.css';
import {useEffect, useState} from 'react';
import Navbar from './Comnponent/Navbar/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Allroutes from './Allroutes'
import { useDispatch } from 'react-redux';
import { fetchallquestion } from './action/question';
function App() {
  const [slidein,setslidein]=useState(true)
  const dispatch=useDispatch()
useEffect(()=>{
  dispatch(fetchallusers());
  dispatch(fetchallquestion());
},[dispatch])

  useEffect(()=>{
    if(window.innerWidth<= 768){
      setslidein(false)
    }
  },[])
  const handleslidein=()=>{
    if(window.innerWidth<=768){
      setslidein((state)=> !state);
    }
  };

  // Log the client ID to verify it's loaded
  console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

  const clientId = "274444899561-suokv2kifeiupfbijttvuqmfgng9q7pf.apps.googleusercontent.com";
  if (!clientId) {
    console.error('Google Client ID is not set in environment variables');
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <Router>
          <Navbar handleslidein={handleslidein}/>
          <Allroutes slidein={slidein} handleslidein={handleslidein}/>
        </Router>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
