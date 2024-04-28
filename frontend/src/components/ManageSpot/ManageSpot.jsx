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

  // const createNewSpot = () => {
  //   navigate("/spots/new");
  // };
  const updatingSpot = (spotId) => {
    navigate(`/spots/${spotId}/edit`)
  }


  return (
    <div>
      <h1>Manage Spots</h1>
      {isLoaded && spots && spots.Spots && spots.Spots.length ? (
        spots.Spots.map((spot) => (
          <div key={spot.id} className="edit-spots">
            <NavLink
              className="spot-tile"
              key={spot.id}
              to={`/spots/${spot.id}`}
            >
              <div className="tooltip">
                <img
                  className="preview-img"
                  key={spot.id}
                  src={spot.previewImage}
                  alt={`${spot.previewImage}`}
                />
                <h2 key={spot.name} className="name">
                  {spot.name}
                </h2>
              </div>
              <div id="reviews"></div>
              <p
                key={spot.city}
                className="location"
              >{`${spot.city}, ${spot.state}`}</p>
              {spot.avgRating !== null && spot.avgRating !== undefined && (
                <p key={spot.rating} className="rating">
                  <b className="rating-nums">{`${
                    Number.isInteger(spot.avgRating)
                      ? spot.avgRating.toFixed(1)
                      : spot.avgRating
                  }`}</b>
                </p>
              )}
              <p key={spot.price} className="price">
                <b>{`$${spot.price}`}</b> <b>/ night</b>
              </p>
            </NavLink>
            <div>
              <button onClick={() => updatingSpot(spot.id)}>Update</button>
            </div>
            <OpenModalButton
              buttonText="Delete"
              modalComponent={<DeleteSpot spotId={spot.id} />}
            />
          </div>
        ))
      ) : (
        <NavLink to="/spots/new">Create a New Spot</NavLink>
      )}
    </div>
  );
}

export default ManageSpots;
