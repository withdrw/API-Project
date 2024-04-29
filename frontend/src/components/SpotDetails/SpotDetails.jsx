import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spots";
import { NavLink } from "react-router-dom";
import "./SpotDetail.css";

function SpotDetails() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const spots = useSelector((state) => state.spots);

  useEffect(() => {
    dispatch(getAllSpots()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <div className="NewSpotDetails">
      {isLoaded &&
        spots &&
        Object.values(spots).map(
          (spot) =>
            spot.id && (
              <NavLink
                key={spot.id}
                to={`/spots/${spot.id}`}
                className="spot-card"
                title={spot.name} // Tooltip with the name of the spot
              >
                <img
                  className="spot-image"
                  id="previewImage"
                  src={`${spot.previewImage}`}
                  alt={`${spot.name} Preview Image`}
                />
                <div className="all-card">
                <p className="spot-city">{spot.city}</p>
                <p className="spot-city">{spot.state}</p>
                <p className="spot-price">{`$${spot.price}.00`} / Night</p>
                <p className="spot-rating">
                  ★{" "}
                  {spot.avgRating
                    ? Number.isInteger(spot.avgRating)
                    ? spot.avgRating.toFixed(1)
                    : spot.avgRating
                    : "New"}
                </p>
                    </div>
              </NavLink>
            )
        )}
    </div>
  );
}

export default SpotDetails;
