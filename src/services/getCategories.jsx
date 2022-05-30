import { useParams } from "react-router-dom";
const API_URL = "http://www.beapilot.local:82";

export async function getAllCategories() {
	try {
		const response = await fetch(`${API_URL}/categories`);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
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
