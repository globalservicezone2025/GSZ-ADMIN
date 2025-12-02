import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const editSubcategory = async (
  name,
  categoryId,
  serial,
  image,
  isActive,
  item,
  setLoader,
  getSubcategories,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();

  formData.append("name", name);
  formData.append("categoryId", categoryId);
  formData.append("serial", serial);
  formData.append("isActive", isActive);

  if (image !== item.image) {
    formData.append("image", image);
  }

  const jsonData = await fetchData(
    `/api/v1/subcategories/${item.id}`,
    "PUT",
    formData,
    true
  );

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    // eslint-disable-next-line no-throw-literal
    throw {
      message,
    };
  }

  setLoader(false);
  showSuccessToast(message);

  //fetch data
  getSubcategories();

  //close modal
  modalCloseButton.current.click();

  return { success, message };
};

const EditSubcategory = ({ item, getSubcategories, categories }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState(item.name);
  const [categoryId, setCategoryId] = useState(item.categoryId);
  const [serial, setSerial] = useState(item.serial);
  const [isActive, setIsActive] = useState(item.isActive);
  const [image, setImage] = useState(item.image);
  const [tempImageUrl, setTempImageUrl] = useState(item.image);

  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"editSubcategory" + item.id}
        modalHeader={"Edit Sub Service"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Category</label>
          <select
            name="categoryId"
            id="categoryId"
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a service</option>
            {categories &&
              categories.map((category, index) => (
                <option value={category?.id} key={category?.id + index}>
                  {category?.name}
                </option>
              ))}
          </select>
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
                  editSubcategory(
                    name,
                    categoryId,
                    serial,
                    image,
                    isActive,
                    item,
                    setLoader,
                    getSubcategories,
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

export default EditSubcategory;
