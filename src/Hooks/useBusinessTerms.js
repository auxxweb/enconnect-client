import { useEffect, useState } from "react";
import { getBusinessTermsAndConditions } from "../Functions/functions";

const useBusinessTerms = (id) => {
  const [businessTerms, setBusinessTerms] = useState("");
  const [termsLoading, setTermsLoading] = useState(false);

  const fetchBusinessTermsAndConditions = async () => {
    setTermsLoading(true);
    try {
      const data = await getBusinessTermsAndConditions(id);
      console.log(data, "data terms")
      setBusinessTerms(data?.data?.data);
    } catch (err) {
      setTermsLoading(false);
      console.log(err, "error");
    } finally {
      setTermsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBusinessTermsAndConditions();
    }
  }, [id]);

  return { businessTerms, termsLoading };
};

export default useBusinessTerms;
