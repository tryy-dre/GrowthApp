'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = createClient()
  let errorMsg = ''
  let success = false

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      errorMsg = error.message
    } else {
      success = true
    }
  } catch {
    errorMsg = 'An unexpected error occurred. Please try again.'
  }

  if (errorMsg) {
    return { error: errorMsg }
  }

  if (success) {
    redirect('/')
  }
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string

  if (!email || !password || !nickname) {
    return { error: 'Semua kolom wajib diisi.' }
  }

  const supabase = createClient()
  let errorMsg = ''
  let success = false

  try {
    // 1. Check if nickname (username) is already taken
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname)
      .maybeSingle()

    if (existingUser) {
      return { error: 'Username (nickname) sudah digunakan.' }
    }

    // 2. Perform Supabase registration
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname,
          role: 'user', // Default role is user
        },
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
        errorMsg = 'Email sudah terdaftar.'
      } else {
        errorMsg = error.message
      }
    } else if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
      // If email confirmation is enabled and the email already exists, 
      // Supabase silently succeeds but leaves the identities list empty.
      errorMsg = 'Email sudah terdaftar.'
    } else {
      success = true
    }
  } catch {
    errorMsg = 'Terjadi kesalahan sistem. Silakan coba lagi.'
  }

  if (errorMsg) {
    return { error: errorMsg }
  }

  if (success) {
    return { 
      success: true, 
      message: 'Registrasi berhasil! Anda sekarang dapat masuk ke akun Anda.' 
    }
  }
}

export async function signout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
