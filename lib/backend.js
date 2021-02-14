import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  //headers: { "X-API-Key": process.env.SHOWTIME_FRONTEND_API_KEY },
});
