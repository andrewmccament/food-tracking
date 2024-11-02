import axios from "axios";

const FATSECRET_CLIENT_ID = process.env.EXPO_PUBLIC_FATSECRET_CLIENT_ID;
const FATSECRET_CLIENT_SECRET = process.env.EXPO_PUBLIC_FATSECRET_CLIENT_SECRET;

// Function to get access token
const getAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      "https://oauth.fatsecret.com/connect/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        scope: "basic",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: FATSECRET_CLIENT_ID,
          password: FATSECRET_CLIENT_SECRET,
        },
      }
    );

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
      "https://platform.fatsecret.com/rest/foods/search/v1",
      {
        params: {
          format: "json",
          search_expression: searchExpression,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(JSON.stringify(response.data));
    console.log(await getFoodById(response.data.foods.food[0].food_id));
    return response.data;
  } catch (error) {
    console.error("Error fetching food data:", error);
    throw error;
  }
};

export const getFoodById = async (foodId: string) => {
  try {
    const token = await getAccessToken();
    if (!token) return null;
    const response = await axios.get(
      "https://platform.fatsecret.com/rest/food/v4",
      {
        params: {
          format: "json",
          food_id: foodId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error fetching food data:", error);
    throw error;
  }
};
