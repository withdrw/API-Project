// import React from 'react'

import { useEffect, useState } from "react"

function CreateForm() {

    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [address, setAddress] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")



    return (
      <div>
        <form>
          <div>
            <h1>CREATE A SPOT</h1>
            <h1> Wheres your place located ? </h1>
            <p>
              Guests will only get your exact address once they booked a
              reservation
            </p>
          </div>
          <div id="allSpots">
            <label>Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="country"
            ></input>
          </div>
          <div id="allSpots">
            <label>Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
            ></input>
          </div>
          <div id="allSpots">
            <label>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="state"
            ></input>
          </div>
          <div id="allSpots">
            <label>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="city"
            ></input>
          </div>
          <div>
            <h3>Describe your place to guests</h3>
            <p>
              Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood
            </p>
          </div>
        </form>
      </div>
    );
}

export default CreateForm
