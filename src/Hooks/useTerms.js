import { useEffect, useState } from "react";
import { getTermsAndConditions } from "../Functions/functions";

const useTerms = () => {
  const [terms, setTerms] = useState("");
  const [termsLoading, setTermsLoading] = useState(false);

  const fetchTermsAndConditions = async () => {
    setTermsLoading(true);
    try {
      const data = await getTermsAndConditions();
        setTerms(data?.data?.data);
    } catch (err) {
      setTermsLoading(false);
      console.log(err, "error");
    } finally {
      setTermsLoading(false);
    }
  };

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  return { terms, termsLoading };
};

export default useTerms;
