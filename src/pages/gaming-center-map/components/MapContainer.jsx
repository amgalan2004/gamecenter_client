import React, { useEffect } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Marker дүрсний замыг засах
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ✅ Custom user marker
const userIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-pink.png",
  shadowUrl: markerShadow,
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -35],
});

const DEFAULT_LOCATION = { lat: 47.918873, lng: 106.917701 };

// 🌍 Газрын зураг фокус тохируулагч
const MapAutoFocus = ({ selectedCenter }) => {
  const map = useMap();
  useEffect(() => {
    if (selectedCenter) {
      map.flyTo([selectedCenter.lat, selectedCenter.lng], 14, { animate: true });
    }
  }, [selectedCenter, map]);
  return null;
};

const MapWrapper = ({ gamingCenters, userLocation, selectedCenter, onBookingClick }) => {
  return (
    <>
      {/* Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />

      {/* User Marker */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>📍 Та энд байна</Popup>
        </Marker>
      )}

      {/* Centers */}
      {gamingCenters.map((center) => (
        <Marker
          key={center.id}
          position={[center.lat, center.lng]}
          eventHandlers={{
            click: () => console.log("Clicked:", center.name),
          }}
        >
          <Popup>
            <div className="text-sm space-y-1">
              <h3 className="font-semibold text-blue-600">{center.name}</h3>
              <p className="text-gray-600">{center.address}</p>
              <p className="text-gray-700">💰 {center.hourlyRate}₮ / цаг</p>
              <button
                onClick={() => onBookingClick(center)}
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700"
              >
                Захиалах
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Focus */}
      <MapAutoFocus selectedCenter={selectedCenter} />
    </>
  );
};

const MapContainer = ({ gamingCenters, userLocation, selectedCenter, onBookingClick }) => {
  const centerPosition = userLocation || DEFAULT_LOCATION;

  return (
    <LeafletMap
      center={[centerPosition.lat, centerPosition.lng]}
      zoom={13}
      className="h-full w-full"
      style={{ zIndex: 0 }}
    >
      <MapWrapper
        gamingCenters={gamingCenters}
        userLocation={userLocation}
        selectedCenter={selectedCenter}
        onBookingClick={onBookingClick}
      />
    </LeafletMap>
  );
};

export default MapContainer;
