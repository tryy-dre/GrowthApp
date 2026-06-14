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

export async function changePasswordAction(formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Semua kolom wajib diisi.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Password baru dan konfirmasi password tidak cocok.' }
  }

  if (newPassword.length < 6) {
    return { error: 'Password baru minimal harus 6 karakter.' }
  }

  const supabase = createClient()

  // 1. Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Sesi tidak valid atau telah berakhir. Silakan login kembali.' }
  }

  // 2. Re-authenticate to verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  })

  if (signInError) {
    return { error: 'Password saat ini salah.' }
  }

  // 3. Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (updateError) {
    return { error: `Gagal memperbarui password: ${updateError.message}` }
  }

  return { success: true, message: 'Password berhasil diperbarui!' }
}
