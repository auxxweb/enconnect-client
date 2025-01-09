import "/src/assets/css/TermsAndConditions.css";
import { Box, Typography } from "@mui/material";
import useTerms from "../../Hooks/useTerms";
import Header from "../Header";
import Loader from '../Loader/Loader'

const TermsAndConditions = () => {
  const { terms, termsLoading } = useTerms();

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <Header />
      <Box className="terms-container" mt={16} px={5}>
        <h1>Terms and Conditions</h1>
        <Typography
          component="div"
          dangerouslySetInnerHTML={{ __html: terms }}
          // sx={{ fontSize: "1rem", color: "text.primary" }}
        />
      </Box>
      {termsLoading && <Loader />}
    </Box>
  );
};

export default TermsAndConditions;
