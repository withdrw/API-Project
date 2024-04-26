

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews } from "../../store/spots";
import OpenModalButton from "../OpenModalButton";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
//import OpenModalButton from "../OpenModalButton/OpenModalButton";

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
            <div id="reviews-header">
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
                <p>-- Average Stars --</p>
              )}
            </div>
          </div>
          <div id="calloutBox">
            <p>${spot.price}.00 / Night</p>
            {/* <div>{spot.numReviews}</div> */}
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
            {/* <div className='review-list'>
              {!reviews.length && currUser && currUser.id !== spot.Owner.id ?
              (<><p>Be the first to post a review!</p>
                  <OpenModalButton buttonText="Post Your Review" modalComponent={<ReviewFormModal spotId={spot.id} />}/></>) :
                  (<>
                     <p className="reviews-sublist">Reviews:</p>
                      {currUser && currUser.id !== spot.Owner.id && !reviews.find(obj => obj.userId === currUser.id) &&
                      <OpenModalButton buttonText="Post Your Review" modalComponent={<ReviewFormModal spotId={spot.id}/>}/>}
                            {Object.values(reviews)
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((review, index) => (
                              <div key={index}>
                                  <p>Reviewer: {review.User.firstName}</p>
                                  <p>Date of review: {new Date(review.createdAt).toLocaleString("default", { month: "long", year: "numeric" })}</p>
                                  <p>Comments: {review.review}</p>
                                  <p>Rating: {review.stars}</p>
                                  <p>-------------------------</p>
                              </div>
                            ))}
                        </>
                      )}
              </div> */}
            <div className="review-list">
              {!reviews.length && currUser && currUser.id !== spot.Owner.id ? (
                <>
                  <p>Be the first to post a review!</p>
                  <OpenModalButton
                    buttonText="Post Your Review"
                    modalComponent={<ReviewFormModal spotId={spot.id} />}
                  />
                </>
              ) : (
                <>
                  <p className="reviews-sublist">Reviews:</p>
                  {currUser &&
                    currUser.id !== spot.Owner.id &&
                    !reviews.find((obj) => obj.userId === currUser.id) && (
                      <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<ReviewFormModal spotId={spot.id} />}
                      />
                    )}
                  {Object.values(reviews)
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
                        {review.userId === currUser.id && (
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
                </>
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
