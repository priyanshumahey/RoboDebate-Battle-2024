"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Input } from "@/components/ui/input"
import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Transition } from '@tailwindui/react'
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const GameSchema = z.object({
	gamepin: z.string().length(6, "Game Pin must be 6 characters long"),
})

const UserSchema = z.object({
	username: z.string().min(1, {
		message: "Username must be at least 1 character long",
	}).max(18, {
		message: "Username must be less than 18 characters long",
	})
})

const StageList = ["gamepinStage", "playerStage"] as const

const PlayerTypes = ["judge", "gambler"] as const

export default function Login() {
	const [stage, setStage] = useState<typeof StageList[number]>("gamepinStage")
	const [username, setUsername] = useState("")
	const [role, setRole] = useState<typeof PlayerTypes[number]>("gambler")

	const form = useForm<z.infer<typeof GameSchema>>({
		resolver: zodResolver(GameSchema),
		defaultValues: {
			gamepin: "",
		},
	})

	const userForm = useForm<z.infer<typeof UserSchema>>({
		resolver: zodResolver(UserSchema),
		defaultValues: {
			username: "",
		},
	})

	function onSubmit(data: z.infer<typeof GameSchema>) {
		if (process.env.NODE_ENV === "development") {
			toast({
				title: "You submitted the following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				)
			})
		}
		if (data.gamepin === "333333") {
			setStage("playerStage")
		} else if (data.gamepin === "123456") {
			setStage("playerStage")
			setRole("judge")
		} else {
			toast({
				title: "Game Not Found!",
				description: "This pin was invalid. Please try again.",
				variant: "destructive"
			})
		}
	}

	function onUserSubmit(data: z.infer<typeof UserSchema>) {
		if (process.env.NODE_ENV === "development") {
			toast({
				title: "You submitted the following values:",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">{JSON.stringify(data, null, 2)}</code>
					</pre>
				)
			})
		}
		setUsername(data.username)
	}

	return (
		<>
			<Transition
				show={stage === "gamepinStage"}
				enter="transition-opacity ease-linear duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-linear duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="flex flex-col justify-center h-[100vh]">
					<div className="flex justify-center">

						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className="w-1/5 flex flex-col text-center">
								<h1 className="text-4xl font-bold w-full">Big AI Battle!</h1>
								<Card className="flex flex-col justify-center rounded-none mt-6 ">
									<CardContent>
										<FormField
											control={form.control}
											name="gamepin"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															placeholder="Game Pin"
															maxLength={6}
															className="mt-6 text-xl text-center w-full rounded-none"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
									<CardFooter className='justify-center'>
										<Button type="submit" className="w-full rounded-none">Enter</Button>
									</CardFooter>
								</Card>
							</form>
						</Form>

					</div>
				</div>
			</Transition >

			<Transition
				show={stage === "playerStage"}
				enter="transition-opacity ease-linear duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-linear duration-300"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div className="flex flex-col justify-center h-[100vh]">
					<div className="flex justify-center">

						<Form {...form}>
							<form onSubmit={userForm.handleSubmit(onUserSubmit)} className="w-4/5 sm:w-2/5 flex flex-col text-center">
								<h1 className="text-4xl font-bold w-full">Welcome!</h1>
								<Card className="flex flex-col justify-center rounded-none mt-6 ">
									<CardContent>
										<FormField
											control={userForm.control}
											name="username"
											render={({ field }) => (
												<FormItem>
													<div className="sm:flex mt-4 sm:space-x-10 w-full">
														<Avatar className="sm:w-1/5 h-auto mb-10 mt-4 w-1/3 m-auto justify-center">
															<AvatarImage src="https://github.com/shadcn.png" />
															<AvatarFallback>CN</AvatarFallback>
														</Avatar>
														<div className="w-full flex-col justify-left text-left space-y-2">
															<FormDescription className="text-xl">Enter your username:</FormDescription>
															<FormControl>
																<Input
																	placeholder="Username"
																	maxLength={18}
																	className="text-xl text-center w-full rounded-none"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
															<FormDescription className="text-xl">Your role</FormDescription>
															<Button className={`w-1/2 hover:cursor-default bg-white text-violet-500 border-2 border-violet-500 rounded-none hover:bg-white hover:text-violet-500 hover:border-2 hover:border-violet-500 ${role === "judge" ? "" : "hidden"}`}>Judge</Button>
															<Button className={`w-1/2 hover:cursor-default bg-white text-violet-500 border-2 border-violet-500 rounded-none hover:bg-white hover:text-violet-500 hover:border-2 hover:border-violet-500 ${role === "gambler" ? "" : "hidden"}`}>Gambler</Button>
														</div>
													</div>
												</FormItem>
											)}
										/>
									</CardContent>
									<CardFooter className='justify-center'>
										<Button type="submit" className="w-full rounded-none">Enter</Button>
									</CardFooter>
								</Card>
							</form>
						</Form>
					</div>
				</div>
			</Transition >
		</>
	)
}
