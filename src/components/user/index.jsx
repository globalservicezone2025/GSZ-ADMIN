import { useCallback, useEffect, useState } from "react";
import fetchData from "../../libs/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import "../css/category-list.css";
import ActionButton from "../global/ActionButton";
import ActionButtonMenu from "../global/ActionButtonMenu";
import Button from "../global/Button";
import CardHeader from "../global/CardHeader";
import IndianaDragScroller from "../global/IndianaDragScroller";
import Searchbar from "../global/Searchbar";
import CreateUser from "./CreateUser";
import DeleteUser from "./DeleteUser";
import EditUser from "./EditUser";
import Loader from "../global/Loader";

const UserList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");

  const [roles, setRoles] = useState([]);

  const loadMoreUser = useCallback(() => {
    setPage(page + 1);
  }, [page]);

  const getUsers = useCallback(() => {
    setLoader(true);

    fetchData(
      `/api/v1/auth/users?name=${
        selectedQuery === "name" ? searchTerm : ""
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
    const getUsersDebounce = setTimeout(() => {
      getUsers();
    }, 500);

    return () => clearTimeout(getUsersDebounce);
  }, [selectedQuery, searchTerm, page, limit]);

  const excludedEmails = [
    "shamimrahman920@gmail.com",
    "deepta.barua@northsouth.edu",
    "mahfuj.jim2@gmail.com",
  ];

  return (
    <>
      {/* add modal */}
      <CreateUser getUsers={getUsers} roles={roles} />

      {/* table */}
      <div className="col-lg-12">
        <div className="card">
          <CardHeader
            title={"Users"}
            modalId={"#createUser"}
            buttonText={"+"}
            btnClass={"btnAdd"}
            totalCount={data ? data.length - 3  : 0}
          >
            <Searchbar
              queries={["name"]}
              selectedQuery={selectedQuery}
              setSelectedQuery={setSelectedQuery}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </CardHeader>

          <div className="card-body">
            {loader ? (
              <Loader />
            ) : (
              <div className="table-responsive">
                <IndianaDragScroller>
                  <table className="table table-responsive-md">
                    <thead>
                      <tr>
                        <th className="width80">#</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data
                        .filter(
                          (item) =>
                            !excludedEmails.includes(item.email)
                        )
                        .map((item, index) => (
                          <tr key={item.id + index}>
                            <td>
                              <strong>{index + 1}</strong>
                            </td>
                            <td>{item?.name}</td>
                            <td>{item?.designation}</td>
                            <td>{item?.email}</td>
                            <td>{item?.phone}</td>
                            <td>{item?.address}</td>

                            <td>
                              <ActionButton>
                                <ActionButtonMenu
                                  menuName={"Edit"}
                                  menuTarget={"#editUser" + item.id}
                                />
                                <ActionButtonMenu
                                  menuName={"Delete"}
                                  menuTarget={"#deleteUser" + item.id}
                                />
                              </ActionButton>
                            </td>
                            <EditUser
                              item={item}
                              getUsers={getUsers}
                              roles={roles}
                            />
                            <DeleteUser item={item} getUsers={getUsers} />
                          </tr>
                        ))}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th className="width80">#</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Action</th>
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
                        buttonOnClick={() => loadMoreUser()}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;