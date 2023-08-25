import axios from "axios";

export default async function handler(req, res) {
  const { url, method, body } = req.query;

  try {
    const response = await axios({
      url,
      method: method || "GET",
      data: body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
}
