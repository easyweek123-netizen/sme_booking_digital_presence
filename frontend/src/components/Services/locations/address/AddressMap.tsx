import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = icon;

function Recentre({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude]);
  }, [map, latitude, longitude]);
  return null;
}

function ClickHandler({ onPinChange }: { onPinChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPinChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function DraggableMarker({
  latitude,
  longitude,
  onPinChange,
}: {
  latitude: number;
  longitude: number;
  onPinChange: (lat: number, lng: number) => void;
}) {
  return (
    <Marker
      position={[latitude, longitude]}
      draggable
      eventHandlers={{
        dragend(e) {
          const { lat, lng } = (e.target as L.Marker).getLatLng();
          onPinChange(lat, lng);
        },
      }}
    />
  );
}

export interface AddressMapProps {
  latitude: number;
  longitude: number;
  label?: string;
  onPinChange?: (lat: number, lng: number) => void;
}

export function AddressMap({ latitude, longitude, label, onPinChange }: AddressMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '220px', width: '100%', borderRadius: '12px' }}
      aria-label={label ?? 'Service location map'}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Recentre latitude={latitude} longitude={longitude} />
      {onPinChange ? (
        <>
          <ClickHandler onPinChange={onPinChange} />
          <DraggableMarker latitude={latitude} longitude={longitude} onPinChange={onPinChange} />
        </>
      ) : (
        <Marker position={[latitude, longitude]} />
      )}
    </MapContainer>
  );
}
