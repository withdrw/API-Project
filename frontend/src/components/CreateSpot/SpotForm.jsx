import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSpot,
  createNewSpot,
  updateSpot,
  spotImages,
} from "../../store/spots";
import  './CreateForm.css'
function SpotForm() {
  const { spotId } = useParams();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [formType, setFormType] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [image1, setimage1] = useState(null);
  const [image2, setimage2] = useState(null);
  const [image3, setimage3] = useState(null);
  const [image4, setimage4] = useState(null);

  useEffect(() => {
    if (spotId) {
      dispatch(getSpot(spotId)).then((spot) => {
        setAddress(spot.address);
        setCity(spot.city);
        setState(spot.state);
        setCountry(spot.country);
        setName(spot.name);
        setDescription(spot.description);
        setPrice(spot.price);
        setFormType("update");
        setIsLoaded(true);
      });
    } else {
      dispatch(getSpot()).then(() => {
        setAddress("");
        setCity("");
        setState("");
        setCountry("");
        setName("");
        setDescription("");
        setPrice();
        setFormType("create");
        setIsLoaded(true);
      });
    }
  }, [dispatch, spotId, formType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

const errObj = {};
      if (name === '') errObj.name = 'Name is required';
      if (city === '') errObj.city = 'City is required';
      if (state === '') errObj.state = 'State is required';
      if (country === '') errObj.country = 'Country is required';
      if (address === '') errObj.address = 'Street address is required';
      if (description.length < 30) errObj.description = 'Description must be at least 30 characters';
      if (price <= 0) errObj.price = 'Price per day is required and should be a  positive number';
      if (formType === 'create' && !previewImage) errObj.previewImage = 'Preview image is required';

    setErrors(errObj);

    if (!Object.keys(errObj).length) {
      if (
        name !== "" &&
        city !== "" &&
        state !== "" &&
        country !== "" &&
        address !== ""
      ) {
        if (formType === "create") {
          const spot = {
            country,
            address,
            city,
            state,
            description,
            name,
            lat: 1,
            lng: 1,
            price: parseInt(price),
            previewImage,
            image1,
            image2,
            image3,
            image4,
          };
          const data = await dispatch(createNewSpot(spot));

          let images = [previewImage, image1, image2, image3, image4].filter(
            (image) => image != null
          );

          await Promise.all(
            images.map(async (image, index) => {
              let imageData = {
                url: image,
                preview: index == 0,
              };
              await dispatch(spotImages(imageData, data.id));
            })
          );
          navigate(`/spots/${data.id}`);
        } else if (formType === "update") {
          const spot = {
            id: spotId,
            country,
            address,
            city,
            state,
            description,
            name,
            lat: 1,
            lng: 1,
            price: parseInt(price),
            previewImage,
            image1,
            image2,
            image3,
            image4,
          };
          const updatedSpot = await dispatch(updateSpot(spot));
          let images = [previewImage, image1, image2, image3, image4].filter(
            (image) => image != null
          );

          await Promise.all(
            images.map(async (image, index) => {
              let imageData = {
                url: image,
                preview: index == 0,
              };
              await dispatch(spotImages(imageData, updatedSpot.id));
            })
          );

          navigate(`/spots/${updatedSpot.id}`);
        }
      }
    }
  };

  return (
    <>
      {formType === "update" ? (
        <h1 className="heading">Update Spot</h1>
      ) : (
        <h1 className="heading">Create a New Spot</h1>
      )}
      {isLoaded && (
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="section">
            <h2 className="title">Where&apos;s your place located?</h2>
            <p className="subtitle">
              Guests will only get your exact address once they booked a
              reservation.
            </p>
            <label className="label">Country</label>
            <p className="errors">{isSubmitted && errors.country}</p>
            <input
              placeholder="country"
              className="input"
              id="country"
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <label className="label">Street Address</label>
            <p className="errors">{isSubmitted && errors.address}</p>
            <input
              placeholder="Street Address"
              className="input"
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <label className="label">City</label>
            <p className="errors">{isSubmitted && errors.city}</p>
            <input
              placeholder="CITY"
              className="-input"
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <label className="label">State</label>
            <p className="errors">{isSubmitted && errors.state}</p>
            <input
              placeholder="state"
              className="input"
              id="state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="form-section">
            <h2 className="title">Describe your place to guests</h2>
            <p className="subtitle">
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
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
              Catch guests&apos; attention with a spot title that highlights
              what makes your place special.
            </p>
            <label className="label">Name</label>
            <p className="errors">{isSubmitted && errors.name}</p>
            <input
              className="input"
              id="name"
              type="text"
              placeholder="Name of your spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-section">
            <h2 className="title">Set a base price for your spot</h2>
            <p className="subtitle">
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <p className="errors">{isSubmitted && errors.price}</p>
            <input
              placeholder="Price per night (USD)"
              className="input"
              id="number"
              type="number"
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
                <label>
                  <br></br>
                  <input
                    type="text"
                    value={previewImage}
                    placeholder="Preview Image URL"
                    onChange={(e) => setPreviewImage(e.target.value)}
                  />
                  <div className="errors">
                    {isSubmitted && errors.previewImage}
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setimage1(e.target.value)}
                  />
                  <div className="errors">
                    {setIsSubmitted && errors.image1}
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setimage2(e.target.value)}
                  />
                  <div className="errors">
                    {setIsSubmitted && errors.image2}
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setimage3(e.target.value)}
                  />
                  <div className="errors">
                    {setIsSubmitted && errors.image3}
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    onChange={(e) => setimage4(e.target.value)}
                  />
                  <div className="errors">
                    {setIsSubmitted && errors.image4}
                  </div>
                </label>
              </div>
              <button id="button" type="submit">
                Create Spot
              </button>
            </>
          ) : (
            <button id="button" type="submit">
              Update Your Spot
            </button>
          )}
        </form>
      )}
    </>
  );
}
export default SpotForm;
