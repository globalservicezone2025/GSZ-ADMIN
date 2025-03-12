import React, { useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const PricingDeleteModal = ({ pricingId, getData }) => {
  const [loader, setLoader] = useState(false);

  const handleDelete = async () => {
    setLoader(true);
    try {
      const result = await fetchData(`/api/v1/pricings/${pricingId}`, "DELETE");
      if (result.success) {
        showSuccessToast(result.message);
        getData();
        // Close the modal
        window.$(`#pricingDeleteModal${pricingId}`).modal('hide');
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
    <div className="modal fade" id={`pricingDeleteModal${pricingId}`}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Pricing</h5>
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this pricing?</p>
            {loader ? (
              <div className="spinner-border"></div>
            ) : (
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingDeleteModal;