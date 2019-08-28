import React from 'react';

export default function UserPendingLoader({caption}) {
	return (
		<main class="userpendingloader">
				<span class="userpendingloader__loader"> </span> 
				<span class="userpendingloader__caption">{caption}</span>
				<span class="userpendingloader__border"></span>
		</main>
	);
}
