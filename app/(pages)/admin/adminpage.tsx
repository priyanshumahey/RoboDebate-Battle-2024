"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

const adminForm = z.object({
	prompt: z.string().min(1, {
		message: "Please enter a prompt.",
	}),
	time_start: z.string().min(1, {
		message: "Please enter a start time.",
	}),
	time_end: z.string().min(1, {
		message: "Please enter an end time.",
	}),
})

export function AdminPage() {
	const [data, setData] = useState(null);

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const result = await response.json();
				console.log(result);
				setData(result);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		getData();
	}, []);

	const values = {
		prompt: data ? data[0]?.prompt : "",
		time_start: data ? data[0]?.time_start : "",
		time_end: data ? data[0]?.time_end : "",
	}

	const form = useForm<z.infer<typeof adminForm>>({
		resolver: zodResolver(adminForm),
		defaultValues: {
			prompt: "",
			time_start: "",
			time_end: "",
		},
		mode: "onChange",
		values
	})

	function onSubmit(data: z.infer<typeof adminForm>) {
		if (process.env.NODE_ENV === "development") {
			toast({
				title: "You submitted the following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				),
			})
		}

		async function postData() {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meta`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				});
				const result = await response.json();
				console.log(result);
			} catch (error) {
				console.error('Error posting data:', error);
			}
		}

		postData();
	}

	function clearVoters() {
		async function postData() {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/judges`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}				
			);
			if (response.status === 200) {
				toast({
					title: "Voters Cleared",
					description: "All voters have been cleared.",
				})
			}
			} catch (error) {
				console.error('Error posting data:', error);
			}
		}
		postData();
	}

	return (
		<div className="justify-center w-full">
			<h1 className="text-2xl font-bold">Welcome to the admin area.</h1>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="prompt"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg font-semibold">Prompt</FormLabel>
									<FormControl>
										<Input placeholder="What prompt would you like to use?" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="time_start"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg font-semibold">Start Time</FormLabel>
									<FormControl>
										<Input placeholder="What time would you like to start?" {...field} />
									</FormControl>
									<Button type="button" onClick={() => {
										const d = new Date();
										const utcDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()	- d.getTimezoneOffset() * 60000);
										field.onChange(utcDate.toISOString()['slice'](0, 19) + '+00:00')
									}}>Set to Now</Button>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="time_end"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-lg font-semibold">End Time</FormLabel>
									<FormControl>
										<Input placeholder="What time would you like to end?" {...field} />
									</FormControl>
									<Button type="button" onClick={() => {
										const d = new Date();
										const utcDate = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()	- d.getTimezoneOffset() * 60000);
										field.onChange(utcDate.toISOString()['slice'](0, 19) + '+00:00')
									}}>Set to Now</Button>
									<FormMessage />
								</FormItem>
							)}
						/>
							<Button type="button" className="w-full rounded-none mt-4" onClick={clearVoters}>Clear Voters</Button>
							<Button type="submit" className="w-full rounded-none mt-4">Enter</Button>
					</form>
				</Form>
		</div>
	)
}
