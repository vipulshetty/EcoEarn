import React, { useState, useEffect } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function EcoPointsSystem() {
  const [points, setPoints] = useState(0);
  const [nextRewardPoints, setNextRewardPoints] = useState(1000);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    fetchRecyclingData();
    fetchUserNFTs();
  }, []);

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

  async function fetchUserNFTs() {
    try {
      const response = await fetch('/api/user-nfts');
      if (!response.ok) {
        throw new Error('Failed to fetch user NFTs');
      }
      const data = await response.json();
      setNfts(data.nfts);
    } catch (err) {
      console.error('Error fetching NFTs:', err);
    }
  }

  const calculatePoints = (recyclingEntries) => {
    let totalPoints = 0;
    recyclingEntries.forEach(entry => {
      entry.classifications.forEach(classification => {
        switch(classification.size_quality) {
          case 'high': totalPoints += 100; break;
          case 'medium': totalPoints += 50; break;
          case 'low': totalPoints += 25; break;
          default: totalPoints += 10;
        }

        switch(classification.intensity_quality) {
          case 'high': totalPoints += 100; break;
          case 'medium': totalPoints += 50; break;
          case 'low': totalPoints += 25; break;
          default: totalPoints += 10;
        }
      });
    });

    setPoints(totalPoints);
    setNextRewardPoints(Math.ceil(totalPoints / 1000) * 1000);
  };

  const redeemPointsForNFT = async () => {
    setIsRedeeming(true);
    try {
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points }),
      });

      if (!response.ok) {
        throw new Error('Failed to mint NFT');
      }

      const result = await response.json();
      setPoints(prev => prev - 1000); // Deduct points after successful redemption
      alert(`Successfully minted NFT! Transaction Hash: ${result.transactionHash}`);
      fetchUserNFTs(); // Refresh NFT list
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError('Failed to mint NFT. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const percentage = (points / nextRewardPoints) * 100;

  if (isLoading) {
    return <div className="text-center p-6">Loading eco-points data...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <p className="mt-2">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-semibold mb-6 text-green-700">Your Eco Points</h2>
        <div className="flex items-center justify-between">
          <div className="w-40 h-40">
            <CircularProgressbar
              value={percentage}
              text={`${points}`}
              styles={buildStyles({
                textSize: '22px',
                pathColor: `rgba(34, 197, 94, ${percentage / 100})`,
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
              onClick={redeemPointsForNFT}
              disabled={isRedeeming || points < 1000}
              className={`w-full px-6 py-3 rounded-full text-lg font-semibold shadow-md ${
                isRedeeming || points < 1000
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300'
              }`}
            >
              {isRedeeming ? 'Minting NFT...' : 'Redeem for NFT (1000 points)'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-purple-700">Your NFT Collection</h3>
        {nfts.length === 0 ? (
          <p className="text-gray-600">You haven't redeemed any NFTs yet. Start recycling to earn points!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nfts.map((nft, index) => (
              <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
                <img src={nft.image} alt={nft.name} className="w-32 h-32 object-cover mb-2" />
                <h4 className="font-semibold">{nft.name}</h4>
                <p className="text-sm text-gray-600">{nft.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}