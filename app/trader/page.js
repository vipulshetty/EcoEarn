'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Fix for default marker icon in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

export default function TraderPage() {
  const [userLocation, setUserLocation] = useState({ lat: 51.505, lng: -0.09 });
  const [traders, setTraders] = useState([]);
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }

    // Simulate getting nearby traders (replace with actual API call in production)
    setTimeout(() => {
      const dummyTraders = [
        {
          id: 1,
          name: 'EcoTrader Inc.',
          location: { lat: 51.51, lng: -0.1 },
          phone: '+1 (555) 123-4567',
          email: 'contact@ecotrader.com',
          address: '123 Green Street, Eco City, EC1 2NR',
        },
        {
          id: 2,
          name: 'RecycleMax',
          location: { lat: 51.52, lng: -0.11 },
          phone: '+1 (555) 987-6543',
          email: 'info@recyclemax.com',
          address: '456 Sustainability Ave, Green Town, GT3 8YZ',
        },
        {
          id: 3,
          name: 'GreenCycle Solutions',
          location: { lat: 51.49, lng: -0.08 },
          phone: '+1 (555) 246-8135',
          email: 'hello@greencycle.com',
          address: '789 Eco Lane, Recycle City, RC4 5XC',
        },
      ];
      setTraders(dummyTraders);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleTraderSelect = (trader) => {
    setSelectedTrader(trader);
  };

  const handleConfirm = () => {
    if (selectedTrader) {
      // Calculate a random time between 3 and 9 minutes
      const time = Math.floor(Math.random() * 7) + 3;
      setEstimatedTime(time);
      setShowConfirmation(true);
      // Here you would typically send this information to your backend
    } else {
      alert('Please select a trader before confirming.');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        className="text-5xl font-bold text-center mb-8 text-green-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Nearby Traders
      </motion.h1>
      
      {isLoading ? (
        <motion.div 
          className="flex justify-center items-center h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white shadow-2xl rounded-lg p-8 mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-3xl font-semibold mb-6 text-green-600 border-b pb-2">Select a Trader</h2>
          <RadioGroup onValueChange={(value) => handleTraderSelect(traders.find(t => t.id === parseInt(value)))}>
            {traders.map((trader) => (
              <div key={trader.id} className="flex items-center space-x-2 mb-4">
                <RadioGroupItem value={trader.id.toString()} id={`trader-${trader.id}`} />
                <Label htmlFor={`trader-${trader.id}`} className="text-lg font-medium cursor-pointer">
                  {trader.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {selectedTrader && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-700">{selectedTrader.name}</h3>
              <p className="flex items-center text-lg mb-2 text-gray-700">
                <FaPhoneAlt className="mr-3 text-green-500" />
                {selectedTrader.phone}
              </p>
              <p className="flex items-center text-lg mb-2 text-gray-700">
                <FaEnvelope className="mr-3 text-green-500" />
                {selectedTrader.email}
              </p>
              <p className="flex items-center text-lg mb-2 text-gray-700">
                <FaMapMarkerAlt className="mr-3 text-green-500" />
                {selectedTrader.address}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleConfirm} 
            className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-lg"
          >
            Confirm
          </Button>
        </motion.div>
      )}
      
      <motion.div 
        className="h-[400px] rounded-lg overflow-hidden shadow-lg"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
          {traders.map((trader) => (
            <Marker key={trader.id} position={trader.location}>
              <Popup>{trader.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </motion.div>

      <motion.div 
        className="mt-12 bg-green-100 p-6 rounded-lg shadow-lg"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <h3 className="text-2xl font-semibold mb-4 text-green-700">Why Choose Our Traders?</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Competitive rates for your recyclables</li>
          <li>Eco-friendly processing methods</li>
          <li>Support for local environmental initiatives</li>
          <li>Convenient pickup services available</li>
          <li>Verified and trusted recycling partners</li>
        </ul>
      </motion.div>

      <AnimatePresence>
        {showConfirmation && (
          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-green-700 flex items-center justify-center">
                  <FaCheckCircle className="mr-2 text-green-500" />
                  Confirmation Successful
                </DialogTitle>
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <DialogDescription className="text-lg mb-4">
                  You have successfully confirmed {selectedTrader.name} as your trader.
                </DialogDescription>
                <p className="text-xl font-semibold text-green-600 mb-2">
                  Estimated arrival time:
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {estimatedTime} minutes
                </p>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}