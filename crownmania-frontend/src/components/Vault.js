// src/components/Vault.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Vault({ walletAddress }) {
  const [serialNumber, setSerialNumber] = useState('');
  const [collectible, setCollectible] = useState(null);
  const [myCollectibles, setMyCollectibles] = useState([]);

  useEffect(() => {
    const fetchMyCollectibles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/collectibles/my-collectibles`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMyCollectibles(response.data);
      } catch (error) {
        console.error('Error fetching my collectibles:', error);
      }
    };

    if (walletAddress) {
      fetchMyCollectibles();
    }
  }, [walletAddress]);

  const verifyCollectible = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/collectibles/verify`,
        { serialNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCollectible(response.data);
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const claimCollectible = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/collectibles/claim`,
        { collectibleId: collectible._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);
      // Refresh the list of collectibles
      setMyCollectibles([...myCollectibles, collectible]);
      setCollectible(null);
      setSerialNumber('');
    } catch (error) {
      console.error('Claim error:', error);
    }
  };

  return (
    <div>
      <h2>My Vault</h2>

      <h3>Owned Collectibles</h3>
      {myCollectibles.length > 0 ? (
        <ul>
          {myCollectibles.map((item) => (
            <li key={item._id}>
              Token ID: {item.tokenId} - Serial Number: {item.serialNumber}
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no collectibles.</p>
      )}

      <h3>Verify and Claim a Collectible</h3>
      <input
        type="text"
        value={serialNumber}
        onChange={(e) => setSerialNumber(e.target.value)}
        placeholder="Enter Serial Number"
      />
      <button onClick={verifyCollectible}>Verify</button>

      {collectible && (
        <div>
          <h4>Collectible Details</h4>
          <p>Token ID: {collectible.tokenId}</p>
          <p>Claimed: {collectible.claimed ? 'Yes' : 'No'}</p>
          {!collectible.claimed && <button onClick={claimCollectible}>Claim Digital Collectible</button>}
        </div>
      )}
    </div>
  );
}

export default Vault;