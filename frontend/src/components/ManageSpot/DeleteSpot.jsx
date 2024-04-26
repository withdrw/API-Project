import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { loadUser, spotDelete } from "../../store/spots";

const DeleteSpot = ({ spotId }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.preventDefault();
    await dispatch(spotDelete(spotId));
    await dispatch(loadUser());
    await closeModal();
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button type='"button' onClick={handleDelete}>
        Yes (Delete Spot){" "}
      </button>
      <button type="button" onClick={() => closeModal()}>
        No (Keep Spot)
      </button>
    </div>
  );
};

export default DeleteSpot;
