import React, { useRef, useState, useEffect } from "react";
import Select, { components } from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

// Custom Option for dropdown
const ColorOption = (props) => (
  <components.Option {...props}>
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: props.data.value,
        border: "1px solid #ccc",
        marginRight: 8,
        verticalAlign: "middle",
      }}
    />
    {props.label}
  </components.Option>
);

// Custom MultiValueLabel for selected values
const ColorMultiValueLabel = (props) => (
  <components.MultiValueLabel {...props}>
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: props.data.value,
        border: "1px solid #ccc",
        marginRight: 4,
        verticalAlign: "middle",
      }}
    />
    {props.data.label}
  </components.MultiValueLabel>
);

const editEProduct = async (
  name,
  description,
  colors,
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

  const payload = {
    name,
    description,
    color: colors.map((c) => c.value), // array of color codes
    size,
    quantity,
    eCategoryId,
    isActive,
  };

  const jsonData = await fetchData(
    `/api/v1/eproducts/${item.id}`,
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

  getProducts();
  modalCloseButton.current.click();

  return { success, message };
};

const EditEProduct = ({ item, getProducts }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [colors, setColors] = useState(
    Array.isArray(item.color)
      ? item.color.map((code) => ({ value: code, label: code }))
      : []
  );
  const [allColors, setAllColors] = useState([]);
  const [size, setSize] = useState(item.size || "");
  const [quantity, setQuantity] = useState(item.quantity || 0);
  const [eCategoryId, setECategoryId] = useState(item.eCategoryId || "");
  const [categories, setCategories] = useState([]);
  const [isActive, setIsActive] = useState(item.isActive ? "true" : "false");

  const modalCloseButton = useRef();

  useEffect(() => {
    let isMounted = true;
    fetchData("/api/v1/ecategories", "GET")
      .then((result) => {
        if (isMounted && result.success) {
          setCategories(result.data);
        }
      })
      .catch(() => {
        if (isMounted) setCategories([]);
      });
    fetchData("/api/v1/colors", "GET")
      .then((result) => {
        if (isMounted && result.success) {
          setAllColors(
            result.data.map((color) => ({
              value: color.code,
              label: color.name,
            }))
          );
          // Set initial selected colors with name labels
          if (Array.isArray(item.color)) {
            setColors(
              item.color
                .map((code) => {
                  const found = result.data.find((c) => c.code === code);
                  return found ? { value: found.code, label: found.name } : null;
                })
                .filter(Boolean)
            );
          }
        }
      })
      .catch(() => {
        if (isMounted) setAllColors([]);
      });
    return () => { isMounted = false; };
    // eslint-disable-next-line
  }, [item.color]);

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
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Colors</label>
          <Select
            isMulti
            options={allColors}
            value={colors}
            onChange={setColors}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select colors"
            components={{
              Option: ColorOption,
              MultiValueLabel: ColorMultiValueLabel,
            }}
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
                  colors,
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