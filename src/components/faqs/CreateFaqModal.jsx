import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles

const createFaq = async (
  categoryId,
  subCategoryId,
  question,
  answer,
  setLoader,
  modalCloseButton,
  getFaqs
) => {
  setLoader(true);

  const payload = {
    categoryId,
    subCategoryId,
    question,
    answer,
  };

  const jsonData = await fetchData("/api/v1/faqs", "POST", payload, false);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getFaqs();
  modalCloseButton.current.click();

  return { success, message };
};

const CreateFaqModal = ({ getFaqs, categories }) => {
  const [loader, setLoader] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryLoader, setSubCategoryLoader] = useState(false);

  const modalCloseButton = useRef();

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubCategory("");
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
        modalId={"createFaq"}
        modalHeader={"Create FAQ"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Category</label>
          <select
            name="category"
            id="category"
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
          <label className="text-black font-w500 mr-2">Subcategory</label>
          {subCategoryLoader ? (
            <Loader />
          ) : (
            <select
              name="subCategory"
              id="subCategory"
              className="form-control"
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
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
          <label className="text-black font-w500">Question</label>
          <input
            type="text"
            className="form-control"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Answer</label>
          <ReactQuill value={answer} onChange={setAnswer} />
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createFaq(
                  category,
                  subCategory,
                  question,
                  answer,
                  setLoader,
                  modalCloseButton,
                  getFaqs
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

export default CreateFaqModal;