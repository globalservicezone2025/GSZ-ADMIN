import React, { useRef, useState } from "react";
import Modal from "../global/Modal";
import fetchData from "../../libs/api";
import Loader from "../global/Loader";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";

const deleteDiscount = async (
  item,
  setLoader,
  getDiscounts,
  modalCloseButton
) => {
  setLoader(true);

  const jsonData = await fetchData(`/api/v1/discounts/${item.id}`, "DELETE");

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);

  // Refresh data
  getDiscounts();

  // Close modal
  modalCloseButton.current.click();

  return { success, message };
};

const DeleteDiscount = ({ item, getDiscounts }) => {
  const [loader, setLoader] = useState(false);
  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"deleteDiscount" + item.id}
        modalHeader={"Delete Discount"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Want to delete this discount?</label>
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                deleteDiscount(item, setLoader, getDiscounts, modalCloseButton)
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

export default DeleteDiscount;