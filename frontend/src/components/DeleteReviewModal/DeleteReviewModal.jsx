import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { reviewDelete, fetchReviews, getAllSpots } from "../../store/spots";

const DeleteReviewModal = ({ reviewId, spotId }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.preventDefault();
    console.log(reviewId);
    console.log(spotId);
    await dispatch(reviewDelete(reviewId));
    await dispatch(fetchReviews(spotId));
    await dispatch(getAllSpots(spotId));
    await closeModal();
  };
  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <button type="button" onClick={handleDelete}>
        Yes (Delete Review)
      </button>
      <button type="button" onClick={() => closeModal()}>
        No (Keep Review)
      </button>
    </div>
  );
};

export default DeleteReviewModal;
