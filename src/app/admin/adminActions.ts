'use server'

import { createClient } from '@/utils/supabase/server'
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
 * Deletes a user profile
 */
export async function deleteUser(targetUserId: string) {
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

  if (targetUserId === adminUser.id) {
    return { error: 'You cannot delete your own account.' }
  }

  // Delete profile record (cascades dependencies in profile table)
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', targetUserId)

  if (error) {
    return { error: error.message }
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
