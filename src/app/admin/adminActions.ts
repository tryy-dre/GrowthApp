'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Logs admin activity to the activity_logs table
 */
export async function logAdminActivity(action: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const forwardedFor = headers().get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1'

  await supabase.from('activity_logs').insert({
    user_id: user.id,
    action,
    ip_address: ip
  })
}

/**
 * Changes a user's role
 */
export async function changeUserRole(targetUserId: string, newRole: string) {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Unauthorized' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Unauthorized. Only admins can perform this action.' }
  }

  if (targetUserId === adminUser.id) {
    return { error: 'You cannot change your own role.' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', targetUserId)

  if (error) {
    return { error: error.message }
  }

  await logAdminActivity(`ubah_role_user_id_${targetUserId}_ke_${newRole}`)
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Deletes a user profile and their auth credentials via RPC
 */
export async function deleteUser(targetUserId: string) {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Akses ditolak.' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' }
  }

  if (targetUserId === adminUser.id) {
    return { error: 'Anda tidak dapat menghapus akun Anda sendiri.' }
  }

  // Call the secure RPC function to delete user from auth.users and all related tables
  const { error: rpcError } = await supabase.rpc('delete_user_by_id', {
    target_user_id: targetUserId
  })

  if (rpcError) {
    console.error('RPC delete_user_by_id failed, falling back to profile delete:', rpcError.message)
    // Fallback: Delete profile record directly (fails to delete from auth.users, but cleans up public record)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', targetUserId)

    if (profileError) {
      return { error: profileError.message }
    }
  }

  await logAdminActivity(`hapus_user_id_${targetUserId}`)
  revalidatePath('/admin')
  return { success: true }
}


/**
 * Deletes a testimony
 */
export async function deleteTestimony(testimonyId: number) {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Unauthorized' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('testimonies')
    .delete()
    .eq('id', testimonyId)

  if (error) {
    return { error: error.message }
  }

  await logAdminActivity(`hapus_testimony_id_${testimonyId}`)
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Deletes a question
 */
export async function deleteQuestion(questionId: number) {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Unauthorized' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId)

  if (error) {
    return { error: error.message }
  }

  await logAdminActivity(`hapus_question_id_${questionId}`)
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Deletes a prayer request
 */
export async function deletePrayerRequest(prayerId: number) {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Unauthorized' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('prayer_requests')
    .delete()
    .eq('id', prayerId)

  if (error) {
    return { error: error.message }
  }

  await logAdminActivity(`hapus_prayer_id_${prayerId}`)
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Deletes all testimonies
 */
export async function deleteAllTestimonies() {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Unauthorized' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('testimonies')
    .delete()
    .gt('id', 0)

  if (error) {
    return { error: error.message }
  }

  await logAdminActivity('hapus_semua_testimoni')
  revalidatePath('/admin')
  revalidatePath('/user')
  return { success: true }
}

/**
 * Deletes all questions
 */
export async function deleteAllQuestions() {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Unauthorized' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('questions')
    .delete()
    .gt('id', 0)

  if (error) {
    return { error: error.message }
  }

  await logAdminActivity('hapus_semua_pertanyaan')
  revalidatePath('/admin')
  revalidatePath('/user')
  return { success: true }
}

/**
 * Deletes all prayer requests
 */
export async function deleteAllPrayerRequests() {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Unauthorized' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('prayer_requests')
    .delete()
    .gt('id', 0)

  if (error) {
    return { error: error.message }
  }

  await logAdminActivity('hapus_semua_prayer_request')
  revalidatePath('/admin')
  revalidatePath('/user')
  return { success: true }
}

export async function createNewUserAction(formData: FormData) {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Akses ditolak.' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nickname = formData.get('nickname') as string
  const role = formData.get('role') as string // 'admin' or 'user'

  if (!email || !password || !nickname || !role) {
    return { error: 'Semua kolom wajib diisi.' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal harus 6 karakter.' }
  }

  // Check if nickname (username) is already taken
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .maybeSingle()

  if (existingUser) {
    return { error: 'Username (nickname) sudah digunakan.' }
  }

  // Create isolated supabase client without persisting sessions (so admin stays logged in!)
  const tempSupabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  )

  // Register new user inside Supabase Auth
  const { data: signUpData, error: signUpError } = await tempSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
        role,
      },
    },
  })

  if (signUpError) {
    if (signUpError.message.toLowerCase().includes('already registered') || signUpError.message.toLowerCase().includes('already exists')) {
      return { error: 'Email sudah terdaftar.' }
    }
    return { error: signUpError.message }
  }

  const newUser = signUpData.user
  if (!newUser) {
    return { error: 'Gagal membuat pengguna baru.' }
  }



  await logAdminActivity(`buat_user_baru_email_${email}_role_${role}`)
  revalidatePath('/admin')
  return { success: true, message: 'User baru berhasil dibuat!' }
}

/**
 * Deletes a single activity log row
 */
export async function deleteActivityLog(logId: number) {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Akses ditolak.' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' }
  }

  // Call secure RPC
  const { error: rpcError } = await supabase.rpc('delete_activity_log_by_id', {
    target_log_id: logId
  })

  if (rpcError) {
    return { error: `Gagal menghapus log: ${rpcError.message}` }
  }

  revalidatePath('/admin')
  return { success: true }
}

/**
 * Deletes all activity logs
 */
export async function deleteAllActivityLogs() {
  const supabase = createClient()

  // Authorization check
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser) return { error: 'Akses ditolak.' }

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', adminUser.id)
    .single()

  if (adminProfile?.role !== 'admin') {
    return { error: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' }
  }

  // Call secure RPC
  const { error: rpcError } = await supabase.rpc('delete_all_activity_logs')

  if (rpcError) {
    return { error: `Gagal menghapus semua log: ${rpcError.message}` }
  }

  await logAdminActivity('hapus_semua_activity_log')
  revalidatePath('/admin')
  return { success: true }
}
