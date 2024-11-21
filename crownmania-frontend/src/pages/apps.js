// src/App.js
import React, { useEffect, useState } from 'react';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import Shop from './components/Shop';
import Vault from './components/Vault';

function App() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const clientId = process.env.REACT_APP_WEB3AUTH_CLIENT_ID;
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: '0x89', // Polygon Mainnet
            rpcTarget: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`,
          },
        });

        setWeb3auth(web3auth);
        await web3auth.initModal();

        if (web3auth.provider) {
          setProvider(web3auth.provider);
          const web3Provider = new ethers.providers.Web3Provider(web3auth.provider);
          const signer = web3Provider.getSigner();
          const address = await signer.getAddress();
          setWalletAddress(address);
          setLoggedIn(true);

          // Authenticate with backend
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress: address }),
          });
          const data = await response.json();
          localStorage.setItem('token', data.token);
        }
      } catch (error) {
        console.error('Web3Auth initialization error:', error);
      }
    };

    init();
  }, []);

  const login = async () => {
    if (!web3auth) return;
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);

    const web3Provider = new ethers.providers.Web3Provider(web3authProvider);
    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
    setLoggedIn(true);

    // Authenticate with backend
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress: address }),
    });
    const data = await response.json();
    localStorage.setItem('token', data.token);
  };

  const logout = async () => {
    if (!web3auth) return;
    await web3auth.logout();
    setProvider(null);
    setWalletAddress('');
    setLoggedIn(false);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/contact">Contact</Link> |{' '}
        <Link to="/shop">Shop</Link> | <Link to="/vault">Vault</Link> |{' '}
        {loggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/vault" element={<Vault walletAddress={walletAddress} />} />
      </Routes>
    </Router>
  );
}

export default App;