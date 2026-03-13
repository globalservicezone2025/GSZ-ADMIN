import React, { useEffect, useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const deleteReview = async (
  item,
  id,
  setLoader,
  getReviews,
  modalCloseButton
) => {
  setLoader(true);

  const jsonData = await fetchData(`/api/v1/ereviews/${id}`, "DELETE");

  const message = jsonData?.message;
  const success = jsonData?.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message || "Failed to delete review");

    // eslint-disable-next-line no-throw-literal
    throw {
      message,
    };
  }

  setLoader(false);

  showSuccessToast(message || "Review deleted successfully");

  // fetch updated data
  getReviews();

  // close modal
  modalCloseButton.current.click();

  return { success, message };
};

const DeleteReview = ({ item, itemId, getReviews }) => {
  const [loader, setLoader] = useState(false);
  const [id, setId] = useState(item?.id);
  const modalCloseButton = useRef();

  useEffect(() => {
    setId(itemId);
  }, [itemId]);

  return (
    <>
      <Modal
        modalId={"deleteReview" + id}
        modalHeader={"Delete Review"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">
            Want to delete this review?
          </label>
        </div>

        {loader === true ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                deleteReview(item, id, setLoader, getReviews, modalCloseButton)
              }
              buttonText={"Delete"}
              buttonColor={"btn-danger"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default DeleteReview;