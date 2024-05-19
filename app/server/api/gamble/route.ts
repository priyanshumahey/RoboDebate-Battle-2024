import { NextResponse } from 'next/server'
import { supabase } from '@/lib/initSupabase';

export async function GET(request: Request) {
	const client = supabase

	const { data, error } = await client.from('gambles').select('*')

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json(data)
}

export async function POST(request: Request) {
	const client = supabase

	const { username, spent, time } = await request.json()

	const { data, error } = await client.from('gambles').insert({ username, spent, time})

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json(data)
}