import axios from "axios";

const FATSECRET_CLIENT_ID = process.env.EXPO_PUBLIC_FATSECRET_CLIENT_ID;
const FATSECRET_CLIENT_SECRET = process.env.EXPO_PUBLIC_FATSECRET_CLIENT_SECRET;

// Function to get access token
export const getAccessToken = async (): Promise<string> => {
  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("scope", "basic");

  try {
    const response = await axios.post(
      "https://oauth.fatsecret.com/connect/token",
      params.toString(), // Pass as a string to format as URL-encoded
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          user: FATSECRET_CLIENT_ID,
          password: 
          FATSECRET_CLIENT_SECRET,
        },
      }
    );

    console.log(response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Failed to obtain access token:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const searchFood = async (searchExpression: string) => {
  try {
    const token = await getAccessToken();
    if (!token) return null;
    const response = await axios.get(
      "https://platform.fatsecret.com/rest/foods/search/v3",
      {
        params: {
          method: "foods.search",
          format: "json",
          search_expression: searchExpression,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching food data:", error);
    throw error;
  }
};
