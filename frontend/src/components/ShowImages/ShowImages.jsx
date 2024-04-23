import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";

function ShowImages() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const spot = useSelector((state) => state.spots.spotById);

  useEffect(() => {
    dispatch(getAllSpots(spotId)).then(() => {
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
        <div id="newImages" >
          <img id="mainImage" src={spot.SpotImages[0].url} alt="image 1" />
          <img id="smallImage" src={spot.SpotImages[1].url} alt="image 2" />
          <img id="smallImage" src={spot.SpotImages[2].url} alt="image 3" />
          <img id="smallImage" src={spot.SpotImages[3].url} alt="image 4" />
          <img id="smallImage" src={spot.SpotImages[4].url} alt="image 5" />
        </div>
        <div>
          <p>
            Hosted by:{spot.Owner.firstName} {spot.Owner.lastName}
          </p>
          <p>{spot.description}</p>
        </div>
        <div id="calloutBox">
          <p>${spot.price}.00 / Night</p>
          <div>
            {spot.numReviews}
          </div>
          <button onClick={() => alert("Feature Coming Soon !")} id="reserve">
            Reserve
          </button>
        </div>
        <div>
          {spot.Reviews}
        </div>
      </div>
    )}
  </div>
);
}

export default ShowImages;
