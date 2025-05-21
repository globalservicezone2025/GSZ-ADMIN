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
      color,
      size,
      eCategoryId,
      stocks,
    };

    const jsonData = await fetchData(
      "/api/v1/eproducts",
      "POST",
      JSON.stringify(payload),
      false // not multipart/form-data
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
  const [color, setColor] = useState(""); // comma-separated
  const [size, setSize] = useState(""); // comma-separated
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
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Colors (comma separated)</label>
          <input
            type="text"
            className="form-control"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. #FFFFFF, #000000"
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
                  color.split(",").map((c) => c.trim()).filter(Boolean),
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