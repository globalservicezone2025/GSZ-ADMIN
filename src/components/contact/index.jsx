import React, { useCallback, useEffect, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/category-list.css";
import Button from "../global/Button";
import CardHeader from "../global/CardHeader";
import IndianaDragScroller from "../global/IndianaDragScroller";
import Searchbar from "../global/Searchbar";

const ContactList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const loadMoreContacts = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getContacts = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/contacts?${selectedQuery}=${
        selectedQuery ? searchTerm : ""
      }&page=${searchTerm.length > 2 ? "" : page}&limit=${
        searchTerm.length > 2 ? "" : limit
      }`,
      "GET"
    )
      .then((result) => {
        if (result.success) {
          if (searchTerm.length > 2) {
            if (page > 1) {
              setPage(1);
              setData([]);
            }
            setData(result.data);
          } else if (page > 1) {
            setData([...data, ...result.data]);
          } else {
            setData(result.data);
          }
          setMessage(result.message);
        } else {
          showSuccessToast(result.message);
          setMessage(result.message);
        }
      })
      .catch((error) => {
        showErrorToast(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [selectedQuery, searchTerm, page, limit]);

  useEffect(() => {
    const getContactsDebounce = setTimeout(() => {
      getContacts();
    }, 500);

    return () => clearTimeout(getContactsDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  return (
    <>
      {/* table */}
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Contact Messages"}
            hasButton={false}
            totalCount={data ? data.length : 0}
          >
            <Searchbar
              queries={["name", "email"]}
              selectedQuery={selectedQuery}
              setSelectedQuery={setSelectedQuery}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </CardHeader>

          <div className="card-body">
            <div className="table-responsive">
              <IndianaDragScroller>
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th className="width80">#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Country</th>
                      <th>Phone Number</th>
                      <th>Hear From</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Description</th>
                      <th>Active</th>
                      <th>Service</th>
                      <th>Created At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data ? (
                      data.map((item, index) => (
                        <tr key={item.id + index}>
                          <td>
                            <strong>{index + 1}</strong>
                          </td>
                          <td>{item.firstName}</td>
                          <td>{item.lastName}</td>
                          <td>{item.email}</td>
                          <td>{item.country}</td>
                          <td>{item.phoneNumber}</td>
                          <td>{item.hearFrom}</td>
                          <td>{item.date?.slice(0, 10)}</td>
                          <td>{item.time?.slice(11, 19)}</td>
                          <td>{item.description}</td>
                          <td>{item.isActive ? "Active" : "Inactive"}</td>
                          <td>{item.subcategory.name}</td>
                          <td>{item.createdAt?.slice(0, 10)}</td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="col-md-12 text-center">
                          <td></td>
                          <td>{message}</td>
                          <td></td>
                        </tr>
                      </>
                    )}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th className="width80">#</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Country</th>
                      <th>Phone Number</th>
                      <th>Hear From</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Description</th>
                      <th>Active</th>
                      <th>Created At</th>
                    </tr>
                  </tfoot>
                </table>
              </IndianaDragScroller>

              <div className="col-md-12 text-center">
                {data?.length === limit * page && (
                  <>
                    <Button
                      buttonText={"Load more"}
                      fontSize={"11px"}
                      buttonOnClick={() => loadMoreContacts()}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactList;