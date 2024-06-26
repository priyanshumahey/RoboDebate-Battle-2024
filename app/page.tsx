"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"

const FormSchema = z.object({
	prompt: z.string().min(1,
		"Prompt must be at least 1 character long"),
	model: z.enum(["openai", "gemini", "random"], {
		required_error: "You must pick an option"
	})
})

export default function Home() {
	const [modelMessage, setModelMessage] = useState<string>("")
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			prompt: "",
			model: "random",
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		toast({
			title: "You submitted the following values:",
			description: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		})

		async function queryModel() {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query-model`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			const json = await response.json()
			setModelMessage(json['text'])
		}
		queryModel()
	}

	return (
		<div className="flex flex-col justify-center min-h-[100vh]">
			<div className="flex justify-center">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 max-w-[500px] space-y-6">
						<FormField
							control={form.control}
							name="prompt"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-3xl">Prompt</FormLabel>
									<FormControl>
										<Input placeholder="What prompt would you like to use?" {...field} />
									</FormControl>
									<FormDescription>
										What prompt would you like to use?
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="model"
							render={({ field }) => (
								<FormItem className="space-y-3">
									<FormLabel>Which AI would you like to use?</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex flex-col space-y-1"
										>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="openai" />
												</FormControl>
												<FormLabel className="font-normal">
													OpenAI
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="gemini" />
												</FormControl>
												<FormLabel className="font-normal">
													Gemini
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="random" />
												</FormControl>
												<FormLabel className="font-normal">Random</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit">Submit</Button>
					</form>
				</Form>
			</div>
			<div className="flex justify-center">
				{modelMessage && (
					<div className="mt-6 sm:w-1/3 w-4/5 max-w-[500px] space-y-6 bg-slate-100 p-4">
						<p className="text-2xl font-semibold">Model Response</p>
						<p>{modelMessage}</p>
						<Button onClick={() => setModelMessage("")}>Clear</Button>
					</div>
				)}
			</div>
		</div>
	);
}
