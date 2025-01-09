import { useEffect, useState } from "react";
import { fetchBusinessTemplate } from "../Functions/functions";
import { useParams } from "react-router-dom";

const useBusiness = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [businessData, setBusinessData] = useState({});
  const [closeDays, setCloseDays] = useState([]);
  const allDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const businessDetails = await fetchBusinessTemplate(id);
      setBusinessData(businessDetails?.data);
      const closed = allDays.filter(
        (day) =>
          !businessDetails.data.businessTiming.workingDays
            .map((d) => d.toLowerCase())
            .includes(day)
      );
      setCloseDays(closed);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  return {
    loading,
    businessData,
    closeDays,
  };
};

export default useBusiness;
