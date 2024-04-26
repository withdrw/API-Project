// import React from 'react'

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getAllSpots } from "../../store/spots"
import { NavLink } from "react-router-dom"
import  './SpotDetail.css'

function SpotDetails() {
  const dispatch = useDispatch()
  const [isLoaded,setIsLoaded] = useState(false)
  const spots  = useSelector((state) => state.spots)

  useEffect(() => {
    dispatch(getAllSpots()).then(() => {
      setIsLoaded(true)
    })
  },[dispatch])
  console.log("SPOTS",spots)




  return (
    <div className="NewSpotDetails">
    {isLoaded &&
      spots &&
      Object.values(spots).map(
        (spot) =>
        spot.id && (
            <NavLink  key={spot.id} to={`/spots/${spot.id}`} className="spot-card">
              <img
                className="spot-image"
                id="previewImage"
                src={spot.previewImage}
              alt={`${spot.name}Preview Image`}></img>
              {/* <h2 className="spot-name" key={spot.name}>{spot.name}</h2> */}
              {/* <p className="spot-description"> {spot.description}</p> */}
              <p className="spot-city">{spot.city}</p>
              <p className="spot-city">{spot.state}</p>
              <p className="spot-price">{`$${spot.price}.00`} / Night </p>
              {/* <p className="spot-rating">★ {Number.isInteger(spot.avgRating) ? spot.avgRating.toFixed(1) : spot.avgRating}</p> */}
<p className="spot-rating">
                    ★ {spot.avgRating ?
                    (Number.isInteger(spot.avgRating) ? spot.avgRating.toFixed(1) : spot.avgRating)
                    : "New"}
              </p>
            </NavLink>
          ),
        )}
  </div>
);
}

export default SpotDetails
