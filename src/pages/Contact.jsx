import React from "react";
import ContactList from "../components/contact";

const Contact = ({ isFreeContact = false }) => {
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <ContactList isFreeContact={isFreeContact} />
        </div>
      </div>
    </div>
  );
};

export default Contact;
