import React, { useEffect, useState } from 'react'
import * as API from './services/getMethod';


function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.getAllUsers().then(setUsers);
  }, []);


  return (
		<React.Fragment>
			<h1>Usuarios</h1>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Subscription</th>
						<th>Stripe ID</th>
						<th>Email</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.user_id}>
							<td>{user.user_id}</td>
							<td>{user.user_stripeid}</td>
							<td>{user.user_subscription}</td>
							<td>{user.user_email}</td>
						</tr>
					))}
				</tbody>
			</table>
		</React.Fragment>
  );
}

export default App
