import React, { useState, useRef } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const editBlog = async (
  id,
  title,
  description,
  image,
  mainTopic,
  tags,
  socialMediaLinks,
  setLoader,
  modalCloseButton,
  getData
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("mainTopic", mainTopic);
  formData.append("tags", tags);
  formData.append("socialMediaLinks", JSON.stringify(socialMediaLinks));

  if (image) {
    formData.append("image", image);
  }

  const jsonData = await fetchData(`/api/v1/blogs/${id}`, "PUT", formData, true);

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

const BlogEditModal = ({ blog, getData }) => {
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [description, setDescription] = useState(blog.description);
  const [image, setImage] = useState(null);
  const [mainTopic, setMainTopic] = useState(blog.mainTopic);
  const [tags, setTags] = useState(blog.tags);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    facebook: blog.socialMediaLinks?.facebook || "",
    linkedin: blog.socialMediaLinks?.linkedin || "",
    youtube: blog.socialMediaLinks?.youtube || "",
  });

  const modalCloseButton = useRef();

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setTags(tagsArray.slice(0, 5)); // Limit to 5 tags
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
        modalId={`blogEditModal${blog.id}`}
        modalHeader={"Edit Blog"}
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
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Blog"
              style={{ width: "100px", height: "100px", marginTop: "10px" }}
            />
          ) : (
            blog.image && (
              <img
                src={blog.image}
                alt="Blog"
                style={{ width: "100px", height: "100px", marginTop: "10px" }}
              />
            )
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
                editBlog(
                  blog.id,
                  title,
                  description,
                  image,
                  mainTopic,
                  tags,
                  socialMediaLinks,
                  setLoader,
                  modalCloseButton,
                  getData
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

export default BlogEditModal;