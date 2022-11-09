import { axios } from "app/lib/axios";

export const useDeleteUser = () => {
  const deleteUser = () => {
    return axios({
      method: "DELETE",
      url: "/v1/profile/delete",
      data: {},
    });
  };

  return {
    deleteUser,
  };
};
