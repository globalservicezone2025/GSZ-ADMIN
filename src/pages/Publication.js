import React from "react";
//import AddOrderSidebar from "../components/AddOrderSidebar";
import PublicationList from "../components/PublicationList";

const Publication = () => {
  return (
    <>
      <div className="content-body">
        {/* <!-- row --> */}

        <div className="container-fluid">
          {/* <div class="page-titles">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="true">Table</a>
                </li>
                <li class="breadcrumb-item active">
                  <a href="true">Bootstrap</a>
                </li>
              </ol>
            </div> */}
          <div className="row">
            <PublicationList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Publication;
