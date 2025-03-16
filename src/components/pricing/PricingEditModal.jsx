import React, { useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const PricingEditModal = ({ pricing, getData }) => {
  const [title, setTitle] = useState(pricing.title);
  const [description, setDescription] = useState(pricing.description);
  const [price, setPrice] = useState(pricing.price);
  const [type, setType] = useState(pricing.type);
  const [loader, setLoader] = useState(false);

  const handleEdit = async () => {
    setLoader(true);
    try {
      const result = await fetchData(`/api/v1/pricings/${pricing.id}`, "PUT", {
        title,
        description,
        price,
        type,
      });
      if (result.success) {
        showSuccessToast(result.message);
        getData();
      } else {
        showErrorToast(result.message);
      }
    } catch (error) {
      showErrorToast(error.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="modal fade" id={`pricingEditModal${pricing.id}`}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Pricing</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label className="text-black font-w500">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                <label className="text-black font-w500">Type</label>
                <select
                  name="type"
                  id="type"
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div className="form-group">
                <label className="text-black font-w500">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              {loader ? (
                <div className="spinner-border"></div>
              ) : (
                <div className="form-group">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleEdit}
                  >
                    Submit
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingEditModal;