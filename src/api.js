import axios from "axios";

export const getData = async () => {
  const { data } = await axios.get(
    "http://personio-fe-test.herokuapp.com/api/v1/candidates"
  );
  return data.data;
};
