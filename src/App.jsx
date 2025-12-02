import { Suspense, lazy } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Preloader from "./components/Preloader";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavHeader from "./components/NavHeader";
import Sidebar from "./components/Sidebar";
import Auth from "./libs/auth";
import Slider from "./pages/Slider";
import ECategory from "./pages/ECategory";
import EProduct from "./pages/EProduct";
import Discount from "./pages/Discount";
import Color from "./pages/Color";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Module = lazy(() => import("./pages/Module"));
const Role = lazy(() => import("./pages/Role"));
const User = lazy(() => import("./pages/User"));
const Category = lazy(() => import("./pages/Category"));
const Campaign = lazy(() => import("./pages/Campaign"));
const Product = lazy(() => import("./pages/Product"));
const Supplier = lazy(() => import("./pages/Supplier"));
const MonthlyPayment = lazy(() => import("./pages/MonthlyPayment"));
const Order = lazy(() => import("./pages/Order"));
const Banner = lazy(() => import("./pages/Banner"));
const Brand = lazy(() => import("./pages/Brand"));
const Subcategory = lazy(() => import("./pages/Subcategory"));
const Subsubcategory = lazy(() => import("./pages/Subsubcategory"));
const Coupon = lazy(() => import("./pages/Coupon"));
const Preorder = lazy(() => import("./pages/Preorder"));
const Newsletter = lazy(() => import("./pages/Newsletter"));
const Contact = lazy(() => import("./pages/Contact"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Faq = lazy(() => import("./pages/Faq"));
const Blog = lazy(() => import("./pages/Blog"));
const Attribute = lazy(() => import("./pages/Attribute"));
const ProductImage = lazy(() => import("./pages/ProductImage"));
const Deals = lazy(() => import("./pages/Deals"));

function App() {
  const { pathname } = useLocation();

  const additionalProps = {
    isFreeContact:true
  };

  return (
    <>
      <ToastContainer />

      <div id="main-wrapper">
        {pathname !== "/" && (
          <>
            <NavHeader />
            <Header />
            <Sidebar />
          </>
        )}

        <Suspense fallback={<Preloader />}>
          <Switch>
            <>
              <Route exact path="/dashboard" component={Auth(Dashboard)} />
              <Route exact path="/modules" component={Auth(Module)} />
              <Route exact path="/roles" component={Auth(Role)} />
              <Route exact path="/users" component={Auth(User)} />
              <Route exact path="/services" component={Auth(Category)} />
              <Route exact path="/ecategory" component={Auth(ECategory)} />
              <Route exact path="/colors" component={Auth(Color)} />
              <Route exact path="/eproduct" component={Auth(EProduct)} />
              <Route exact path="/discounts" component={Auth(Discount)} />
              <Route exact path="/products" component={Auth(Product)} />
              <Route exact path="/deals" component={Auth(Deals)} />
              <Route exact path="/suppliers" component={Auth(Supplier)} />
              <Route
                exact
                path="/monthly-payments"
                component={Auth(MonthlyPayment)}
              />
              <Route exact path="/orders" component={Auth(Order)} />
              <Route exact path="/banners" component={Auth(Banner)} />
              <Route exact path="/sliders" component={Auth(Slider)} />
              <Route exact path="/brands" component={Auth(Brand)} />
              <Route exact path="/subservices" component={Auth(Subcategory)} />
              <Route exact path="/servicedetails" component={Auth(Subsubcategory)} />
              <Route exact path="/coupons" component={Auth(Coupon)} />
              <Route exact path="/preorders" component={Auth(Preorder)} />
              <Route exact path="/newsletters" component={Auth(Newsletter)} />
              <Route
                exact
                path="/serviceorders"
                render={(props) => <Contact {...props} />}
              />
              <Route
                exact
                path="/freeconsultancy"
                render={(props) => <Contact {...props} {...additionalProps} />}
              />
              {/* <Route exact path="/pricing" component={Auth(Pricing)} /> */}
              <Route exact path="/faq" component={Auth(Faq)} />
              <Route exact path="/blog" component={Auth(Blog)} />
              <Route exact path="/banner" component={Auth(Banner)} />
              <Route exact path="/attributes/:id" component={Auth(Attribute)} />
              <Route
                exact
                path="/products/images/:id"
                component={Auth(ProductImage)}
              />
              <Route exact path="/" component={LoginPage} />
            </>
          </Switch>
        </Suspense>
        {pathname !== "/" && <Footer />}
      </div>
    </>
  );
}

export default App;