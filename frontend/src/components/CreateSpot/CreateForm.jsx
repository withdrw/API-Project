// import React from 'react'

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { createNewSpot, getAllSpots, getSpot, updateSpot } from "../../store/spots"
import { useNavigate, useParams } from "react-router-dom"
// import { getAllSpots } from "../../store/spots"

function CreateForm() {
    const {spotId} = useParams()
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
  const [image5, setImage5] = useState("")
    const dispatch = useDispatch()
    const [errors, setErrors] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    // const spot = useSelector((state) => state.spots.spotById);
    const navigate = useNavigate()

  const [formType, setFormType] = useState("")
  const [isSubmitted,setIsSubmitted] = useState(false)

  useEffect(() => {
    if (spotId) {
      dispatch(getSpot(spotId)).then((spot) => {
        setAddress(spot.address || "");
        setCity(spot.city || "");
        setState(spot.state || "");
        setCountry(spot.country || "");
        setName(spot.name || "");
        setDescription(spot.description || "");
        setPrice(spot.price || "");
        setFormType("update");
        setIsLoaded(true);
      });
    } else {
      dispatch(getAllSpots()).then(() => {
        setAddress("");
        setCity("");
        setState("");
        setCountry("");
        setName("");
        setDescription("");
        setPrice(0);
        setFormType("create");
        setIsLoaded(true);
      });
    }
  }, [dispatch, spotId, formType]);

console.log("------------------------------",getSpot(spotId))

    const handleSubmit = async (e) => {
      e.preventDefault();

      setIsSubmitted(true)
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



    // let images = [image1, image2, image3, image4, image5];
      if (formType === "create") {
        const spotDetails = {
          country,
          address,
          city,
          state,
          description,
          name,
          price,
          // images,
          lat: 1,
          lng: 1,
        }
        const data =  await dispatch(createNewSpot(spotDetails))
          //  await dispatch(getAllSpots())
           navigate(`/spots/${data.id}`)

      } else if (
        formType === "update"
      ) {
         const spotDetails = {
           country,
           address,
           city,
           state,
           description,
           name,
           price,
           // images,
           lat: 1,
           lng: 1,
         };
          const data = await dispatch(updateSpot(spotDetails));
          // await dispatch(getAllSpots());
          console.log("----------------------------------- > ",spotId)
        navigate(`/spots/${data.id}`);
      }
    // if (!Object.values(errors).length) {




    //   }

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
    // console.log('================',spotResponse)
  };
    // return (
    //   <div>
    //     {
    //       <form id="spotForm" onSubmit={handleSubmit}>
    //         <div>
    //           <h1>CREATE A SPOT</h1>
    //           <p> Wheres your place located ? </p>
    //           <p>
    //             Guests will only get your exact address once they booked a
    //             reservation
    //           </p>
    //         </div>
    //         <div id="allSpots">
    //           <label>Country</label>
    //           <p>{errors.country}</p>
    //           <input
    //             type="text"
    //             value={country}
    //             onChange={(e) => setCountry(e.target.value)}
    //             placeholder="country"
    //           ></input>
    //         </div>
    //         <div id="allSpots">
    //           <label>Street Address</label>
    //           <p>{errors.address}</p>
    //           <input
    //             type="text"
    //             value={address}
    //             onChange={(e) => setAddress(e.target.value)}
    //             placeholder="Address"
    //           ></input>
    //         </div>
    //         <div id="allSpots">
    //           <label>State</label>
    //           <p>{errors.state}</p>
    //           <input
    //             type="text"
    //             value={state}
    //             onChange={(e) => setState(e.target.value)}
    //             placeholder="state"
    //           ></input>
    //         </div>
    //         <div id="allSpots">
    //           <label>City</label>
    //           <p>{errors.city}</p>
    //           <input
    //             type="text"
    //             value={city}
    //             onChange={(e) => setCity(e.target.value)}
    //             placeholder="city"
    //           ></input>
    //         </div>
    //         <div>
    //           <h3>Describe your place to guests</h3>
    //           <p>
    //             Mention the best features of your space, any special amenities
    //             like fast wifi or parking, and what you love about the
    //             neighborhood.
    //           </p>
    //           <textarea
    //             rows={5}
    //             cols={25}
    //             value={description}
    //             onChange={(e) => setDescription(e.target.value)}
    //             placeholder={"Please write at least 30 characters"}
    //           />
    //           <p>{errors.description}</p>
    //         </div>
    //         <div>
    //           <h3> Create a title for your spot</h3>
    //           <p>
    //             Catch guest&apos;s attention with a spot title that highlights
    //             what makes your place special.
    //           </p>
    //           <input
    //             rows={1}
    //             cols={15}
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //             placeholder={"Name of your spot"}
    //           />
    //           <p>{errors.name}</p>
    //         </div>
    //         <div>
    //           <h3>Set a base price for your spot</h3>
    //           <p>
    //             Competitive pricing can help your listing stand out and rank
    //             higher in search results.
    //           </p>
    //           $
    //           <input
    //             value={price}
    //             onChange={(e) => setPrice(e.target.value)}
    //             placeholder={"Price per night (USD)"}
    //             type="number"
    //           />
    //           <p>{errors.price}</p>
    //         </div>
    //         <div>
    //           <h3>Liven up your spot with photos</h3>
    //           <p>Submit a link to at least one photo to publish your spot</p>
    //           <div>
    //             <input
    //               value={image1}
    //               onChange={(e) => setImage1(e.target.value)}
    //               placeholder="Preview Image URL"
    //             />
    //             <p>{errors.image1}</p>
    //           </div>
    //           <div>
    //             <input
    //               value={image2}
    //               onChange={(e) => setImage2(e.target.value)}
    //               placeholder="Image URL"
    //             />
    //             <p>{errors.image2}</p>
    //           </div>
    //           <div>
    //             <input
    //               value={image3}
    //               onChange={(e) => setImage3(e.target.value)}
    //               placeholder="Image URL"
    //             />
    //             <p>{errors.image3}</p>
    //           </div>
    //           <div>
    //             <input
    //               value={image4}
    //               onChange={(e) => setImage4(e.target.value)}
    //               placeholder="Image URL"
    //             />
    //             <p>{errors.image4}</p>
    //           </div>
    //           <div>
    //             <input
    //               value={image5}
    //               onChange={(e) => setImage5(e.target.value)}
    //               placeholder="Image URL"
    //             />
    //             <p>{errors.image5}</p>
    //           </div>
    //         </div>
    //         <div>
    //           <button>Create Spot</button>
    //         </div>
    //       </form>
    //     }
    //   </div>
  // );


return (
  <>
    {formType === "update" ? <h1>Update Spot</h1> : <h1>Create a New Spot</h1>}
    {isLoaded && (
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="form" id="allSpots">
          <h2 className="title">Where&apos;s your place located?</h2>
          <p className="subtitle">
            Guests will only get your exact address once they booked a
            reservation.
          </p>
          <p className="errors">{isSubmitted && errors.country}</p>
          <input
            className="input"
            id="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <label htmlFor="country">Country</label>
          <p className="errors">{isSubmitted && errors.address}</p>
          <input
            className="input"
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label htmlFor="address">Street Address</label>
          <p className="errors">{isSubmitted && errors.city}</p>
          <input
            className="input"
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <label htmlFor="city">City</label>
          <p className="errors">{isSubmitted && errors.state}</p>
          <input
            className="input"
            id="state"
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          <label htmlFor="state">State</label>
        </div>
        <div className="section">
          <h2 className="title">Describe your place to guests</h2>
          <p className="subtitle">
            Mention the best features of your space, any special amenities like
            fast wifi or parking, and what you love about the neighborhood.
          </p>
          <p className="errors">{isSubmitted && errors.description}</p>
          <input
            id="description"
            className="input"
            type="textarea"
            placeholder="Please write at least 30 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="section">
          <h2 className="title">Create a title for your spot</h2>
          <p className="subtitle">
            Catch guests attention with a spot title that highlights what makes
            your place special.
          </p>
          <p className="errors">{isSubmitted && errors.name}</p>
          <input
            className="input"
            id="name"
            type="text"
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="name">Name</label>
        </div>
        <div className="section">
          <h2 className="title">Set a base price for your spot</h2>
          <p className="subtitle">
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <p className="errors">{isSubmitted && errors.price}</p>
          <input
            className="input"
            id="number"
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {formType === "create" ? (
          <>
            <div className="section">
              <h2 className="title">Liven up your spot with photos</h2>
              <p className="subtitle">
                Submit a link to at least one photo to publish your spot.
              </p>
              <p className="errors">{isSubmitted && errors.spotImages}</p>
              <input
                className="input"
                id="prev-img"
                type="text"
                placeholder="Preview Image URL"
                value={image1}
                onChange={(e) => setImage1(e.target.value)}
              />
              <label htmlFor="prev-img">Preview Image</label>
              <input
                className="input"
                id="img2"
                type="text"
                placeholder="Image URL"
                value={image2}
                onChange={(e) => setImage2(e.target.value)}
              />
              <label htmlFor="img2">Image</label>
              <input
                className="input"
                id="img3"
                type="text"
                placeholder="Image URL"
                value={image3}
                onChange={(e) => setImage3(e.target.value)}
              />
              <label htmlFor="img3">Image</label>
              <input
                className="input"
                id="img4"
                type="text"
                placeholder="Image URL"
                value={image4}
                onChange={(e) => setImage4(e.target.value)}
              />
              <label htmlFor="img4">Image</label>
              <input
                className="input"
                id="img5"
                type="text"
                placeholder="Image URL"
                value={image5}
                onChange={(e) => setImage5(e.target.value)}
              />
              <label htmlFor="img5">Image</label>
            </div>
            <button id="create-spot-btn" type="submit">
              Create Spot
            </button>
          </>
        ) : (
          <button id="create-spot-btn" type="submit">
            Update Your Spot
          </button>
        )}
      </form>
    )}
  </>
);





}

export default CreateForm
