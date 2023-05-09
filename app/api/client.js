import axios from "axios";

const client = axios.create({ baseURL: "http://172.16.3.88:4848/api" });

export default client;
