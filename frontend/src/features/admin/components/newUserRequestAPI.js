import apiClient from "../../common/apiClient";

export async function fetchNewUserRequests(
  pagination,
  sort,
  request_type,
  request_status,
  user
) {
  let queryString = new URLSearchParams({
    ...pagination, // Assuming ITEMS_PER_PAGE is defined somewhere
    ...sort,
    request_type,
    request_status,
    user,

    // Add any additional parameters needed for filtering
  }).toString();

  const response = await apiClient.get(`/newUserRequests?${queryString}`);
  const totalNewUserRequests = parseInt(response.headers["x-total-count"], 10);

  return { newUserRequests: response.data, totalNewUserRequests };
}

export async function fetchNewUserRequestById(id) {
  let queryString = new URLSearchParams({
    id,
  }).toString();

  const response = await apiClient.get(`/newUserRequests/${id}`);

  return response.data;
}
