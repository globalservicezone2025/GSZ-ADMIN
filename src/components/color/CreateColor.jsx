import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const createColor = async (
  name,
  code,
  setLoader,
  modalCloseButton,
  getColors
) => {
  setLoader(true);

  const payload = {
    name,
    code,
  };

  const jsonData = await fetchData(
    "/api/v1/colors",
    "POST",
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

const CreateColor = ({ getColors }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"createColor"}
        modalHeader={"Create Color"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Color Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Black"
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Color Code</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. #000000"
          />
        </div>
        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createColor(
                  name,
                  code,
                  setLoader,
                  modalCloseButton,
                  getColors
                )
              }
              buttonText={"Submit"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default CreateColor;