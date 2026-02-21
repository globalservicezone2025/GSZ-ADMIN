import React, { useEffect, useRef, useState } from "react";
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
  try {
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

    if (!jsonData.success) {
      showErrorToast(jsonData.message);
      return;
    }

    showSuccessToast(jsonData.message);

    // refresh list
    getColors();

    // close modal
    if (modalCloseButton.current) {
      modalCloseButton.current.click();
    }
  } catch (error) {
    showErrorToast("Something went wrong!");
  } finally {
    setLoader(false);
  }
};

const EditColor = ({ item, getColors }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const modalCloseButton = useRef(null);

  // 🔥 IMPORTANT: Existing data load properly
  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setCode(item.code || "");
    }
  }, [item]);

  return (
    <Modal
      modalId={"editColor" + item.id}
      modalHeader={"Edit Color"}
      modalCloseButton={modalCloseButton}
    >
      <div className="form-group mb-3">
        <label className="text-black font-w500">Color Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. White"
        />
      </div>

      <div className="form-group mb-3">
        <label className="text-black font-w500">Color Code</label>
        <input
          type="text"
          className="form-control"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. #FFFFFF"
        />
      </div>

      {/* 🔥 Live Color Preview */}
      {code && (
        <div className="mb-3">
          <label className="text-black font-w500 d-block mb-2">
            Preview
          </label>
          <span
            style={{
              display: "inline-block",
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: code,
              border: "1px solid #ccc",
            }}
          />
        </div>
      )}

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
  );
};

export default EditColor;