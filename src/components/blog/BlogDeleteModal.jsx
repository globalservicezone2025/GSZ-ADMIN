import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const deleteBlog = async (
  blogId,
  setLoader,
  getData,
  modalCloseButton
) => {
  setLoader(true);

  const jsonData = await fetchData(`/api/v1/blogs/${blogId}`, "DELETE");

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getData();
  modalCloseButton.current.click();

  return { success, message };
};

const BlogDeleteModal = ({ blogId, getData }) => {
  const [loader, setLoader] = useState(false);
  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={`blogDeleteModal${blogId}`}
        modalHeader={"Delete Blog"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Are you sure you want to delete this blog?</label>
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                deleteBlog(blogId, setLoader, getData, modalCloseButton)
              }
              buttonText={"Delete"}
              buttonColor={"btn-danger"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default BlogDeleteModal;