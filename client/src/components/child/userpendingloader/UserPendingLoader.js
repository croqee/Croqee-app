import React from 'react';

export default function UserPendingLoader({ caption }) {
	return (
		<main className="userpendingloader">
			<span className="userpendingloader__loader"> </span>
			<span className="userpendingloader__caption">{caption}</span>
		</main>
	);
}
