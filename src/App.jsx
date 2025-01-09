import { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "primereact/resources/themes/saga-blue/theme.css"; // You can change the theme if desired
import "primereact/resources/primereact.min.css"; // Core CSS for PrimeReact components
import "primeicons/primeicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "/src/assets/css/style.css";
import "/src/assets/css/template.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import the necessary components
// import CreateBusiness from "./containers/CreateBusiness";
import Business from "./containers/Business";
import Testimonials from "./containers/Testimonials";
import Template from "./containers/Template";
import PremiumTemplate from "./containers/PremiumTemplate";
import TermsAndConditions from "./components/Business/TermsAndConditions";
import BusinessTermsAndConditions from "./components/Business/BusinessTermsAndConditions";
import Loader from "./components/Loader/Loader";
import ShareButton from "./components/ShareButton";
import NotFound from "./components/NotFound";

// Lazy loading components
const Home = lazy(() =>
  import("./views/Home")
);
// const Business = lazy(() => import("./containers/Business"));
// const Testimonials = lazy(() => import("./containers/Testimonials"));
// const Template = lazy(() => import("./containers/Template"));
// const PremiumTemplate = lazy(() => import("./containers/PremiumTemplate"));
// const TermsAndConditions = lazy(() =>
//   import("./components/Business/TermsAndConditions")
// );
// const BusinessTermsAndConditions = lazy(() =>
//   import("./components/Business/BusinessTermsAndConditions")
// );

// CreateBusiness Steps
const AuthenticationDetails = lazy(() =>
  import("./views/CreateBusiness/steps/AuthenticationDetails")
);
const BusinessDetails = lazy(() =>
  import("./views/CreateBusiness/steps/BusinessDetails")
);
const ContactDetails = lazy(() =>
  import("./views/CreateBusiness/steps/ContactDetails")
);
const CategoryDetails = lazy(() =>
  import("./views/CreateBusiness/steps/CategoryDetails")
);
const BusinessTiming = lazy(() =>
  import("./views/CreateBusiness/steps/BusinessTiming")
);
const BusinessDesc = lazy(() =>
  import("./views/CreateBusiness/steps/BusinessDesc")
);
const LandingPageDetails = lazy(() =>
  import("./views/CreateBusiness/steps/LandingPageDetails")
);
const CreateServices = lazy(() =>
  import("./views/CreateBusiness/steps/CreateServices")
);
const CreateCoreServices = lazy(() =>
  import("./views/CreateBusiness/steps/CreateCoreServices")
);
const CreateProductPart = lazy(() =>
  import("./views/CreateBusiness/steps/CreateProductPart")
);
const SeoDetails = lazy(() =>
  import("./views/CreateBusiness/steps/SeoDetails")
);
const MoreImages = lazy(() =>
  import("./views/CreateBusiness/steps/MoreImages")
);
const Subscription = lazy(() =>
  import("./views/CreateBusiness/steps/Subscription")
);
const PreviewTemplates = lazy(() =>
  import("./views/CreateBusiness/steps/PreviewTemplates")
);
const Razorpay = lazy(() => import("./views/CreateBusiness/steps/Razorpay"));

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  {
    path: "/create-business",
    children: [
      { path: "", element: <AuthenticationDetails /> },
      { path: "details", element: <BusinessDetails /> },
      { path: "contact", element: <ContactDetails /> },
      { path: "category", element: <CategoryDetails /> },
      { path: "timing", element: <BusinessTiming /> },
      { path: "description", element: <BusinessDesc /> },
      { path: "landing", element: <LandingPageDetails /> },
      { path: "core-services", element: <CreateCoreServices /> },
      { path: "services", element: <CreateServices /> },
      { path: "product", element: <CreateProductPart /> },
      { path: "seo", element: <SeoDetails /> },
      { path: "gallery", element: <MoreImages /> },
      { path: "subscription", element: <Subscription /> },
      { path: "template", element: <PreviewTemplates /> },
      { path: "payment", element: <Razorpay /> },
    ],
  },
  { path: "/reviews", element: <Testimonials /> },
  { path: "/business", element: <Business /> },
  { path: "/category/:id", element: <Business /> },
  // { path: "/business/:id", element: (<div className="relative"><Template /></div>),},
  { path: "/profile/:name/:id", element: (<div className="relative"><Template /></div>) },
  { path: "/profile/premium/:name/:id", element: <PremiumTemplate /> },
  { path: "/terms-and-conditions", element: <TermsAndConditions /> },
  {
    path: "/terms-and-conditions/:id",
    element: <BusinessTermsAndConditions />,
  },
  { path: "*", element: <NotFound/> },
]);

function App() {


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default App;
