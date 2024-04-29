import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import "./ShowImage.css";

function ShowImages() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const spot = useSelector((state) => state.spots.spotById);
  const reviews = useSelector((state) => state.spots.reviews);
  const currUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getAllSpots(spotId)).then(() => {
      setIsLoaded(true);
    });
    dispatch(fetchReviews(spotId)).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch, spotId]);

  return (
    <div className="page-container">
      <div className="spotImages-container">
        {isLoaded && spot && (
          <div className="main">
            <h1 className="spot-images-name">{spot.name}</h1>
            <h2>
              Location {spot.city}, {spot.state}, {spot.country}
            </h2>
            <div className="image-grid">
              <div className="preview-image">
                {spot.SpotImages && spot.SpotImages.length > 0 && (
                  <img
                    id="preview"
                    src={spot.SpotImages[0].url}
                    alt={`image 1`}
                  />
                )}
              </div>
              <div className="other-images">
                {spot.SpotImages &&
                  spot.SpotImages.slice(1, 5).map((image, index) => (
                    <div key={index} className="other-image">
                      {image && image.url && (
                        <img
                          id="small-image"
                          src={image.url}
                          alt={`image ${index + 2}`}
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <p>
                Hosted by: {spot?.Owner?.firstName} {spot?.Owner?.lastName}
              </p>
              <p>{spot.description}</p>
              <div id="reviews-header">
                {spot.numReviews ? (
                  spot.numReviews === 1 ? (
                    <p>
                      {spot.numReviews} Review · ★
                      {spot.avgStarRating.toFixed(1)} Average Stars
                    </p>
                  ) : (
                    <p>
                      {spot.numReviews} Reviews · ★
                      {spot.avgStarRating.toFixed(1)} Average Stars
                    </p>
                  )
                ) : (
                  <p>-- Average Stars --</p>
                )}
              </div>

              <div className="review-list">
                {(!reviews || !reviews.length) && !currUser && (
                  <p>Be the first to post a review!</p>
                )}

                {currUser &&
                  spot?.Owner &&
                  currUser.id !== spot.Owner.id &&
                  reviews &&
                  !reviews.find((obj) => obj.userId === currUser.id) && (
                    <OpenModalButton
                      buttonText="Post Your Review"
                      modalComponent={<ReviewFormModal spotId={spot.id} />}
                    />
                  )}

                {reviews &&
                  Object.values(reviews)
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((review, index) => (
                      <div key={index}>
                        <p>Reviewer: {review.User.firstName}</p>
                        <p>
                          Date of review:{" "}
                          {new Date(review.createdAt).toLocaleString(
                            "default",
                            { month: "long", year: "numeric" }
                          )}
                        </p>
                        <p>Comments: {review.review}</p>
                        <p>Rating: {review.stars}</p>
                        {currUser && review.userId === currUser.id && (
                          <div id="delete">
                            <OpenModalButton
                              className="review-delete"
                              modalComponent={
                                <DeleteReviewModal
                                  reviewId={review.id}
                                  spotId={spotId}
                                />
                              }
                              buttonText={"Delete"}
                            />
                          </div>
                        )}
                        <p>-------------------------</p>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="callout-container">
        {isLoaded && spot && (
          <div className="calloutBox">
            <p>${spot.price}.00 / Night</p>

            <div id="reviews">
              {spot.numReviews ? (
                spot.numReviews === 1 ? (
                  <p>
                    {spot.numReviews} Review{spot.avgStarRating.toFixed(1)}{" "}
                    Average Stars
                  </p>
                ) : (
                  <p>
                    {spot.numReviews} Reviews · ★{spot.avgStarRating.toFixed(1)}{" "}
                    Average Stars
                  </p>
                )
              ) : (
                <p>Average Stars</p>
              )}
            </div>

            {currUser && (
              <button
                className="reserve-button"
                onClick={() => alert("Feature Coming Soon !")}
                id="reserve"
              >
                Reserve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowImages;
