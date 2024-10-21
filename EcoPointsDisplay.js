'use client'

import { useState, useEffect } from 'react'
import { AptosClient, AptosAccount, FaucetClient, Types } from 'aptos'

const NODE_URL = 'https://fullnode.testnet.aptoslabs.com'
const FAUCET_URL = 'https://faucet.testnet.aptoslabs.com'

export default function EcoPointsDisplay() {
  const [points, setPoints] = useState(0)
  const [account, setAccount] = useState(null)
  const [client, setClient] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAptos = async () => {
      const client = new AptosClient(NODE_URL)
      const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL)
      
      // Create a new account
      const account = new AptosAccount()
      
      // Fund the account (this is only for testnet)
      await faucetClient.fundAccount(account.address(), 100_000_000)
      
      setAccount(account)
      setClient(client)
    }

    initAptos()
  }, [])

  useEffect(() => {
    // Simulating fetching points from an API
    setPoints(Math.floor(Math.random() * 1000))
  }, [])

  const mintCertificate = async () => {
    if (!account || !client) {
      setError('Aptos client not initialized')
      return
    }

    try {
      const payload = {
        type: "entry_function_payload",
        function: "0x1::managed_coin::mint",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [account.address().hex(), points.toString()]
      }

      const txnRequest = await client.generateTransaction(account.address(), payload)
      const signedTxn = await client.signTransaction(account, txnRequest)
      const transactionRes = await client.submitTransaction(signedTxn)
      await client.waitForTransaction(transactionRes.hash)

      setTxHash(transactionRes.hash)
    } catch (err) {
      setError('Failed to mint certificate: ' + err.message)
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="bg-white shadow-xl rounded-lg p-6">
      <h2 className="text-3xl font-semibold mb-6 text-green-700">Your Eco Points</h2>
      <p className="text-2xl font-bold text-gray-800 mb-4">{points} points</p>
      <button 
        onClick={mintCertificate}
        className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition-colors duration-300 shadow-md"
      >
        Mint Certificate
      </button>
      {txHash && (
        <p className="mt-4 text-green-600">
          Certificate minted! Transaction hash: {txHash}
        </p>
      )}
    </div>
  )
}