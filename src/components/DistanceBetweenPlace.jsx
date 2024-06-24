import { useState, useEffect } from "react";

export default function DistanceBetweenPlace({ start_coords, end_coords }) {
  const [totalDistance, setTotalDistance] = useState(0);

  const fetchDistance = async () => {
    try {
      const res = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${start_coords[1]},${start_coords[0]};${end_coords[1]},${end_coords[0]}`
      );
      const data = await res.json();
      setTotalDistance((data.routes[0].distance / 1000).toFixed(1));
    } catch (err) {
      console.log(err);
      setTotalDistance("ERR");
    }
  };

  useEffect(() => {
    fetchDistance();
  }, []);

  return (
    <p className="absolute top-[3.3rem] left-[25%] text-sm font-bold text-gray-500">
      {totalDistance} KM
    </p>
  );
}
