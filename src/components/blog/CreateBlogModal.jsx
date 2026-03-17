import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Cookies from "js-cookie";

const createBlog = async (
  title,
  description,
  image,
  mainTopic,
  tags,
  authorId,
  socialMediaLinks,
  setLoader,
  modalCloseButton,
  getBlogs
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("mainTopic", mainTopic);
  formData.append("tags", tags);
  formData.append("authorId", authorId);
  formData.append("socialMediaLinks", JSON.stringify(socialMediaLinks));

  if (image) {
    formData.append("image", image);
  }

  const jsonData = await fetchData("/api/v1/blogs", "POST", formData, true);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getBlogs();
  modalCloseButton.current.click();

  return { success, message };
};

const CreateBlogModal = ({ getBlogs }) => {
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [mainTopic, setMainTopic] = useState("");
  const [tags, setTags] = useState([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: "",
    linkedin: "",
    youtube: "",
  });

  const modalCloseButton = useRef();
  const fileInputRef = useRef(); // ✅ file input ref

  const authorId = Cookies.get("id");

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setTags(tagsArray.slice(0, 5));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  // ✅ Image remove handler
  const handleRemoveImage = () => {
    setImage(null);
    fileInputRef.current.value = ""; // file input clear করো
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSocialMediaLinks((prevLinks) => ({
      ...prevLinks,
      [name]: value,
    }));
  };

  return (
    <>
      <Modal
        modalId={"createBlog"}
        modalHeader={"Create Blog"}
        modalCloseButton={modalCloseButton}
      >
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
          <ReactQuill value={description} onChange={setDescription} />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            ref={fileInputRef} // ✅ ref add করো
          />
          {image && (
            <div style={{ position: "relative", display: "inline-block", marginTop: "10px" }}>
              <img
                src={URL.createObjectURL(image)}
                alt="Blog"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              {/* ✅ Remove button */}
              <button
                onClick={handleRemoveImage}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "1",
                }}
              >
                &times;
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Main Topic</label>
          <input
            type="text"
            className="form-control"
            value={mainTopic}
            onChange={(e) => setMainTopic(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Tags (comma separated, max 5)</label>
          <input
            type="text"
            className="form-control"
            value={tags.join(", ")}
            onChange={handleTagsChange}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Facebook</label>
          <input
            type="text"
            className="form-control"
            name="facebook"
            value={socialMediaLinks.facebook}
            onChange={handleSocialMediaChange}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">LinkedIn</label>
          <input
            type="text"
            className="form-control"
            name="linkedin"
            value={socialMediaLinks.linkedin}
            onChange={handleSocialMediaChange}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">YouTube</label>
          <input
            type="text"
            className="form-control"
            name="youtube"
            value={socialMediaLinks.youtube}
            onChange={handleSocialMediaChange}
          />
        </div>

        {loader ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createBlog(
                  title,
                  description,
                  image,
                  mainTopic,
                  tags,
                  authorId,
                  socialMediaLinks,
                  setLoader,
                  modalCloseButton,
                  getBlogs
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

export default CreateBlogModal;