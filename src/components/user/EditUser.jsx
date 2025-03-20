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
  setLoader,
  getUsers,
  modalCloseButton
) => {
  setLoader(true);

  const jsonData = await fetchData(`/api/v1/auth/users/${item.id}`, "PUT", {
    name,
    email,
    phone,
    address,
    billing_address: "",
    country: "",
    city: "",
    designation,
    initialPaymentAmount: parseFloat(0),
    initialPaymentDue: parseFloat(0),
    installmentTime: parseFloat(0),
  });

  const message = jsonData.message;
  const success = jsonData.success;

  if (!success) {
    setLoader(false);
    showErrorToast(message);
    throw { message };
  }

  setLoader(false);
  showSuccessToast(message);
  getUsers();
  modalCloseButton.current.click();

  return { success, message };
};

const EditUser = ({ item, getUsers }) => {
  const [loader, setLoader] = useState(false);
  const [designation, setDesignation] = useState(item.designation);
  const [name, setName] = useState(item.name);
  const [email, setEmail] = useState(item.email);
  const [phone, setPhone] = useState(item.phone);
  const [address, setAddress] = useState(item.address);

  const modalCloseButton = useRef();

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