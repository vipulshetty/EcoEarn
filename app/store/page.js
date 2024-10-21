'use client'

import React, { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'

export default function RecycleStore() {
  const [cart, setCart] = useState([])

  const products = [
    { id: 1, name: 'Recycled Notebook', price: 500, image: 'https://via.placeholder.com/150?text=Recycled+Notebook' },
    { id: 2, name: 'Eco-friendly Water Bottle', price: 750, image: 'https://via.placeholder.com/150?text=Eco-friendly+Water+Bottle' },
    { id: 3, name: 'Reusable Shopping Bag', price: 300, image: 'https://via.placeholder.com/150?text=Reusable+Shopping+Bag' },
    { id: 4, name: 'Bamboo Toothbrush Set', price: 400, image: 'https://via.placeholder.com/150?text=Bamboo+Toothbrush+Set' },
  ]

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-800">Recycle Store</h1>
        
        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-green-700">Available Products</h2>
            <div className="relative">
              <FaShoppingCart className="text-2xl text-green-600" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-green-600 font-bold">{product.price} points</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
