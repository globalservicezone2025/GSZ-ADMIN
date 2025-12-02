import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const deleteColor = async (
  item,
  setLoader,
  getColors,
  modalCloseButton
) => {
  setLoader(true);

  const jsonData = await fetchData(`/api/v1/colors/${item.id}`, "DELETE");

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
  getColors();

  // Close modal
  modalCloseButton.current.click();

  return { success, message };
};

const DeleteColor = ({ item, getColors }) => {
  const [loader, setLoader] = useState(false);
  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"deleteColor" + item.id}
        modalHeader={"Delete Color"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Want to delete this color?</label>
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                deleteColor(
                  item,
                  setLoader,
                  getColors,
                  modalCloseButton
                )
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

export default DeleteColor;