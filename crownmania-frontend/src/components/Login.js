// src/components/Login.js
import React from 'react';

function Login({ login }) {
  return (
    <div>
      <h1>Login to Crown Mania</h1>
      <button onClick={login}>Login with Web3Auth</button>
    </div>
  );
}

export default Login;