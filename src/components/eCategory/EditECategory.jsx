import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const editECategory = async (
  name,
  serial,
  image,
  isActive,
  item,
  setLoader,
  getCategories,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();

  formData.append("name", name);
  formData.append("serial", serial);
  formData.append("isActive", isActive);

  if (image !== item.image) {
    formData.append("image", image);
  }

  const jsonData = await fetchData(
    `/api/v1/ecategories/${item.id}`,
    "PUT",
    formData,
    true
  );

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw {
      message,
    };
  }

  setLoader(false);
  showSuccessToast(message);

  //fetch data
  getCategories();

  //close modal
  modalCloseButton.current.click();

  return { success, message };
};

const EditECategory = ({ item, getCategories }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState(item.name);
  const [serial, setSerial] = useState(item.serial);
  const [isActive, setIsActive] = useState(item.isActive);
  const [image, setImage] = useState(item.image);
  const [tempImageUrl, setTempImageUrl] = useState(item.image);

  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"editECategory" + item.id}
        modalHeader={"Edit ECategory"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Category Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Serial</label>
          <input
            type="number"
            className="form-control"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Active?</label>
          <select
            className="form-control default-select"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value={"true"}>Yes</option>
            <option value={"false"}>No</option>
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setTempImageUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />

          {tempImageUrl && (
            <>
              <img
                src={tempImageUrl}
                alt="image"
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "contain",
                }}
              />
            </>
          )}
        </div>

        {loader === true ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="form-group">
              <Button
                buttonOnClick={() =>
                  editECategory(
                    name,
                    serial,
                    image,
                    isActive,
                    item,
                    setLoader,
                    getCategories,
                    modalCloseButton
                  )
                }
                buttonText={"Update"}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default EditECategory;
