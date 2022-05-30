import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import * as API from "../services/getCategories"

export default function Test() {
	const {catId} = useParams();
	const [test, setTest] = useState({ id_category_test: []  });

	useEffect(() => {
		API.getTest(catId).then(setTest).catch(console.log);
	}, [])


	return (
		<React.Fragment>
			<div>Página de Test</div>
			<div>Hola, la categoría es {catId}</div>
		</React.Fragment>
	);
}