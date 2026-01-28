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
  sizes,
  stocks,
  eCategoryId,
  isActive,
  price,
  newImages,
  removedImages,
  item,
  setLoader,
  getProducts,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("color", JSON.stringify(colors.map((c) => c.value)));
  formData.append("size", JSON.stringify(sizes));
  formData.append("eCategoryId", eCategoryId);
  formData.append("stocks", JSON.stringify(stocks));
  formData.append("isActive", isActive === "true");
  formData.append("price", price);

  // 🔹 Removed images
  if (removedImages.length > 0) {
    formData.append("removedImages", JSON.stringify(removedImages));
  }

  // 🔹 New images
  if (newImages && newImages.length > 0) {
    Array.from(newImages).forEach((img) => formData.append("images", img));
  }

  const jsonData = await fetchData(
    `/api/v1/eproducts/${item.id}`,
    "PUT",
    formData,
    true // isFormData flag
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
  const [size, setSize] = useState(
    Array.isArray(item.size) ? item.size.join(",") : item.size || ""
  );
  const [stocks, setStocks] = useState(
    Array.isArray(item.stocks) && item.stocks.length
      ? item.stocks
      : [{ color: "", size: "", quantity: 0 }]
  );
  const [eCategoryId, setECategoryId] = useState(item.eCategoryId || "");
  const [categories, setCategories] = useState([]);
  const [isActive, setIsActive] = useState(item.isActive ? "true" : "false");
  const [newImages, setNewImages] = useState([]); // for new uploads
  const [existingImages, setExistingImages] = useState(item.images || []); // existing images
  const [removedImages, setRemovedImages] = useState([]); // images to remove
  const [price, setPrice] = useState(item.price || "");
  const modalCloseButton = useRef();

  useEffect(() => {
    let isMounted = true;

    // Fetch categories
    fetchData("/api/v1/ecategories", "GET")
      .then((result) => {
        if (isMounted && result.success) {
          setCategories(result.data);
        }
      })
      .catch(() => isMounted && setCategories([]));

    // Fetch colors
    fetchData("/api/v1/colors", "GET")
      .then((result) => {
        if (isMounted && result.success) {
          setAllColors(
            result.data.map((color) => ({
              value: color.code,
              label: color.name,
            }))
          );
          if (Array.isArray(item.color)) {
            setColors(
              item.color
                .map((code) => {
                  const found = result.data.find((c) => c.code === code);
                  return found
                    ? { value: found.code, label: found.name }
                    : null;
                })
                .filter(Boolean)
            );
          }
        }
      })
      .catch(() => isMounted && setAllColors([]));

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [item.color]);

  const handleStockChange = (idx, field, value) => {
    setStocks((prev) =>
      prev.map((stock, i) => (i === idx ? { ...stock, [field]: value } : stock))
    );
  };

  const handleStockColorChange = (idx, selected) => {
    setStocks((prev) =>
      prev.map((stock, i) =>
        i === idx ? { ...stock, color: selected ? selected.value : "" } : stock
      )
    );
  };

  const addStockRow = () => {
    setStocks([...stocks, { color: "", size: "", quantity: 0 }]);
  };

  const removeStockRow = (idx) => {
    setStocks(stocks.filter((_, i) => i !== idx));
  };

  return (
    <>
      <Modal
        modalId={"editEProduct" + item.id}
        modalHeader={"Edit EProduct"}
        modalCloseButton={modalCloseButton}
      >
        {/* Name */}
        <div className="form-group">
          <label className="text-black font-w500">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="text-black font-w500">Description</label>
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        {/* Colors */}
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

        {/* Sizes */}
        <div className="form-group">
          <label className="text-black font-w500">Sizes (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. 32,34"
          />
        </div>

        {/* Stocks */}
        <div className="form-group">
          <label className="text-black font-w500">Stocks</label>
          {stocks.map((stock, idx) => (
            <div key={idx} className="d-flex mb-2">
              <Select
                options={allColors}
                value={allColors.find((c) => c.value === stock.color) || null}
                onChange={(selected) => handleStockColorChange(idx, selected)}
                className="mr-2"
                classNamePrefix="select"
                placeholder="Color"
                styles={{ container: (base) => ({ ...base, width: "30%" }) }}
                isClearable
              />
              <input
                type="text"
                className="form-control mr-2"
                style={{ width: "30%" }}
                placeholder="Size"
                value={stock.size}
                onChange={(e) => handleStockChange(idx, "size", e.target.value)}
              />
              <input
                type="number"
                className="form-control mr-2"
                style={{ width: "30%" }}
                placeholder="Quantity"
                value={stock.quantity}
                onChange={(e) =>
                  handleStockChange(idx, "quantity", e.target.value)
                }
              />
              {stocks.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => removeStockRow(idx)}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary btn-sm mt-2"
            onClick={addStockRow}
          >
            Add Stock
          </button>
        </div>

        {/* E-Category */}
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

        {/* Active */}
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

        {/* Existing Images */}
        <div className="form-group">
          <label className="text-black font-w500">Existing Images</label>
          <div className="d-flex flex-wrap">
            {existingImages.map((img, idx) => (
              <div key={idx} className="position-relative mr-2 mb-2">
                <img
                  src={img}
                  alt={`img-${idx}`}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setExistingImages((prev) =>
                      prev.filter((_, i) => i !== idx)
                    );
                    setRemovedImages((prev) => [...prev, img]);
                  }}
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images */}
        <div className="form-group">
          <label className="text-black font-w500">Add New Images</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(e.target.files)}
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label className="text-black font-w500">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            min="0"
            step="0.01"
          />
        </div>

        {/* Loader / Button */}
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
                  size
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  stocks.map((s) => ({
                    color: s.color,
                    size: s.size,
                    quantity: Number(s.quantity),
                  })),
                  eCategoryId,
                  isActive,
                  price,
                  newImages,
                  removedImages,
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
