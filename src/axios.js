import axios from "axios";

const instance = axios.create({
  baseURL: "https://instagram-mern-7.herokuapp.com",
});

export default instance;
