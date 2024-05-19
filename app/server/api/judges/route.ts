import { NextResponse } from 'next/server'
import { supabase } from '@/lib/initSupabase';

export async function GET(request: Request) {
	const client = supabase

	const { data, error } = await client.from('votes').select('*')

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json(data)
}

export async function POST(request: Request) {
	const client = supabase

	const { username, vote } = await request.json()

	const { data, error } = await client.from('votes').insert({ username, vote})

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json(data)
}

export async function DELETE(request: Request) {
	const client = supabase

	const { data, error } = await client.from('votes').delete().neq('id', 0)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json(data)
}
