import React from 'react';
import ReactDOM from 'react-dom/client';
function Child() {
	return <span>lib-react</span>;
}

export default function App() {
	return (
		<div>
			<Child />
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
