'use client';

import { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ethers } from 'ethers'; // Import ethers.js for blockchain interaction

export default function PointsDisplay() {
  const [points, setPoints] = useState(0);
  const [nextRewardPoints, setNextRewardPoints] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Add your deployed contract address here
  const contractABI = 'YOUR_CONTRACT_ABI'; // Add your contract ABI here

  useEffect(() => {
    async function fetchRecyclingData() {
      try {
        const response = await fetch('/api/recycling-data');
        if (!response.ok) {
          throw new Error('Failed to fetch recycling data');
        }
        const data = await response.json();
        calculatePoints(data);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecyclingData();
  }, []);

  const calculatePoints = (recyclingEntries) => {
    let totalPoints = 0;
    recyclingEntries.forEach((entry) => {
      entry.classifications.forEach((classification) => {
        switch (classification.size_quality) {
          case 'high':
            totalPoints += 100;
            break;
          case 'medium':
            totalPoints += 50;
            break;
          case 'low':
            totalPoints += 25;
            break;
          default:
            totalPoints += 10;
        }

        switch (classification.intensity_quality) {
          case 'high':
            totalPoints += 100;
            break;
          case 'medium':
            totalPoints += 50;
            break;
          case 'low':
            totalPoints += 25;
            break;
          default:
            totalPoints += 10;
        }
      });
    });

    setPoints(totalPoints);
    setNextRewardPoints(Math.ceil(totalPoints / 1000) * 1000);
  };

  const percentage = (points / nextRewardPoints) * 100;

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return signer;
      } catch (err) {
        console.error('Error connecting wallet:', err);
      }
    } else {
      alert('MetaMask not installed');
    }
  }

  async function mintNFT(points) {
    const signer = await connectWallet();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
      const transaction = await contract.mintNFT(points); // Assuming `mintNFT` is the contract method
      await transaction.wait();
      alert('NFT minted successfully!');
    } catch (err) {
      console.error('Error minting NFT:', err);
    }
  }

  if (isLoading) {
    return <div className="text-center p-6">Loading points data...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-xl font-bold mb-2">Error Loading Points</h2>
        <p>{error}</p>
        <p className="mt-2">
          Please try refreshing the page or contact support if the problem
          persists.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-3xl font-semibold mb-6 text-green-700">Your Eco Points</h2>
      <div className="flex items-center justify-between">
        <div className="w-40 h-40">
          <CircularProgressbar
            value={percentage}
            text={points.toString()}
            styles={buildStyles({
              textSize: '22px',
              pathColor: `rgba(0, 243, 89, ${percentage / 100})`,
              textColor: '#16a34a',
              trailColor: '#e2e8f0',
            })}
          />
        </div>
        <div className="ml-6 flex-grow">
          <p className="text-2xl font-bold text-gray-800 mb-2">
            {points} / {nextRewardPoints}
          </p>
          <p className="text-lg text-gray-600 mb-4">
            {nextRewardPoints - points} points until your next reward!
          </p>
          <button
            className="w-full bg-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors duration-300 shadow-md"
            onClick={() => mintNFT(points)}
          >
            Redeem for NFT
          </button>
        </div>
      </div>
    </div>
  );
}
