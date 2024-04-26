import { csrfFetch } from "./csrf";

const SHOW_REVIEW = "SHOW_REVIEW";

export const loadReviews = (reviews) => ({
  type: SHOW_REVIEW,
  payload: reviews,
});

export const getReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  const reviews = await res.json();
  dispatch(loadReviews(reviews));
  return res;
};

export const getCurrent = () => async (dispatch) => {
  const res = await fetch(`/api/spots/reviews/current`);
  const reviews = await res.json();
  dispatch(loadReviews(reviews));
  return res;
};

const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case SHOW_REVIEW: {
      const newState = { ...state, reviews: {} };
      if (action.payload && action.payload.Reviews) {
        action.payload.Reviews.forEach((review) => {
          newState.reviews[review.id] = review;
        });
      }
      return newState;
    }
    default:
      return state;
  }
};

export default reviewsReducer;
