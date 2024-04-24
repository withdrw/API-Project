// import { csrfFetch } from "./csrf"

import { csrfFetch } from "./csrf"

// TYPES
const GET_SPOTS = 'spots/GET_SPOTS'
const GET_SPOTS_ID = 'spots/GET_SPOTS_ID'
const CREATE_SPOTS = 'spots/CREATE_SPOTS'
// const ADD_IMAGES = 'ADD_IMAGES'


// ACTIONS

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
// export const addImage = (image) => ({
//   type: ADD_IMAGES,
//   payload : image
// })


// THUNK

export const createSpot = (spotDetails) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotDetails),
  });

  console.log("=====================")
  if (response.ok) {
    let spot = await response.json();
    if (spotDetails.images && spotDetails.images.length > 0) {
      await Promise.all(
        spotDetails.images.map(async (url, index) => {
          if (url.trim() !== "") {
            const imageResponse = await csrfFetch(`/api/spots/${spot.id}/images`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url, preview: index === 0 }),
            });
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              spot.SpotImages = spot.SpotImages || [];
              spot.SpotImages.push(imageData);
            }
          }
        })
      );
    }
    dispatch(createSpot(spot));
    return spot;
  } else {
    const errors = await response.json();
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
    spots : {}
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
      case CREATE_SPOTS:
  return {
    ...state,
    spot: action.payload
  };

      default: {
        return state;
      }
    }
}

export default spotsReducer
