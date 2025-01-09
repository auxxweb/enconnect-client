import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  price: "",
  name: "",
  plan:""
};

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlanDetails",
  initialState,
  reducers: {
    updatePlanDetails: (state, action) => ({ ...state, ...action.payload }),
    resetPlanState: () => initialState,
  },
});

export const { updatePlanDetails, resetPlanState } =
  subscriptionPlanSlice.actions;
export default subscriptionPlanSlice.reducer;
