const API_URL = "http://www.beapilot.local:82/";

export async function getAllUsers() {
  try {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}