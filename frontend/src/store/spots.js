// TYPES
const GET_SPOTS = 'GET_SPOTS'
const GET_SPOTS_ID = 'GET_SPOTS_ID'
const CREATE_SPOTS = 'CREATE_SPOTS'


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

// THUNK

export const createNewSpot =
  (spot, valErrors, images) => async (dispatch) => {
    let res;

    if (Object.keys(valErrors).length > 0) {
      res = await fetch("/api/spots", {
        method: "POST",
        headers: {
          errors: JSON.stringify(valErrors),
        },
        body: JSON.stringify(spot),
      });
    } else {
      res = await fetch("/api/spots", {
        method: "POST",
        body: JSON.stringify(spot),
      });
    }

    if (res.ok) {
      const data = await res.json();
      dispatch(createNewSpot(data));

      Object.values(images).forEach(async (img) => {
        if (img) {
          await fetch(`/api/spots/${data.id}/images`, {
            method: "POST",
            body: JSON.stringify({
              url: img,
            }),
          });
        }
      });

      return data;
    }

    return res;
  };

export const getAllSpots = (spotId) => async (dispatch) => {

    if (!spotId) {
        const response =  await fetch("/api/spots");
        const spots = await response.json()
        dispatch(getSpots(spots))
        return response
    } else {
        const response = await fetch(`/api/spots/${spotId}`)
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
            const newState = { ...state }
            action.payload.Spots.forEach((spot) => {
                newState[spot.id] = spot
            })
            return newState
        }
        case GET_SPOTS_ID: {
            return {
                ...state,
                spotById: action.payload
            }
            }
        default: {
            return state
        }
    }
}

export default spotsReducer
