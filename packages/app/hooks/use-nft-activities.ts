import { useEffect, useState } from "react";

import { NFT } from "app/constants/endpoints";
import { axios } from "app/lib/axios";

const useNFTActivities = ({ nftId }: { nftId: number }) => {
  const [nftActivities, setNftActivities] = useState([]);

  const handleGetHistory = async (id: number) => {
    try {
      const response = await axios({
        url: NFT.ACTIVITIES(id),
        method: "GET",
      });
      console.log(response);
      setNftActivities(response?.data?.history || []);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetHistory(nftId);
  }, []);

  return { nftActivities };
};

export default useNFTActivities;
