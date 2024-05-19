"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Transition } from "@tailwindui/react"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useCookies } from 'react-cookie'
import { AdminPage } from "./adminpage"

const FormSchema = z.object({
	pin: z.string().min(6, {
		message: "Your one-time password must be 6 characters.",
	}),
})

export default function InputOTPForm() {
	const [admin, setAdmin] = useState(false)
	const [cookies, setCookie] = useCookies(['admin'])

	useEffect(() => {
		if (cookies.admin) {
			setAdmin(true)
		} else {
			setAdmin(false)
		}
	}, [cookies.admin])

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			pin: "",
		},
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {
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

		if (data.pin === "211219") {
			toast({
				title: "Success",
				description: "You've successfully entered the admin area."
			})
			setCookie('admin', true, { path: '/' })
			setAdmin(true)
		} else {
			toast({
				title: "Error",
				description: "You've entered the wrong password.",
				variant: "destructive"
			})
		}
	}

	return (
		(!admin ? (
			<Transition
				show={!admin}
				enter="transition-opacity duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="pin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										<h1 className="text-2xl font-bold">Admin Password</h1>
									</FormLabel>
									<FormControl>
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex flex-row justify-center">
							<Button type="submit">Enter</Button>
						</div>
					</form>
				</Form>
			</Transition>)
			: <Transition
				show={admin}
				enter="transition-opacity duration-1000"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-400"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<AdminPage />
			</Transition>
		)
	)
}