// import { csrfFetch } from "./csrf"

import { csrfFetch } from "./csrf"

// TYPES
const GET_SPOTS = 'spots/GET_SPOTS'
const GET_SPOTS_ID = 'spots/GET_SPOTS_ID'
const CREATE_SPOTS = 'spots/CREATE_SPOTS'
const GET_SPOT = 'spots/GET_SPOT'
const LOAD_SPOTS_USER = 'spots/LOAD_SPOTS_USER'

// const ADD_IMAGES = 'ADD_IMAGES'


// ACTIONS

export const userSpots = (spots) => ({
  type: LOAD_SPOTS_USER,
  payload : spots
})

export const getSpots = (spots) =>  ({
    type : GET_SPOTS,
    payload : spots
})
export const getSpotsId = (spot) =>  ({
    type : GET_SPOTS_ID,
    payload : spot
})
export const createSpots = (spot) => ({
    type: CREATE_SPOTS,
    payload : spot
})
export const fetchSingleSpot = (spotId) => ({
  type: GET_SPOT,
  payload : spotId
})


// THUNK

// get the curr spots for user

export const loadUser = () => async (dispatch) => {
  const res = await csrfFetch('/api/spots/current')
  const spots = await res.json()
  dispatch(userSpots(spots))
}


// get SINGLE
export const getSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const spot = await response.json();
    dispatch(fetchSingleSpot(spot));
    return response;
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
    // if (spotDetails.images && spotDetails.images.length > 0) {
    //       // if (url.trim() !== "") {
    //       //   const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
    //       //     method: "POST",
    //       //     body: JSON.stringify({ url, preview: index === 0 }),
    //       //   });
    //       //   if (imageResponse.ok) {
    //       //     const imageData = await imageResponse.json();
    //       //     spot.SpotImages = spot.SpotImages || [];
    //       //     spot.SpotImages.push(imageData);
    //       //   }
    //       // }
    // }
    dispatch(createSpots(spot));
    return spot;
  } else {
    const errors = await response.json();
    console.error(errors)
    return errors
  }
};


// export const addImageForSpot = (images, spotId) => async (dispatch) => {
//   const response = await csrfFetch(`/api/spots/${spotId}/images`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(images),
//   });
//   if (response.ok) {
//     const newImage = await response.json();
//     dispatch(addImage(newImage));
//     return newImage;
//   } else {
//     const errors = await response.json();
//     return errors;
//   }
// }
export const getAllSpots = (spotId) => async (dispatch) => {

    if (!spotId) {
        const response =  await csrfFetch("/api/spots");
        const spots = await response.json()
        dispatch(getSpots(spots))
        return response
    } else {
        const response = await csrfFetch(`/api/spots/${spotId}`)
        const spot = await response.json()
        dispatch(getSpotsId(spot));
        return response
    }
}

//REDUCERS

const initialState = {
  spots: {},
  oneSpot: {SpotImages : []},
  getAll : {}
  // currentSpot: null
}

const spotsReducer = (state = initialState , action) => {
    switch (action.type) {
      case GET_SPOTS: {
        const newState = { ...state };
        action.payload.Spots.forEach((spot) => {
          newState[spot.id] = spot;
        });
        return newState;
      }
      case GET_SPOTS_ID: {
        return {
          ...state,
          spotById: action.payload,
        };
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
          [action.payload.id] : action.payload,
        };
      case LOAD_SPOTS_USER: {
        const grabSpots = {};
        action.spots.forEach(spot => {
          grabSpots[spot.id] = spot
        })
        return { getAll: { ...grabSpots }, oneSpot: { ...grabSpots } }
      }

      default: {
        return state;
      }
    }
}

export default spotsReducer
