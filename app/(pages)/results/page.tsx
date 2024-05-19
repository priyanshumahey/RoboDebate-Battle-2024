"use client"

import { useEffect, useState } from 'react';


export default function Page() {
	const [results, setResults] = useState([]);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/judges`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(response => response.json())
			.then(data => setResults(data));
	}, []);

	return (
		<div className="flex flex-row justify-center h-[100vh]">
			<div className="flex flex-col justify-center">
				<h1 className="text-3xl font-bold">Results</h1>
				<ul>
					{results.map((result: { id: number, username: string, vote: string }) => (
						<li className="text-lg" key={result.id}>{result.username} voted {result.vote}</li>
					))}
				</ul>
				<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
				<h2 className="text-3xl font-bold">Summary:</h2>
				<h2 className="text-lg">Total Votes: {results.length}</h2>
				<ul>
					<li className="text-lg"><span className="font-semibold">Total Amount for <span className={'text-red-300'}>A</span>:</span> {results.reduce((total, result: { vote: string }) => result.vote === 'A' ? total + 1 : total, 0)}</li>
					<li className="text-lg"><span className="font-semibold">Total Amount for <span className={'text-blue-300'}>B</span>:</span> {results.reduce((total, result: { vote: string }) => result.vote === 'B' ? total + 1 : total, 0)}</li>
				</ul>
				<hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
				<h1 className="text-3xl font-bold">Winner</h1>
				<h2 className={`text-2xl font-semibold ${results.reduce((total, result: { vote: string }) => result.vote === 'A' ? total + 1 : total, 0) > results.reduce((total, result: { vote: string }) => result.vote === 'B' ? total + 1 : total, 0) ? 'text-red-300' : 'text-blue-300'}`}>The winner is: {results.reduce((total, result: { vote: string }) => result.vote === 'A' ? total + 1 : total, 0) > results.reduce((total, result: { vote: string }) => result.vote === 'B' ? total + 1 : total, 0) ? 'A' : 'B'}</h2>
			</div>
		</div>
	);

}