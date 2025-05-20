import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const editEProduct = async (
  name,
  description,
  color,
  size,
  quantity,
  eCategoryId,
  isActive,
  item,
  setLoader,
  getProducts,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  if (description) formData.append("description", description);
  if (color) formData.append("color", color);
  if (size) formData.append("size", size);
  formData.append("quantity", quantity ? quantity : 0);
  formData.append("eCategoryId", eCategoryId);
  formData.append("isActive", isActive);

  const jsonData = await fetchData(
    `/api/v1/eproducts/${item.id}`,
    "PUT",
    formData,
    true
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

  //fetch data
  getProducts();

  //close modal
  modalCloseButton.current.click();

  return { success, message };
};

const EditEProduct = ({ item, getProducts }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [color, setColor] = useState(item.color || "");
  const [size, setSize] = useState(item.size || "");
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const [eCategoryId, setECategoryId] = useState(item.eCategoryId || "");
  const [isActive, setIsActive] = useState(item.isActive ? "true" : "false");

  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"editEProduct" + item.id}
        modalHeader={"Edit EProduct"}
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
          <label className="text-black font-w500">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Color</label>
          <input
            type="text"
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Size</label>
          <input
            type="text"
            className="form-control"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">E-Category ID</label>
          <input
            type="text"
            className="form-control"
            value={eCategoryId}
            onChange={(e) => setECategoryId(e.target.value)}
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

        {loader === true ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                editEProduct(
                  name,
                  description,
                  color,
                  size,
                  quantity,
                  eCategoryId,
                  isActive,
                  item,
                  setLoader,
                  getProducts,
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

export default EditEProduct;