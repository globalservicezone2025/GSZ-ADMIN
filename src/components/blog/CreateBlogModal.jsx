import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Include styles
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

  const payload = {
    title,
    description,
    image,
    mainTopic,
    tags,
    authorId,
    socialMediaLinks,
  };

  const jsonData = await fetchData("/api/v1/blogs", "POST", payload, false);

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
  const [image, setImage] = useState("");
  const [mainTopic, setMainTopic] = useState("");
  const [tags, setTags] = useState([]);
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  const modalCloseButton = useRef();

  const authorId = Cookies.get("id");

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setTags(tagsArray.slice(0, 5)); // Limit to 5 tags
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
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
          />
          {image && (
            <img
              src={image}
              alt="Blog"
              style={{ width: "100px", height: "100px", marginTop: "10px" }}
            />
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
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">LinkedIn</label>
          <input
            type="text"
            className="form-control"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">YouTube</label>
          <input
            type="text"
            className="form-control"
            value={youtube}
            onChange={(e) => setYoutube(e.target.value)}
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
                  { facebook, linkedin, youtube },
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