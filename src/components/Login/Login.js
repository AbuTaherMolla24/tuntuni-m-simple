import React, { useState } from 'react';
// Firebase App (the core Firebase SDK) is always required and must be listed first


// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use

import "firebase/firestore";

import { useContext } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleFBLogin, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './loginManager';


function Login() {
  const [newUser, setNewUser] = useState(false)
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  initializeLoginFramework();
  
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let {from} = location.state || {from: {pathname:'/'}};

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(response => {
      handleResponse(response, true);
    })
  }
  const fbLogin = () => {
    handleFBLogin()
    .then(response => {
      handleResponse(response, true);
    })
  }

  const signOut = () => {
    handleSignOut()
    .then(response => {
      handleResponse(response, false);
    })
  }

  const handleResponse = (response, redirect) => {
    setUser(response);
    setLoggedInUser(response);
    if(redirect) {
      history.replace(from);
    }
  }

  
  const handleBlur = (event) => {
    let isFieldValid = true;
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      
  }
  if(event.target.name === 'password'){
    const isPasswordValid = event.target.value.length>6;
    const passwordHasValue = /\d{1}/.test(event.target.value);
    isFieldValid = (isPasswordValid && passwordHasValue);
  }
  if(isFieldValid){
    const newUserInfo = {...user};
    newUserInfo[event.target.name] = event.target.value;
    setUser(newUserInfo);
  }
}
  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(response=>{
        handleResponse(response, true);
      })
      
    }
    if (!newUser && user.email && user.password) {
     signInWithEmailAndPassword(user.email, user.password)
     .then(response=>{
      handleResponse(response, true);
    })
      
    }
    event.preventDefault();
  }

  return (
    <div style={{textAlign: 'center'}}>
     {
       user.isSignedIn ?  <button onClick={signOut}> Sign out</button> :
      <button onClick={googleSignIn}> Sign in</button>
    }
    <br/>
    <button onClick={fbLogin}>Login with facebook</button>
     {
       user.isSignedIn && <div>
       <p>Welcome, {user.name}!</p>
       <p>your email: {user.email}</p>
        <img src={user.photo} alt=''></img>
       </div>
     }
     <h1>Own Authentication</h1>
     <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id=""/>
     <label htmlFor="newUser">New user sign up</label>

     <form onSubmit={handleSubmit}>
    {newUser && <input type="name" name="name" onBlur={handleBlur} placeholder="enter your name" required/>}
      <br/>
      <input type="email" name='email' onBlur={handleBlur} placeholder="enter your email" required/>
      <br/>
      <input type="password" name="password" onBlur={handleBlur} placeholder="Enter your password" required/>
      <br/>
      <input type="submit" value={newUser ? 'Sign up' : "Sign In"}/>
     </form>
     
     <p style={{color: 'red'}}>{user.error}</p>
     {
       user.success && <p style={{color: 'green'}}>user {newUser ?'crerated' : 'logged in'} Successfully{user.error}</p>
     }

    </div>
  );
    }

export default Login;
