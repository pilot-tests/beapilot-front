import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { App } from './App';

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Auth0Provider
      domain="beapilot.eu.auth0.com"
      clientId="q9hutTh9jH6PJm6ZlukDtnjNZOCbBtDa"
      authorizationParams={{
				redirect_uri: "http://localhost:3000"
			}}
		>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Auth0Provider>
	</React.StrictMode>
);
