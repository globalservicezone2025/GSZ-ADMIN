import React, { useRef, useState, useEffect } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const createEProduct = async (
  name,
  description,
  color,
  size,
  quantity,
  eCategoryId,
  isActive,
  setLoader,
  modalCloseButton,
  getProducts
) => {
  try {
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
      "/api/v1/eproducts",
      "POST",
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
  } catch (err) {
    console.log("Create Product Error: ", err);
  }
};

const CreateEProduct = ({ getProducts }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [eCategoryId, setECategoryId] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [categories, setCategories] = useState([]);

  const modalCloseButton = useRef();

  useEffect(() => {
    fetchData("/api/v1/ecategories", "GET")
      .then((result) => {
        if (result.success) {
          setCategories(result.data);
        }
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  return (
    <>
      <Modal
        modalId={"createEProduct"}
        modalHeader={"Create EProduct"}
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
          <label className="text-black font-w500">E-Category</label>
          <select
            className="form-control"
            value={eCategoryId}
            onChange={(e) => setECategoryId(e.target.value)}
          >
            <option value="">Select E-Category</option>
            {(categories || []).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Active?</label>
          <select
            name="isActive"
            id="isActive"
            className="form-control"
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {loader === true ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createEProduct(
                  name,
                  description,
                  color,
                  size,
                  quantity,
                  eCategoryId,
                  isActive,
                  setLoader,
                  modalCloseButton,
                  getProducts
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

export default CreateEProduct;
