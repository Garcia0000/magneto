'use client'
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Browser-side client with anon key — use in Client Components
export const supabaseClient = createClient(url, key)
