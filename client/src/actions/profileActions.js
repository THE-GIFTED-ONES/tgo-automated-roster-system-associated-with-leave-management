import axios from "axios";
import { GET_ERRORS, SET_PROFILE_PICTURE } from "./types";

// Set profile picture
export const updateProfilePicture = (data) => (dispatch) => {
  axios
    .post("/api/profile/picture", data)
    .then((res) =>
      dispatch({
        type: SET_PROFILE_PICTURE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
