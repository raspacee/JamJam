import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Tooltip,
} from "react-leaflet";

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapModal({ modalRef, center }) {
  return (
    <dialog id="map_modal" ref={modalRef} className="modal">
      <div className="modal-box">
        <MapContainer
          center={center} // Initial map center coordinates
          zoom={15}
          style={{ height: "30rem", width: "100%" }}
        >
          <ChangeView center={center} zoom={15} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker key={center.toString()} position={center}>
            <Tooltip permanent>Bus Point Here!</Tooltip>
          </Marker>
        </MapContainer>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
