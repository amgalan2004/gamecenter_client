// src/pages/gaming-center-map/components/MapContainer.jsx
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Leaflet icon-ы стандарт алдааг засах (Vite/Webpack-д зориулав)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// 1. Хэрэглэгчийн байршлын icon (Цэнхэр)
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 2. Тоглоомын төвүүдийн маркер (УЛААН өнгө энд тохируулагдсан)
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DEFAULT_LOCATION = { lat: 47.918873, lng: 106.917701 };

// Газрын зургийн хөдөлгөөн болон агуулгыг удирдах хэсэг
const MapContent = ({
  gamingCenters,
  userLocation,
  selectedCenter,
  onCenterSelect,
  onBookingClick,
}) => {
  const map = useMap();

  // Хэрэглэгчийн байршил руу шилжих
  useEffect(() => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      map.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
    }
  }, [userLocation, map]);

  // Сонгосон төв рүү "нисэж" очих
  useEffect(() => {
    if (selectedCenter) {
      const lat = selectedCenter.latitude || selectedCenter.lat;
      const lng = selectedCenter.longitude || selectedCenter.lng;
      if (lat && lng) {
        map.flyTo([lat, lng], 16, { animate: true });
      }
    }
  }, [selectedCenter, map]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />

      {/* Хэрэглэгчийн өөрийн байршил */}
      {userLocation && userLocation.lat && userLocation.lng && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Та энд байна</Popup>
        </Marker>
      )}

      {/* 🟢 ЭНД BACKEND-ЭЭС ИРСЭН ӨГӨГДЛИЙГ MAP() АШИГЛАЖ ГАРГАНА */}
      {gamingCenters.map((center) => {
        // Координатыг баталгаажуулах (Backend-ээс latitude/longitude эсвэл lat/lng ирнэ)
        const lat = center.latitude || center.lat;
        const lng = center.longitude || center.lng;

        // Хэрэв координат байхгүй бол маркер зурахгүй (NULL утгаас сэргийлнэ)
        if (!lat || !lng) return null;

        return (
          <Marker
            key={center.id}
            position={[lat, lng]}
            icon={redIcon} // Улаан маркер ашиглаж байна
            eventHandlers={{
              click: () => onCenterSelect && onCenterSelect(center),
            }}
          >
            <Popup>
              <div className="p-1 space-y-1" style={{ minWidth: "150px" }}>
                <div className="font-bold text-gray-900 text-sm">{center.name}</div>
                <div className="text-xs text-gray-600">
                  Тариф: <span className="text-blue-600 font-semibold">{Number(center.tariff || center.hourlyRate).toLocaleString()}₮</span>/цаг
                </div>
                {center.working_hours && (
                  <div className="text-[10px] text-gray-500 italic">
                    Цагийн хуваарь: {center.working_hours}
                  </div>
                )}
                <button
                  onClick={() => onBookingClick && onBookingClick(center)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 mt-2 w-full rounded shadow-sm transition-colors"
                >
                  Захиалах
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

const MapContainer = ({
  gamingCenters = [],
  userLocation,
  selectedCenter,
  onCenterSelect,
  onBookingClick,
}) => {
  const initialPos = userLocation && userLocation.lat 
    ? [userLocation.lat, userLocation.lng] 
    : [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng];

  return (
    <div className="w-full h-full">
      <LeafletMap
        center={initialPos}
        zoom={13}
        className="w-full h-full"
      >
        <MapContent
          gamingCenters={gamingCenters}
          userLocation={userLocation}
          selectedCenter={selectedCenter}
          onCenterSelect={onCenterSelect}
          onBookingClick={onBookingClick}
        />
      </LeafletMap>
    </div>
  );
};

export default MapContainer;