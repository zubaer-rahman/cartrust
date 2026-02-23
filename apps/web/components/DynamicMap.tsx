'use client'

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map resizing and centering
function MapController({ center }: { center?: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
    // Fix for container size changes
    map.invalidateSize();
  }, [center, map]);
  return null;
}

interface DynamicMapProps {
  vehicles: any[];
  activeVehicleId?: string | null;
}

// Component for custom controls that need access to the map instance
function MapControls() {
  const map = useMap();
  return (
    <div className="absolute top-6 right-6 flex flex-col gap-2 z-[400]">
      <button 
        onClick={() => map.setZoom(map.getZoom() + 1)}
        className="w-10 h-10 bg-white hover:bg-slate-50 rounded-xl shadow-2xl flex items-center justify-center font-black text-xl transition-all active:scale-95 border border-slate-100"
      >
        +
      </button>
      <button 
        onClick={() => map.setZoom(map.getZoom() - 1)}
        className="w-10 h-10 bg-white hover:bg-slate-50 rounded-xl shadow-2xl flex items-center justify-center font-black text-xl transition-all active:scale-95 border border-slate-100"
      >
        −
      </button>
    </div>
  );
}

export default function DynamicMap({ vehicles, activeVehicleId }: DynamicMapProps) {
  // Mock coordinates for Dhaka if not present
  // In a real app, these would come from the database
  const getCoords = (id: string): [number, number] => {
    // Deterministic random coordinates around Dhaka center
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const lat = 23.8103 + (hash % 100 - 50) * 0.001;
    const lng = 90.4125 + (hash % 80 - 40) * 0.001;
    return [lat, lng];
  };

  const activeVehicle = vehicles.find(v => v.id === activeVehicleId);
  const center: [number, number] = activeVehicle ? getCoords(activeVehicle.id) : [23.8103, 90.4125];

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {vehicles.map((vehicle) => {
          const pos = getCoords(vehicle.id);
          const isActive = vehicle.id === activeVehicleId;
          
          return (
            <Marker 
              key={vehicle.id} 
              position={pos}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `
                  <div class="relative group">
                    <!-- Pointer Arrow -->
                    <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 rounded-sm shadow-xl transition-all duration-300 
                      ${isActive ? 'bg-[#7c3aed] scale-110' : 'bg-white opacity-0 group-hover:opacity-100 group-hover:bg-[#7c3aed]'}">
                    </div>
                    
                    <!-- Main Bubble -->
                    <div class="relative flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl border transition-all duration-500 hover:z-50
                      ${isActive 
                        ? 'bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] border-[#7c3aed] text-white scale-110 -translate-y-2 shadow-purple-500/30' 
                        : 'bg-white/95 backdrop-blur-xl border-slate-100 text-[#1a1c2e] group-hover:bg-[#7c3aed] group-hover:border-[#7c3aed] group-hover:text-white group-hover:-translate-y-2 group-hover:shadow-purple-500/20'
                      }">
                       <!-- Status indicator -->
                       <div class="flex items-center justify-center">
                         <div class="w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-[#7c3aed]/20 group-hover:bg-white'}"></div>
                       </div>
                       
                       <div class="flex flex-col leading-none">
                         <span class="text-[11px] font-black tracking-tighter whitespace-nowrap uppercase">
                           ৳${(vehicle.price / 100000).toFixed(1)}L
                         </span>
                       </div>
                    </div>
                  </div>
                `,
                iconSize: [80, 48],
                iconAnchor: [40, 24]
              })}
            >
              <Popup className="custom-popup">
                <div className="p-1">
                  <p className="font-black text-xs leading-none">{vehicle.year} {vehicle.make}</p>
                  <p className="text-[10px] font-bold text-primary mt-0.5">৳{vehicle.price.toLocaleString()}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController center={center} />
        <MapControls />
      </MapContainer>
    </div>
  );
}
