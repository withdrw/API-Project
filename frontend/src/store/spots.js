// // import { csrfFetch } from "./csrf"

import { csrfFetch } from "./csrf";

// TYPES
const GET_SPOTS = "spots/GET_SPOTS";
const GET_SPOTS_ID = "spots/GET_SPOTS_ID";
const CREATE_SPOTS = "spots/CREATE_SPOTS";
const GET_SPOT = "spots/GET_SPOT";
const LOAD_SPOTS_USER = "spots/LOAD_SPOTS_USER";
const DELETE_SPOT = "spots/DELETE_SPOT";
const GET_REVIEWS = "GET_REVIEWS";
const CREATE_REVIEW = "CREATE_REVIEW";
const DELETE_REVIEW = "DELETE_REVIEW";
const ADD_IMAGES = "ADD_IMAGES";
const EDIT_SPOTS = "spots/EDIT_SPOTS";

// // ACTIONS

export const addImages = (image) => ({
  type: ADD_IMAGES,
  payload: image,
});

export const deleteReview = (reviewId) => ({
  type: DELETE_REVIEW,
  payload: reviewId,
});

export const spotReviews = (reviews) => ({
  type: GET_REVIEWS,
  payload: reviews,
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId,
});

// export const spotEdit = (spots) => ({
//   type: EDIT_SPOTS,
//   payload : spots
// })
export const spotEdit = (spots) => ({
  type: EDIT_SPOTS,
  payload: spots,
});

export const userSpots = (spots) => ({
  type: LOAD_SPOTS_USER,
  payload: spots,
});

export const getSpots = (spots) => ({
  type: GET_SPOTS,
  payload: spots,
});
export const getSpotsId = (spot) => ({
  type: GET_SPOTS_ID,
  payload: spot,
});
export const createSpots = (spot) => ({
  type: CREATE_SPOTS,
  payload: spot,
});
export const fetchSingleSpot = (spotId) => ({
  type: GET_SPOT,
  payload: spotId,
});

export const addReview = (review) => ({
  type: CREATE_REVIEW,
  payload: review,
});

export const addImage = (image) => ({
  type: ADD_IMAGES,
  payload: image,
});

// // THUNK

export const spotImages = (imageInfo, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(imageInfo),
  });
  if (response.ok) {
    const newImage = await response.json();
    dispatch(addImage(newImage));
  }
};

export const reviewDelete = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}/`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(deleteReview(reviewId));
    return;
  }
};

export const createReview = (userReview, spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify(userReview),
  });
  if (res.ok) {
    const newReview = await res.json();
    dispatch(addReview(newReview));
  }
};

export const fetchReviews = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  const reviews = await res.json();
  dispatch(spotReviews(reviews));
};

// export const spotDelete = (spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}`, {
//       method: 'DELETE'
//   });
//   if (response.ok) {
//       dispatch(deleteSpot(spotId));
//   }
// }

export const updateSpot = (spot) => async (dispatch) => {
  // await dispatch(getAllSpots());
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
    // passing spot.id but it didnt exist in spotDetails see createForm line 117
    method: "PUT",
    body: JSON.stringify(spot),
  });
  if (res.ok) {
    const spotUpdated = await res.json();
    dispatch(spotEdit(spotUpdated));
    return spotUpdated;
  }
};

// delete spot
export const spotDelete = (spotId) => async (dispatch) => {
  await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  await dispatch(getAllSpots());
  return;
};

//get the curr spots for user

export const loadUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  const spots = await res.json();
  dispatch(userSpots(spots));
};

// get SINGLE
export const getSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const spot = await response.json();
    dispatch(fetchSingleSpot(spot));
    return spot;
  } catch (error) {
    console.log(error);
  }
};

// creating a new spot

export const createNewSpot = (spotDetails) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spotDetails),
  });

  if (response.ok) {
    let spot = await response.json();
    dispatch(createSpots(spot));
    return spot;
  } else {
    const errors = await response.json();
    console.error(errors);
    return errors;
  }
};

export const addImageForSpot = (images, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(images),
  });
  if (response.ok) {
    const newImage = await response.json();
    dispatch(addImage(newImage));
    return newImage;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const getAllSpots = (spotId) => async (dispatch) => {
  if (!spotId) {
    const response = await csrfFetch("/api/spots");
    const spots = await response.json();
    dispatch(getSpots(spots));
    return response;
  } else {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const spot = await response.json();
    dispatch(getSpotsId(spot));
    return response;
  }
};

//REDUCERS

const initialState = {
  spots: {},
  oneSpot: { SpotImages: [] },
  getAll: {},
  // currentSpot: null
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SPOTS: {
      const newState = {};
      action.payload.Spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }
    case GET_SPOTS_ID: {
      // return {
      //   ...state,
      //   spotById: action.payload,
      // };
      const newState = { ...state };
      const spot = action.payload;
      newState.spotById = spot;
      return newState;
    }
    case GET_SPOT: {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    case CREATE_SPOTS:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    // case LOAD_SPOTS_USER: {
    //   const grabSpots = {};
    //   action.spots.forEach(spot => {
    //     grabSpots[spot.id] = spot
    //   })
    //   return { getAll: { ...grabSpots }, oneSpot: { ...grabSpots } }
    // }
    case LOAD_SPOTS_USER: {
      return {
        ...state,
        ["current"]: action.payload,
      };
    }
    case GET_REVIEWS: {
      const newState = { ...state };
      const allReviews = action.payload.Reviews;
      newState.reviews = allReviews;
      return newState;
    }
    case CREATE_REVIEW: {
      const newState = { ...state };

      return newState;
    }
    case ADD_IMAGES: {
      return { ...state, ...action.image };
    }
    // case EDIT_SPOTS: {
    //   const newState = { ...state };
    //   newState.allSpots[action.payload.id] = action.payload;
    //   return newState;
    // }
    default: {
      return state;
    }
  }
};

export default spotsReducer;
