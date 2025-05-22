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

const createEProduct = async (
  name,
  description,
  colors,
  size,
  eCategoryId,
  stocks,
  setLoader,
  modalCloseButton,
  getProducts
) => {
  try {
    setLoader(true);

    const payload = {
      name,
      description,
      color: colors.map((c) => c.value),
      size,
      eCategoryId,
      stocks,
    };

    const jsonData = await fetchData(
      "/api/v1/eproducts",
      "POST",
      JSON.stringify(payload),
      false
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
  } catch (err) {
    console.log("Create Product Error: ", err);
  }
};

const CreateEProduct = ({ getProducts }) => {
  const [loader, setLoader] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [size, setSize] = useState("");
  const [eCategoryId, setECategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [stocks, setStocks] = useState([
    { color: "", size: "", quantity: 0 }
  ]);

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
        }
      })
      .catch(() => {
        if (isMounted) setAllColors([]);
      });
    return () => { isMounted = false; };
  }, []);

  const handleStockChange = (idx, field, value) => {
    setStocks((prev) =>
      prev.map((stock, i) =>
        i === idx ? { ...stock, [field]: value } : stock
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
          <label className="text-black font-w500">Sizes (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. 32,33"
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
          <label className="text-black font-w500">Stocks</label>
          {stocks.map((stock, idx) => (
            <div key={idx} className="d-flex mb-2">
              <input
                type="text"
                className="form-control mr-2"
                style={{ width: "30%" }}
                placeholder="Color"
                value={stock.color}
                onChange={(e) => handleStockChange(idx, "color", e.target.value)}
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
                onChange={(e) => handleStockChange(idx, "quantity", e.target.value)}
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

        {loader === true ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createEProduct(
                  name,
                  description,
                  colors,
                  size.split(",").map((s) => s.trim()).filter(Boolean),
                  eCategoryId,
                  stocks.map((s) => ({
                    color: s.color,
                    size: s.size,
                    quantity: Number(s.quantity)
                  })),
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