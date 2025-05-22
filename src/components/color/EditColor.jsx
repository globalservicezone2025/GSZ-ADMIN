import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const updateColor = async (
  name,
  code,
  item,
  setLoader,
  getColors,
  modalCloseButton
) => {
  setLoader(true);

  const payload = {
    name,
    code,
  };

  const jsonData = await fetchData(
    `/api/v1/colors/${item.id}`,
    "PUT",
    payload
  );

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);

  getColors();
  modalCloseButton.current.click();

  return { success, message };
};

const EditColor = ({ item, getColors }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState(item.name || "");
  const [code, setCode] = useState(item.code || "");
  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"editColor" + item.id}
        modalHeader={"Edit Color"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Color Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. White"
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Color Code</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. #FFFFFF"
          />
        </div>
        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                updateColor(
                  name,
                  code,
                  item,
                  setLoader,
                  getColors,
                  modalCloseButton
                )
              }
              buttonText={"Update"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default EditColor;