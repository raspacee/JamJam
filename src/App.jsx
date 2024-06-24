import { useRef, useState, useMemo, useEffect, Fragment } from "react";
import "./App.css";
import Logo from "./assets/logo.gif";
import monocle from "./assets/monocle.png";
import { useSelector, useDispatch } from "react-redux";
import { changeInput } from "./slice";
import { get_all_locations } from "./map/routes";
import { get_route } from "./map/dikstra-fixed";
import { capitalizeFirstLetter } from "./map/helper";
import { get_coords } from "./map/get_coords";
import MapModal from "./components/MapModal";
import "leaflet/dist/leaflet.css";
import DistanceBetweenPlace from "./components/DistanceBetweenPlace";
import openMapImg from "./assets/open-map.png";

const Modal = ({ modalRef, forSource, allLocations }) => {
  const dispatch = useDispatch();
  const userInput = useSelector((state) => state.userInput);

  const [query, setQuery] = useState(
    forSource ? userInput.source : userInput.destination
  );
  const [filteredLocations, setFilteredLocations] = useState(allLocations);

  const changeValue = (value) => {
    if (forSource) {
      dispatch(changeInput({ key: "source", value }));
      setQuery(value);
    } else {
      dispatch(changeInput({ key: "destination", value }));
      setQuery(value);
    }
  };

  return (
    <dialog id="my_modal_2" ref={modalRef} className="modal">
      <div className="modal-box">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder={forSource ? "Choose Source" : "Choose Destination"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              const newLocations = allLocations.filter((location) =>
                location.toLowerCase().includes(query.toLowerCase())
              );
              setFilteredLocations(newLocations);
            }}
          />
        </label>
        <div className="max-h-[24rem] h-[24rem] overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Location Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location) => {
                return (
                  <tr key={location}>
                    <td onClick={() => changeValue(location)}>{location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

const INFO_STATES = {
  INITIAL: 0,
  LOADING: 1,
  FAILED: 2,
  FOUND: 3,
};

function App() {
  const sourceModalRef = useRef(null);
  const destinationModalRef = useRef(null);
  const mapModalRef = useRef(null);
  const userInput = useSelector((state) => state.userInput);
  const [infoState, setInfoState] = useState(INFO_STATES.INITIAL);
  const [prompts, setPrompts] = useState([]);
  const [colors, setColors] = useState([
    "primary",
    "secondary",
    "accent",
    "warning",
  ]);
  const [pointCoordinates, setPointsCoordinates] = useState([0, 0]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [fare, setFare] = useState(0);

  const allLocations = useMemo(() => get_all_locations(), []);

  const openSourceModal = () => {
    sourceModalRef.current.showModal();
  };

  const openDestinationModal = () => {
    destinationModalRef.current.showModal();
  };

  const openMapModal = () => {
    mapModalRef.current.showModal();
  };

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getRoute = async () => {
    if (userInput.source != "" && userInput.destination != "") {
      setColors(["primary", "secondary", "accent", "warning"]);
      setInfoState(INFO_STATES.LOADING);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const routes = await get_route(
        userInput.source.toLowerCase(),
        userInput.destination.toLowerCase()
      );
      if (routes == undefined) setInfoState(INFO_STATES.FAILED);
      else {
        setPrompts(routes.prompts);
        try {
          let tmpFare = 0;
          for (let i = 0; i < routes.prompts.length; i++) {
            const dist = await fetchDistance(
              routes.prompts[i].startAndEnd.startLocation,
              routes.prompts[i].startAndEnd.endLocation,
              false
            );
            console.log(dist);
            if (dist > 10) tmpFare += 30;
            else if (dist > 5) tmpFare += 25;
            else tmpFare += 20;
          }
          setFare(tmpFare);
        } catch (err) {
          setFare(20);
        }
        setInfoState(INFO_STATES.FOUND);
      }
    }
  };

  const fetchDistance = async (source, destination, setTotalDist = false) => {
    try {
      if (source == "" || destination == "") return;
      const start_coords = get_coords(source);
      const end_coords = get_coords(destination);
      const res = await fetch(
        `http://router.project-osrm.org/route/v1/driving/${start_coords[1]},${start_coords[0]};${end_coords[1]},${end_coords[0]}`
      );
      const data = await res.json();
      if (setTotalDist)
        setTotalDistance((data.routes[0].distance / 1000).toFixed(1));
      return (data.routes[0].distance / 1000).toFixed(1);
    } catch (err) {
      console.log(err);
      setTotalDistance("ERR");
    }
  };

  useEffect(() => {
    fetchDistance(userInput.source, userInput.destination, true);
  }, [prompts]);

  return (
    <div className="w-full min-h-100vh flex flex-col justify-center items-center py-3">
      <header className="flex items-center">
        <img src={Logo} />
        <h1 className="text-5xl font-bold">JamJam</h1>
      </header>

      <div className="w-full flex flex-col justify-around items-center py-3">
        <button
          className="btn btn-wide mt-4 mb-2"
          onClick={() => {
            openSourceModal();
          }}
        >
          {userInput.source == "" ? "Choose Source" : userInput.source}
        </button>
        <button
          className="btn btn-wide mb-3"
          onClick={() => {
            openDestinationModal();
          }}
        >
          {userInput.destination == ""
            ? "Choose Destination"
            : userInput.destination}
        </button>
        <button className="btn btn-primary mt-3" onClick={getRoute}>
          Get Route 🚀
        </button>
      </div>

      <Modal
        forSource={true}
        modalRef={sourceModalRef}
        allLocations={allLocations}
      />
      <Modal
        forSource={false}
        modalRef={destinationModalRef}
        allLocations={allLocations}
      />

      <div className="divider">Hmm...</div>

      <div className="w-full py-3">
        {infoState == INFO_STATES.INITIAL && (
          <div className="w-full flex flex-col justify-center items-center">
            <img src={monocle} />
            <p className="text-lg font-normal">
              Try searching routes from above
            </p>
          </div>
        )}
        {infoState == INFO_STATES.FAILED && (
          <div className="w-full flex flex-col justify-center items-center">
            <p>Route not found</p>
          </div>
        )}
        {infoState == INFO_STATES.LOADING && (
          <div className="w-full flex flex-col justify-center items-center">
            <span className="loading loading-infinity loading-lg text-primary"></span>
          </div>
        )}
        {infoState == INFO_STATES.FOUND && (
          <div className="w-full flex flex-col justify-center items-center">
            <div className="stats shadow-lg">
              <div className="stat place-items-center">
                <div className="stat-title">Total Distance</div>
                <div className="stat-value">{totalDistance} KM</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Estimated Fare</div>
                <div className="stat-value text-secondary">RS {fare}</div>
              </div>
            </div>

            <p className="mt-2 font-bold">Follow this route!</p>
            <ul className="steps steps-vertical">
              {prompts &&
                prompts.map((prompt, i) => {
                  const color = getRandomColor();
                  const startCoord = get_coords(
                    prompt.startAndEnd.startLocation
                  );
                  const endCoord = get_coords(prompt.startAndEnd.endLocation);
                  if (i != prompts.length - 1) {
                    return (
                      <Fragment key={i}>
                        <li className={`step step-${color} relative`}>
                          <span className="flex items-center">
                            {capitalizeFirstLetter(
                              prompt.startAndEnd.startLocation
                            )}
                            <img
                              src={openMapImg}
                              onClick={() => {
                                setPointsCoordinates(startCoord);
                                openMapModal();
                              }}
                              style={{ width: 28, height: 28 }}
                            />
                          </span>
                          <DistanceBetweenPlace
                            start_coords={startCoord}
                            end_coords={endCoord}
                          />
                        </li>
                        <li className={`step step-${color}`}>
                          <span className="flex items-center">
                            {capitalizeFirstLetter(
                              prompt.startAndEnd.endLocation
                            )}
                            <img
                              src={openMapImg}
                              onClick={() => {
                                setPointsCoordinates(endCoord);
                                openMapModal();
                              }}
                              style={{ width: 28, height: 28 }}
                            />
                          </span>
                        </li>
                        <li className="step">Get Off</li>
                      </Fragment>
                    );
                  } else {
                    return (
                      <Fragment key={i}>
                        <li className={`step step-${color} relative`}>
                          <span className="flex items-center">
                            {capitalizeFirstLetter(
                              prompt.startAndEnd.startLocation
                            )}
                            <img
                              src={openMapImg}
                              onClick={() => {
                                setPointsCoordinates(startCoord);
                                openMapModal();
                              }}
                              style={{ width: 28, height: 28 }}
                            />
                          </span>
                          <DistanceBetweenPlace
                            start_coords={startCoord}
                            end_coords={endCoord}
                          />
                        </li>
                        <li className={`step step-${color}`}>
                          <span className="flex items-center">
                            {capitalizeFirstLetter(
                              prompt.startAndEnd.endLocation
                            )}
                            <img
                              src={openMapImg}
                              onClick={() => {
                                setPointsCoordinates(endCoord);
                                openMapModal();
                              }}
                              style={{ width: 28, height: 28 }}
                            />
                          </span>
                        </li>
                      </Fragment>
                    );
                  }
                })}
            </ul>
            <MapModal modalRef={mapModalRef} center={pointCoordinates} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
