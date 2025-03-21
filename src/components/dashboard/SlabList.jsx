import React, { useCallback, useEffect, useState } from "react";
import fetchData from "../../libs/api";
import Slab from "./Slab";

const SlabList = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalSubCategory, setTotalSubCategory] = useState(0);
  const [totalSubSubCategory, setTotalSubSubCategory] = useState(0);
  const [totalServiceOrder, setTotalServiceOrder] = useState(0);
  const [totalFreeConsultancy, setTotalFreeConsultancy] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalDeal, setTotalDeal] = useState(0);

  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");

  const getTotalSlabData = useCallback(() => {
    setLoader(true);

    // total services
    fetchData(`/api/v1/categories/count/active`, "GET")
      .then((result) => {
        if (result.success) {
          setTotalCategory(result.data.count);
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        console.debug(error);
      })
      .finally(() => {
        setLoader(false);
      });

    // total sub services
    fetchData(`/api/v1/subcategories/count/active`, "GET")
      .then((result) => {
        if (result.success) {
          setTotalSubCategory(result.data.count);
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        console.debug(error);
      })
      .finally(() => {
        setLoader(false);
      });

    // total sub sub services
    fetchData(`/api/v1/subsubcategories/count/active`, "GET")
      .then((result) => {
        if (result.success) {
          setTotalSubSubCategory(result.data.count);
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        console.debug(error);
      })
      .finally(() => {
        setLoader(false);
      });

    // total orders
    fetchData(`/api/v1/contacts/count/active?isFreeContact=false`, "GET")
      .then((result) => {
        if (result.success) {
          setTotalServiceOrder(result.data.count);
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        console.debug(error);
      })
      .finally(() => {
        setLoader(false);
      });

    // free consultancy
    fetchData(`/api/v1/contacts/count/active?isFreeContact=true`, "GET")
      .then((result) => {
        if (result.success) {
          setTotalFreeConsultancy(result.data.count);
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        console.debug(error);
      })
      .finally(() => {
        setLoader(false);
      });

    // total products
    fetchData(`/api/v1/products/count/active?isDeal=false`, "GET")
      .then((result) => {
        if (result.success) {
          setTotalProduct(result.data.count);
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        console.debug(error);
      })
      .finally(() => {
        setLoader(false);
      });

    // total deals
    fetchData(`/api/v1/products/count/active?isDeal=true`, "GET")
      .then((result) => {
        if (result.success) {
          setTotalDeal(result.data.count);
        } else {
          setMessage(result.message);
        }
      })
      .catch((error) => {
        console.debug(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    getTotalSlabData();
  }, [getTotalSlabData]);

  return (
    <>
      <Slab title={"Services"} amount={totalCategory} />
      <Slab title={"Sub Services"} amount={totalSubCategory} />
      <Slab title={"Sub Sub Services"} amount={totalSubSubCategory} />
      <Slab title={"Service Orders"} amount={totalServiceOrder} />
      <Slab title={"Free Consultancy"} amount={totalFreeConsultancy} />
      <Slab title={"Products"} amount={totalProduct} />
      <Slab title={"Deals"} amount={totalDeal} />
    </>
  );
};

export default SlabList;
