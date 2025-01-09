import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  resetBusinessState,
  updateBusinessDetails,
} from "../store/businessSlice";
import {
  CreateBusinessDetails,
  FetchPlans,
} from "../../../Functions/functions";
import Loader from "../../../components/Loader/Loader";
import { updatePlanDetails } from "../store/subscriptionPlanSlice";
import { Spinner } from "react-bootstrap";

const Subscription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false)
  const [planData, setPlanData] = useState([]);

  function planSubmit(id, price, name) {
    setSubmitLoading(true)
    var freePlan = import.meta.env.VITE_APP_FREE_PLAN_ID ?? "6735fef4c124792981be3ffb";
    if (String(id) != String(freePlan)) {
      console.log("first", freePlan, "free plan", id);
      dispatch(updateBusinessDetails({ selectedPlan: id }));
      dispatch(updatePlanDetails({ name, price, plan: id }));
      navigate("/create-business/template");
    } else {
      const submitData = async () => {
        console.log("second");
        dispatch(updateBusinessDetails({ selectedPlan: id }));
        const requestBody = { ...businessState };
        requestBody.selectedPlan = id;
        const res = await CreateBusinessDetails(requestBody);
        const resId = res?.data?._id || res?.data?.data?._id;
        const resName = res?.data?.businessName || res?.data?.data?.businessName;

        if (res.success) {
          navigate(`/profile/${resName}/${resId}`);          // dispatch(resetBusinessState());
        }
      };
      submitData();
    }
    setSubmitLoading(false)
  }

  const handlePrevStep = () => navigate("/create-business/gallery");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plans = await FetchPlans();
        setPlanData(plans?.data?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-100vh text-center ">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-3 "> {loading && <Loader />}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-100vh create-business-div">
        <div className="row h-100 justify-content-center">
          <span style={{ color: "grey" }}></span>
          {/* Left Image Section - Hidden on small screens */}
          <div className="d-none d-md-block left-portion p-0 col-md-5 h-100">
            <img
              src="/images/subscription.jpg"
              alt=""
              className="w-100 h-100"
            />
          </div>
          {/* Right Form Section */}
          <div className="col-12 col-md-7 row justify-content-center h-100 p-3 p-md-5 right-portion">
            <div className="col-12 text-start">
              <button
                className="btn btn-dark w-auto float-start"
                onClick={handlePrevStep}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 text-center">
                <h1 className="fw-bold">Add Subscriptions</h1>
              </div>
              <div className="col-12">
                <div className="row justify-content-center">
                  {/* Free Plan */}
                  {planData?.map((plan, index) => (
                    <div className="col-12 col-md-6 mb-4" key={index}>
                      <div className="card br-20 b-theme2 shadow-lg border-0 overflow-hidden">
                        <div className="p-4">
                          <div className="col-12 text-center mb-3">
                            <span className="fw-bold fs-20 text-dark">
                              {plan?.plan}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                            <div className="price-section">
                              <h5
                                className="fs-16 text-muted text-decoration-line-through mb-0"
                                style={{ color: "gray" }}
                              >
                                ₹{plan?.actualAmount}
                              </h5>
                              <h2 className="fw-bold fs-28 mt-0 text-primary mb-0">
                                ₹{plan?.amount}
                              </h2>
                            </div>
                            <div className="validity-section text-end">
                              <span className="text-dark fw-bold fs-16">
                                Validity{" "}
                                <span style={{ color: "blue" }}>
                                  {plan?.validity} year
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="col-12 mt-4">
                            {plan?.description.map((data, descIndex) => (
                              <div
                                className="d-flex align-items-center mt-2"
                                key={descIndex}
                              >
                                <span className="subscription-tick bg-light text-success me-2">
                                  <i className="bi bi-check"></i>
                                </span>
                                <span className="fs-14 text-dark">{data}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            {submitLoading ? <Spinner variant="primary" /> : <button
                              className="btn w-100 text-white py-2 fw-bold"
                              onClick={() =>
                                planSubmit(plan._id, plan.amount, plan.plan)
                              }
                              style={{ backgroundColor: "#5b7ee8" }}
                            >
                              Choose Plan
                            </button>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`.card {
  border-radius: 20px;
  background-color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.br-20 {
  border-radius: 20px;
}

.b-theme2 {
  background-color: #f8f9fa;
}

.fs-20 {
  font-size: 20px; /* Smaller title font */
}

.fs-28 {
  font-size: 28px; /* Reduced font size for amount */
}

.fs-16 {
  font-size: 16px; /* Font size for validity */
}

.fs-14 {
  font-size: 14px; /* Font size for description text */
}

.text-primary {
  color: #5b7ee8;
}

.text-dark {
  color: #343a40;
}

.text-muted {
  color: #6c757d;
}

.fw-medium {
  font-weight: 500;
}

.fw-bold {
  font-weight: 700;
}

.price-section {
  text-align: left;
}

.validity-section {
  text-align: right;
}

.subscription-tick {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #ddd;
  color: #28a745;
}

.btn {
  border-radius: 10px;
  font-weight: 600;
  background-color: #5b7ee8;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #4a6fca;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.me-2 {
  margin-right: 0.5rem;
}

.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}
`}
      </style>
    </>
  );
};

export default Subscription;
