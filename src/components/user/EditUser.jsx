import React, { useRef, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import Button from "../global/Button";
import Loader from "../global/Loader";
import Modal from "../global/Modal";

const editUser = async (
  item,
  name,
  email,
  phone,
  address,
  designation,
  image,
  setLoader,
  getUsers,
  modalCloseButton
) => {
  setLoader(true);

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("address", address);
  formData.append("billing_address", "");
  formData.append("country", "");
  formData.append("city", "");
  formData.append("designation", designation);
  formData.append("initialPaymentAmount", parseFloat(0));
  formData.append("initialPaymentDue", parseFloat(0));
  formData.append("installmentTime", parseFloat(0));
  if (image) {
    formData.append("image", image);
  }

  try {
    const jsonData = await fetchData(`/api/v1/auth/users/${item.id}`, "PUT", formData, true);

    const message = jsonData.message;
    const success = jsonData.success;

    if (!success) {
      setLoader(false);
      showErrorToast(message);
<<<<<<< HEAD
      throw { message };
=======
>>>>>>> f0b93f2abbe66aa21a08402b98779c1f6471065a
    }

    setLoader(false);
    showSuccessToast(message);
    getUsers();
    // modalCloseButton.current.click();

    return { success, message };
  } catch (error) {
    setLoader(false);
    console.error("Error updating user:", error);
    showErrorToast("An error occurred while updating the user.");
    throw error;
  }
};

const EditUser = ({ item, getUsers }) => {
  const [loader, setLoader] = useState(false);
  const [designation, setDesignation] = useState(item.designation);
  const [name, setName] = useState(item.name);
  const [email, setEmail] = useState(item.email);
  const [phone, setPhone] = useState(item.phone);
  const [address, setAddress] = useState(item.address);
  const [image, setImage] = useState(null);

  const modalCloseButton = useRef();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <>
      <Modal
        modalId={"editUser" + item.id}
        modalHeader={"Edit User"}
        modalCloseButton={modalCloseButton}
      >
        <div className="form-group">
          <label className="text-black font-w500">Designation</label>
          <input
            type="text"
            className="form-control"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
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
                editUser(
                  item,
                  name,
                  email,
                  phone,
                  address,
                  designation,
                  image,
                  setLoader,
                  getUsers,
                  modalCloseButton
                )
              }
              buttonText={"Update"}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default EditUser;