// import React from 'react'

import { useState } from "react"
import { useDispatch } from "react-redux"
import { createSpots } from "../../store/spots"
// import { useNavigate } from "react-router-dom"
// import { getAllSpots } from "../../store/spots"

function CreateForm() {

    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [address, setAddress] = useState("")
    const [price, setPrice] = useState("")
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [image1 ,setImage1] = useState("")
    const [image2 ,setImage2] = useState("")
    const [image3 ,setImage3] = useState("")
    const [image4 ,setImage4] = useState("")
    const [image5,setImage5] = useState("")
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({});
    // const [isLoaded, setIsLoaded] = useState(false);
    // const navigate = useNavigate()
    // const spot = useSelector((state) => state.spots.spotById);


  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!country) newErrors.country = 'Country is required';
    if (!address) newErrors.address = 'Street address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!description) newErrors.description = 'Description is required';
    if (description.length < 30) newErrors.description = 'Description must be at least 30 characters';
    if (!name) newErrors.name = 'Name is required';
    if (!price) newErrors.price = 'Price is required';
    if (!image1) newErrors.image1 = 'Image 1 is required';
    if (!image2) newErrors.image2 = 'Image 2 is required';
    if (!image3) newErrors.image3 = 'Image 3 is required';
    if (!image4) newErrors.image4 = 'Image 4 is required';
    if (!image5) newErrors.image5 = 'Image 5 is required';
    setErrors(newErrors);


    if (Object.keys(newErrors).length === 0) {
      const images = [image1, image2, image3, image4, image5].filter(url => url.trim() !== "");
      if (images.length === 0) {
        newErrors.image1 = 'At least one image is required';
        setErrors(newErrors);
        return;
      }
    }



    let images = [image1, image2, image3, image4, image5];
    const spotDetails = {
          country,
          address,
          city,
          state,
          description,
          name,
          price,
          images,
      };


    const spotResponse = await dispatch(createSpots(spotDetails));

    // await Promise.all(
    //   images.map(async (image, index) => {
    //     if (image !== null) {
    //       let imageData = {
    //         url: image,
    //         preview: index === 0,
    //       };
    //       await dispatch(addImageForSpot(imageData, spotResponse.id));
    //     }
    //   })
    // );
    console.log('================',spotResponse.id)
    // navigate(`/spots/${spotResponse.id}`)
  };
    return (
      <div>
        {
          <form id="spotForm" onSubmit={handleSubmit}>
            <div>
              <h1>CREATE A SPOT</h1>
              <p> Wheres your place located ? </p>
              <p>
                Guests will only get your exact address once they booked a
                reservation
              </p>
            </div>
            <div id="allSpots">
              <label>Country</label>
              <p>{errors.country}</p>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="country"
              ></input>
            </div>
            <div id="allSpots">
              <label>Street Address</label>
              <p>{errors.address}</p>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
              ></input>
            </div>
            <div id="allSpots">
              <label>State</label>
              <p>{errors.state}</p>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="state"
              ></input>
            </div>
            <div id="allSpots">
              <label>City</label>
              <p>{errors.city}</p>
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
                Mention the best features of your space, any special amenities
                like fast wifi or parking, and what you love about the
                neighborhood.
              </p>
              <textarea
                rows={5}
                cols={25}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={"Please write at least 30 characters"}
              />
              <p>{errors.description}</p>
            </div>
            <div>
              <h3> Create a title for your spot</h3>
              <p>
                Catch guest&apos;s attention with a spot title that highlights
                what makes your place special.
              </p>
              <input
                rows={1}
                cols={15}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={"Name of your spot"}
              />
              <p>{errors.name}</p>
            </div>
            <div>
              <h3>Set a base price for your spot</h3>
              <p>
                Competitive pricing can help your listing stand out and rank
                higher in search results.
              </p>
              $
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={"Price per night (USD)"}
              />
              <p>{errors.price}</p>
            </div>
            <div>
              <h3>Liven up your spot with photos</h3>
              <p>Submit a link to at least one photo to publish your spot</p>
              <div>
                <input
                  value={image1}
                  onChange={(e) => setImage1(e.target.value)}
                  placeholder="Preview Image URL"
                />
                <p>{errors.image1}</p>
              </div>
              <div>
                <input
                  value={image2}
                  onChange={(e) => setImage2(e.target.value)}
                  placeholder="Image URL"
                />
                <p>{errors.image2}</p>
              </div>
              <div>
                <input
                  value={image3}
                  onChange={(e) => setImage3(e.target.value)}
                  placeholder="Image URL"
                />
                <p>{errors.image3}</p>
              </div>
              <div>
                <input
                  value={image4}
                  onChange={(e) => setImage4(e.target.value)}
                  placeholder="Image URL"
                />
                <p>{errors.image4}</p>
              </div>
              <div>
                <input
                  value={image5}
                  onChange={(e) => setImage5(e.target.value)}
                  placeholder="Image URL"
                />
                <p>{errors.image5}</p>
              </div>
            </div>
            <div>
              <button>Create Spot</button>
            </div>
          </form>
        }
      </div>
    );
}

export default CreateForm
