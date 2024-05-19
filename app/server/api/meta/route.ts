import { NextResponse } from 'next/server'
import { supabase } from '@/lib/initSupabase';

export async function GET(request: Request) {
	const client = supabase

	const { data, error } = await client.from('meta').select('*').eq('id', 1)

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json(data)
}

export async function POST(request: Request) {
	const client = supabase

	const { prompt, time_start, time_end } = await request.json()

	const { data, error } = await client.from('meta').upsert({ id: 1, prompt, time_start, time_end})

	if (error) {
		return NextResponse.json({ error: error.message }, { status: 500 })
	}

	return NextResponse.json(data)
}
