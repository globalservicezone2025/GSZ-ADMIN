import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles

const createSubcategory = async (
  name,
  subTitle,
  text,
  categoryId,
  subCategoryId,
  image,
  isActive,
  setLoader,
  modalCloseButton,
  getSubcategories
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", subTitle); // Ensure this matches the field name in your model
  formData.append("text", text); // Ensure this matches the field name in your model
  formData.append("categoryId", categoryId);
  formData.append("subcategoryId", subCategoryId); // Ensure this matches the field name in your model
  if (image) {
    formData.append("image", image);
  }
  formData.append("isActive", isActive);

  const jsonData = await fetchData(
    "/api/v1/subsubcategories",
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
  getSubcategories();
  modalCloseButton.current.click();

  return { success, message };
};

const CreateSubcategory = ({ getSubcategories, categories }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [text, setText] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [isActive, setIsActive] = useState("true");
  const [tempImages, setTempImages] = useState([]);
  const [image, setImage] = useState("");
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryLoader, setSubCategoryLoader] = useState(false);

  const modalCloseButton = useRef();

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategoryId(selectedCategory);
    setSubCategoryId("");
    if (selectedCategory) {
      setSubCategoryLoader(true);
      try {
        const result = await fetchData(
          `/api/v1/subcategoriesByCategory/${selectedCategory}`,
          "GET"
        );
        if (result.success) {
          setSubCategories(result.data);
        } else {
          showErrorToast(result.message);
        }
      } catch (error) {
        showErrorToast(error.message);
      } finally {
        setSubCategoryLoader(false);
      }
    } else {
      setSubCategories([]);
    }
  };

  return (
    <>
      <Modal
        modalId={"createSubcategory"}
        modalHeader={"Create Service Details"}
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
          <label className="text-black font-w500">Sub title</label>
          <input
            type="text"
            className="form-control"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Description</label>
          <ReactQuill value={text} onChange={setText} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Category</label>
          <select
            name="categoryId"
            id="categoryId"
            className="form-control"
            onChange={handleCategoryChange}
          >
            <option value="">Select a category</option>
            {categories &&
              categories.map((category, index) => (
                <option value={category.id} key={category.id + index}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Subcategory</label>
          {subCategoryLoader ? (
            <Loader />
          ) : (
            <select
              name="subCategoryId"
              id="subCategoryId"
              className="form-control"
              onChange={(e) => setSubCategoryId(e.target.value)}
              value={subCategoryId}
            >
              <option value="">Select a subcategory</option>
              {subCategories &&
                subCategories.map((subCategory, index) => (
                  <option value={subCategory.id} key={subCategory.id + index}>
                    {subCategory.name}
                  </option>
                ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Active?</label>
          <select
            name="isActive"
            id="isActive"
            className="form-control"
            onChange={(e) => setIsActive(e.target.value)}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
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
            <img
              src={tempImageUrl}
              alt="image"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "contain",
              }}
            />
          )}
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createSubcategory(
                  name,
                  subTitle,
                  text,
                  categoryId,
                  subCategoryId,
                  image,
                  isActive,
                  setLoader,
                  modalCloseButton,
                  getSubcategories
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

export default CreateSubcategory;
