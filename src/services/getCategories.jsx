import axios from "axios";
const API_URL = "http://www.beapilot.local:82";

export async function getData() {
	try {
		const response = await axios.get(
			`http://www.beapilot.local:82/?userID=${userID}`
		);
		setData(response.data);
		setError(null);
	} catch (err) {
		setError(err.message);
		setData(null);
	} finally {
		setLoading(false);
	}
}

export async function getTest(catId) {
	try {
		const response = await fetch(
			`${API_URL}/test?linkTo=id_category_test&equalTo=${catId}&select=*`
		);
		const data = await response.json();
		console.warn(response);
		return data;
	} catch (error) {
		console.error(error);
	}
}
