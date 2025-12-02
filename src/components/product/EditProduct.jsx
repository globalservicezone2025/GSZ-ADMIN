import React, { useEffect, useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles

const editProduct = async (
  name,
  isActive,
  createdBy,
  mainCategory,
  tags,
  image,
  link,
  description,
  price,
  item,
  setLoader,
  getProducts,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("isActive", isActive);
  formData.append("createdBy", createdBy);
  formData.append("mainCategory", mainCategory);
  formData.append("tags", JSON.stringify(tags));
  if (image) {
    formData.append("image", image);
  }
  formData.append("link", link);
  formData.append("description", description);
  formData.append("price", price);

  const jsonData = await fetchData(
    `/api/v1/products/${item.id}`,
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
  getProducts();
  modalCloseButton.current.click();

  return { success, message };
};

const EditProduct = ({ item, getProducts }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState(item.name);
  const [isActive, setIsActive] = useState(item.isActive);
  const [createdBy, setCreatedBy] = useState(item.createdBy || "user-id");
  const [mainCategory, setMainCategory] = useState(item.mainCategory);
  const [tags, setTags] = useState(item.tags || []);
  const [image, setImage] = useState(null);
  const [link, setLink] = useState(item.link);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);

  const modalCloseButton = useRef();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    if (tagsArray.length <= 5) {
      setTags(tagsArray);
    } else {
      showErrorToast("You can only add up to 5 tags.");
    }
  };

  return (
    <>
      <Modal
        modalId={"editProduct" + item.id}
        modalHeader={"Edit Product"}
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
          <label className="text-black font-w500">Main Category</label>
          <input
            type="text"
            className="form-control"
            value={mainCategory}
            onChange={(e) => setMainCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">
            Tags (separated by commas, max 5)
          </label>
          <input
            type="text"
            className="form-control"
            value={tags.join(", ")}
            onChange={handleTagsChange}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
          {item.image && (
            <img
              src={item.image}
              alt="product image"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "contain",
                marginTop: "10px",
              }}
            />
          )}
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Link</label>
          <input
            type="text"
            className="form-control"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Description</label>
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Active?</label>
          <select
            name="isActive"
            id="isActive"
            className="form-control"
            onChange={(e) => setIsActive(e.target.value === "true")}
          >
            <option value="true" selected={isActive === true}>
              Yes
            </option>
            <option value="false" selected={isActive === false}>
              No
            </option>
          </select>
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                editProduct(
                  name,
                  isActive,
                  createdBy,
                  mainCategory,
                  tags,
                  image,
                  link,
                  description,
                  price,
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

export default EditProduct;
