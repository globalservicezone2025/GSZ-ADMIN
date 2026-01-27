import { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const createCareer = async (
  title,
  position,
  location,
  salary,
  description,
  lastDateToApply,
  visibility,
  getCareers,
  setLoader,
  modalCloseButton,
) => {
  setLoader(true);

  const data = {
    title,
    position,
    location,
    salary,
    description,
    lastDateToApply,
    visibility,
  };

  const jsonData = await fetchData("/api/v1/careers", "POST", data);

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    // eslint-disable-next-line no-throw-literal
    throw {
      message,
    };
  }

  setLoader(false);

  showSuccessToast(message);
  //fetch data
  getCareers();

  //close modal
  modalCloseButton.current.click();

  return { success, message };
};

const CreateCareer = ({ getCareers }) => {
  const [loader, setLoader] = useState(false);
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [lastDateToApply, setLastDateToApply] = useState("");
  const [visibility, setVisibility] = useState(true);

  const modalCloseButton = useRef();

  return (
    <>
      <Modal
        modalId={"createCareer"}
        modalHeader={"Create Career"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Senior Backend Engineer"
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Position</label>
          <input
            type="text"
            className="form-control"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Full-time"
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Remote / Dhaka"
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Salary</label>
          <input
            type="text"
            className="form-control"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g., 120000-150000"
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Description</label>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            placeholder="Job description..."
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Last Date to Apply</label>
          <input
            type="date"
            className="form-control"
            value={lastDateToApply}
            onChange={(e) => setLastDateToApply(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-black font-w500">Visibility</label>
          <select
            className="form-control"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value === "true")}
          >
            <option value="true">Visible</option>
            <option value="false">Hidden</option>
          </select>
        </div>

        {loader === true ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="form-group">
              <Button
                buttonOnClick={() =>
                  createCareer(
                    title,
                    position,
                    location,
                    salary,
                    description,
                    lastDateToApply,
                    visibility,
                    getCareers,
                    setLoader,
                    modalCloseButton,
                  )
                }
                buttonText={"Submit"}
              />
            </div>
          </>
        )}
      </Modal>
    </>
  );
};

export default CreateCareer;