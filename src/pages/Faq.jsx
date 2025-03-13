import React from "react";
import FaqList from "../components/faqs";

const Faq = () => {
  return (
    <div className="content-body">
      <div className="container-fluid">
        <div className="row">
          <FaqList />
        </div>
      </div>
    </div>
  );
};

export default Faq;
