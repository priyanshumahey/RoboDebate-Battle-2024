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

const FormSchema = z.object({
	prompt: z.string().min(1,
		"Prompt must be at least 1 character long"),
	model: z.enum(["openai", "gemini", "random"], {
		required_error: "You must pick an option"
	})
})

export default function Home() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			prompt: "",
			model: "random",
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
		// toast({
		// 	title: "You submitted the following values:",
		// 	description: (
		// 		<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
		// 			<code className="text-white">{JSON.stringify(data, null, 2)}</code>
		// 		</pre>
		// 	),
		// })

		async function queryModel() {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query-model`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
			const json = await response.json()
			toast({
				title: "API Response",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(json, null, 2)}</code>
					</pre>
				),
			})
		}
		queryModel()
	}

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
					<FormField
						control={form.control}
						name="prompt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Prompt</FormLabel>
								<FormControl>
									<Input placeholder="What orompt would you like to use?" {...field} />
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
								<FormLabel>Notify me about...</FormLabel>
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
	);
}
