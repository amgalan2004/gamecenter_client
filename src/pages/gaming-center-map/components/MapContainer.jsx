// src/pages/gaming-center-map/components/MapContainer.jsx
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Leaflet icon алдааг засах (webpack/Vite үед)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Хэрэглэгчийн байршлын icon (өөр өнгөтэй байлгамаар байвал энд солино)
const userIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
  iconRetinaUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
});

const DEFAULT_LOCATION = { lat: 47.918873, lng: 106.917701 };

// Дотоод компонент: map-ийн төвийг удирдана
const MapContent = ({
  gamingCenters,
  userLocation,
  selectedCenter,
  onCenterSelect,
  onBookingClick,
}) => {
  const map = useMap();

  // 1) Хэрэглэгчийн байршил орж ирмэгц шууд тийшээ төвлөрнө
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 14, {
        animate: true,
      });
    }
  }, [userLocation, map]);

  // 2) Листаас төв сонгоход тухайн төв рүү шилжинэ
  useEffect(() => {
    if (selectedCenter) {
      map.flyTo([selectedCenter.lat, selectedCenter.lng], 15, {
        animate: true,
      });
    }
  }, [selectedCenter, map]);

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />

      {/* Хэрэглэгчийн байршил */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>Та энд байна</Popup>
        </Marker>
      )}

      {/* Тоглоомын төвүүд */}
      {gamingCenters.map((center) => (
        <Marker
          key={center.id}
          position={[center.lat, center.lng]}
          eventHandlers={{
            click: () => onCenterSelect && onCenterSelect(center),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm">{center.name}</h3>
              <p className="text-xs text-gray-600">{center.address}</p>
              <p className="text-xs text-gray-700">
                Тариф: {center.hourlyRate?.toLocaleString()} ₮ / цаг
              </p>
              <p className="text-xs text-gray-500">
                Ажиллах цаг: {center.working_hours}
              </p>
              <button
                onClick={() => onBookingClick && onBookingClick(center)}
                className="mt-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-700"
              >
                Захиалах
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
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
  const initialCenter = userLocation || DEFAULT_LOCATION;

  return (
    <LeafletMap
      center={[initialCenter.lat, initialCenter.lng]}
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
  );
};

export default MapContainer;
