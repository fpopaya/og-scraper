import axios from "axios";
import { extractOgData } from "../utils/cheerioUtils";

export const getOgData = async (url: string) => {
  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  return extractOgData(data);
};