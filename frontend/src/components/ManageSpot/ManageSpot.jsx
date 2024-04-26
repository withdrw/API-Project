import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../store/spots";
import {  NavLink, useNavigate } from "react-router-dom";
import DeleteSpot from "./DeleteSpot";
import OpenModalButton from '../OpenModalButton'


function ManageSpots() {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const spots = useSelector((state) => state.spots.current);
  console.log(spots);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(loadUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  const createNewSpot = () => {
    navigate("/spots/new");
  };
  const updatingSpot = (spotId) => {
    navigate(`/spots/${spotId}/edit`)
  }


  return (
    <div>
      <h1>Manage Spots</h1>
      {isLoaded && spots.Spots.length ? (
        spots.Spots.map((spot) => (
          <div key={spot.id}>
            <NavLink key={spot.id} to={`/spots/${spot.id}`}>
              <div>
                <img
                  key={spot.id}
                  src={spot.previewImage}
                  alt={`${spot.previewImage}`}
                />
                <h2 key={spot.name}>{spot.name}</h2>
              </div>
              <div></div>
              <p key={spot.city}>{`${spot.city}, ${spot.state}`}</p>
              <p key={spot.rating}>
                <b>
                  {" "}
                  {`${
                    spot.avgRating !== undefined
                      ? Number.isInteger(spot.avgRating)
                        ? spot.avgRating.toFixed(1)
                        : spot.avgRating
                      : "New"
                  }`}
                </b>
              </p>
              <p key={spot.price}>
                <b>{`$${spot.price}`}</b> <p>/ night</p>
              </p>
            </NavLink>
            <div>
              <button onClick={() => updatingSpot(spot.id)}>Edit</button>
            </div>
            <OpenModalButton
              buttonText="Delete"
              modalComponent={<DeleteSpot spotId={spot.id} />}
            />
          </div>
        ))
      ) : (
        <button className="signup" onClick={createNewSpot}>
          New Spot
        </button>
      )}
    </div>
  );
}

export default ManageSpots;
