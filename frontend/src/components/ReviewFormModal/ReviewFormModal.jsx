// //import { useNavigate } from 'react-router-dom';
// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { createReview } from "../../store/spots";
// //import { getAllSpots } from "../../store/spots";
// import { useModal } from "../../context/Modal";

// const ReviewFormModal = ({ spotId }) => {
//   //const navigate = useNavigate();
//   const dispatch = useDispatch();
//   //const { spotId } = useParams();
//   const [review, setReview] = useState("");
//   const [stars, setStars] = useState(0);
//   const [errors, setErrors] = useState({});
//   const [isSubmitted] = useState(false);
//   const { closeModal } = useModal();

//   useEffect(() => {
//     const errors = {};
//     if (review.length < 10)
//       errors.review = "Please write at least 10 characters";
//     if (stars == 0) errors.stars = "Please select a star rating";
//     setErrors(errors);
//   }, [review, stars]);

//   const handleClick = (star) => {
//     setStars(star);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const reviewUser = { review, stars };
//     await dispatch(createReview(reviewUser, spotId));
//     closeModal();
//   };

//   const arrOfStars = [1, 2, 3, 4, 5];

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="review">
//         <h1>How was your stay?</h1>
//         <div className="errors">
//           {isSubmitted && errors.review}
//           <br></br>
//           {isSubmitted && errors.stars}
//         </div>

//         <textarea
//           className="review-area"
//           rows="5"
//           cols="20"
//           placeholder="Leave your review here..."
//           onChange={(e) => setReview(e.target.value)}
//         ></textarea>
//         <div className="stars-group">
//           {arrOfStars.map((star, i) => (
//             <div
//               key={i}
//               className="star"
//               style={{ fontSize: "30px", cursor: "pointer" }}
//               onClick={() => handleClick(star)}
//             >
//               {star <= stars ? "★" : "☆"}
//             </div>
//           ))}
//         </div>

//         <button
//           className="button"
//           type="submit"
//           onClick={(e) => {
//             handleSubmit(e).then(closeModal());
//           }}
//           disabled={Object.values(errors).length > 0}
//         >
//           Submit Your Review
//         </button>
//       </div>
//     </form>
//   );
// };

// export default ReviewFormModal;
//import { useNavigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { createReview, fetchReviews } from "../../store/spots";
//import { getAllSpots } from "../../store/spots";
import { useModal } from '../../context/Modal';

const ReviewFormModal = ({spotId}) => {
    //const navigate = useNavigate();
    const dispatch = useDispatch();
    //const { spotId } = useParams();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [errors, setErrors] = useState({});
    const [isSubmitted] = useState(false);
    const { closeModal } = useModal();

    useEffect(() => {
        const errors = {};
        if (review.length < 10) errors.review = "Please write at least 10 characters";
        if (stars == 0) errors.stars = "Please select a star rating";
        setErrors(errors);
    }, [review, stars]);

    const handleClick = (star) => {
        setStars(star);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewUser = {review, stars}
        await dispatch(createReview(reviewUser, spotId))
        await dispatch(fetchReviews(spotId));
        closeModal()
    };

    const arrOfStars = [1,2,3,4,5]

    return (
        <form onSubmit={handleSubmit}>
            <div className="review">
                <h1>How was your stay?</h1>
                <div className="errors">
                {isSubmitted && errors.review}
                <br></br>
                {isSubmitted && errors.stars}
                </div>

                <textarea
                    className="review-area"
                    rows="5"
                    cols="20"
                    placeholder="Write a review here."
                    onChange={(e) => setReview(e.target.value)}
                >
                </textarea>
                <div className='stars-group'>
                    {arrOfStars.map((star, i) => (
                        <div key={i} className='star' style={{ fontSize: '30px', cursor: 'pointer' }} onClick={() => handleClick(star)}>
                            {star <= stars ? '★' : '☆'}
                        </div>
                    ))}
                </div>

                <button className="button" type="submit" onClick={(e) => {
                    handleSubmit(e).then(closeModal());
                }} disabled={Object.values(errors).length > 0}>Submit Your Review</button>

            </div>
        </form>
    )
 }

export default ReviewFormModal;
