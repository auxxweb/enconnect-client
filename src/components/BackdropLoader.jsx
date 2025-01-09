/* eslint-disable react/prop-types */
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Loader from '../components/Loader/Loader'
export default function BackdropLoader({ open }) {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        < Loader/>
      </Backdrop>
    </div>
  );
}
