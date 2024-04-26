import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../store/spots";
import {  NavLink, useNavigate } from "react-router-dom";


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
    <div className="spots">
      <h1>
        Manage Spots
      </h1>
      {isLoaded && spots.Spots.length ? (
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
                <h2 key={spot.name} className="spot-name">
                  {spot.name}
                </h2>
              </div>
              <div id="location-reviews"></div>
              <p
                key={spot.city}
                className="spot-location"
              >{`${spot.city}, ${spot.state}`}</p>
              {/* <img src="" alt="star-icon" id="star-icon" /> */}
              <p key={spot.rating} className="spot-rating">
     <b className="rating-nums"> {`${spot.avgRating !== undefined ? (Number.isInteger(spot.avgRating) ? spot.avgRating.toFixed(1) : spot.avgRating) : 'New'}`}
     </b>
</p>
              <p key={spot.price} className="spot-price">
                <b style={{ fontWeight: "bold" }}>{`$${spot.price}`}</b>{" "}
                <b style={{ fontSize: "9px" }}>/ night</b>
              </p>
            </NavLink>
            <div>
            <button onClick={() => updatingSpot(spot.id)}>
              Edit
            </button>
            </div>
            <div>
            <button>
              Delete
            </button>
            </div>
          </div>
        ))
      ) : (
        <button className="submit-sign-up" onClick={createNewSpot}>
          New Spot
        </button>
      )}
    </div>
  );
}

export default ManageSpots;
