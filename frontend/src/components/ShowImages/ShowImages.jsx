import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { getReviews } from "../../store/reviews";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";

function ShowImages() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const spot = useSelector((state) => state.spots.spotById);
  // const reviews = useSelector((state) => state.reviews.reviews);
  // const currUser = useSelector((state) => state.session.user?.id || 0);

  useEffect(() => {
    dispatch(getAllSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
    dispatch(getReviews(spotId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, spotId]);

  return (
    <div id="spotImages">
      {isLoaded && spot && (
        <div>
          <h1>{spot.name}</h1>
          <h2>
            Location {spot.city}, {spot.state}, {spot.country}
          </h2>
          <div id="newImages">
            {(spot.SpotImages ?? []).map((image, index) => (
              <img
                key={index}
                id={`image_${index + 1}`}
                src={image.url}
                alt={`image ${index + 1}`}
              />
            ))}
          </div>
          <div>
            <p>
              Hosted by:{spot?.Owner?.firstName} {spot?.Owner?.lastName}
            </p>
            <p>{spot.description}</p>
            <div id="detail-reviews-header">
              {spot.numReviews ? (
                spot.numReviews === 1 ? (
                  <p>
                    {spot.numReviews} Review ·{spot.avgStarRating.toFixed(1)}{" "}
                    Average Stars
                  </p>
                ) : (
                  <p>
                    {spot.numReviews} Reviews · {spot.avgStarRating} Average
                    Stars
                  </p>
                )
              ) : (
                <p>-- Average Stars</p>
              )}
            </div>

          </div>
          <div id="calloutBox">
            <p>${spot.price}.00 / Night</p>
            <div>{spot.numReviews}</div>
            <div id="reviews">
              {spot.numReviews ? (
                spot.numReviews === 1 ? (
                  <p>
                    {spot.numReviews} Review{spot.avgStarRating.toFixed(1)}
                    {""}
                    Average Stars
                  </p>
                ) : (
                  <p>
                    {spot.numReviews} Reviews · {spot.avgStarRating.toFixed(1)}
                    {""}
                    Average Stars
                  </p>
                )
              ) : (
                <p>Average Stars</p>
              )}
            </div>
            <button onClick={() => alert("Feature Coming Soon !")} id="reserve">
              Reserve
            </button>
          </div>
          <div>{spot.Reviews}</div>
        </div>
      )}
    </div>
  );
}

export default ShowImages;
