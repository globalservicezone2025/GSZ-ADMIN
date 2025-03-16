import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const createUser = async (
  name,
  email,
  phone,
  address,
  roleId,
  image,
  setLoader,
  modalCloseButton,
  getUsers
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("address", address);
  formData.append("billing_address", address);
  formData.append("country", address);
  formData.append("city", "address");
  formData.append("roleId", roleId);
  formData.append("initialPaymentAmount", parseFloat(0));
  formData.append("initialPaymentDue", parseFloat(0));
  formData.append("installmentTime", parseFloat(0));
  if (image) {
    formData.append("image", image);
  }

  try {
    const jsonData = await fetchData("/api/register", "POST", formData, true);

    const message = jsonData.message;
    const success = jsonData.success;

    if (!success) {
      setLoader(false);
      showErrorToast(message);
      return { success, message };
    }

    setLoader(false);
    showSuccessToast(message);

    //fetch data
    getUsers();

    //close modal
    modalCloseButton.current.click();

    return { success, message };
  } catch (error) {
    setLoader(false);
    showErrorToast("An error occurred while creating the user.");
    throw error;
  }
};

const CreateUser = ({ getUsers, roles }) => {
  const [loader, setLoader] = useState(false);
  const [roleId, setRoleId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  const modalCloseButton = useRef();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <Modal
        modalId={"createUser"}
        modalHeader={"Create User"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Role</label>
          <select
            name="role"
            id="role"
            className="form-control"
            onChange={(e) => setRoleId(e.target.value)}
          >
            <option value="">Select a role</option>

            {roles &&
              roles.map((role, index) => (
                <option value={role?.id} key={role?.id + index}>
                  {role?.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group">
          <label className="text-black font-w500">User Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Email</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Phone</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="text-black font-w500">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>

        {loader === true ? (
          <Loader />
        ) : (
          <div className="form-group">
            <Button
              buttonOnClick={() =>
                createUser(
                  name,
                  email,
                  phone,
                  address,
                  roleId,
                  image,
                  setLoader,
                  modalCloseButton,
                  getUsers
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

export default CreateUser;