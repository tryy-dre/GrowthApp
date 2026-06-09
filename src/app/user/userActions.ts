'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

/**
 * Logs standard user activity to the activity_logs table
 */
async function logUserActivity(action: string) {
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
 * Adds a new testimony
 */
export async function addTestimony(content: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const trimmed = content.trim()
  if (trimmed.length < 10) {
    return { error: 'Isi kesaksian minimal 10 karakter.' }
  }

  const { error } = await supabase.from('testimonies').insert({
    user_id: user.id,
    content: trimmed
  })

  if (error) {
    return { error: error.message }
  }

  await logUserActivity('tambah_testimony')
  revalidatePath('/user')
  return { success: true, message: '✨ Kesaksian berhasil dibagikan! Terima kasih sudah berbagi kebaikan Tuhan.' }
}

/**
 * Deletes a testimony owned by the current user
 */
export async function deleteTestimony(testimonyId: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('testimonies')
    .delete()
    .eq('id', testimonyId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/user')
  return { success: true }
}

/**
 * Adds a new question
 */
export async function addQuestion(category: string, question: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const validCats = ['hubungan', 'pertemanan', 'masalah_lain']
  if (!validCats.includes(category)) {
    return { error: 'Kategori pertanyaan tidak valid.' }
  }

  const trimmed = question.trim()
  if (trimmed.length < 10) {
    return { error: 'Isi pertanyaan minimal 10 karakter.' }
  }

  const { error } = await supabase.from('questions').insert({
    user_id: user.id,
    category,
    question: trimmed
  })

  if (error) {
    return { error: error.message }
  }

  await logUserActivity('tambah_pertanyaan')
  revalidatePath('/user')
  return { success: true, message: '💬 Pertanyaanmu berhasil dikirim!' }
}

/**
 * Deletes a question owned by the current user
 */
export async function deleteQuestion(questionId: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', questionId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/user')
  return { success: true }
}

/**
 * Adds a new prayer request
 */
export async function addPrayerRequest(request: string, isPrivate: boolean) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const trimmed = request.trim()
  if (trimmed.length < 10) {
    return { error: 'Isi permohonan doa minimal 10 karakter.' }
  }

  const { error } = await supabase.from('prayer_requests').insert({
    user_id: user.id,
    request: trimmed,
    is_private: isPrivate
  })

  if (error) {
    return { error: error.message }
  }

  await logUserActivity('tambah_permohonan_doa')
  revalidatePath('/user')
  return { success: true, message: '🙏 Permohonan doamu berhasil dikirim. Kami mendoakanmu!' }
}

/**
 * Deletes a prayer request owned by the current user
 */
export async function deletePrayerRequest(prayerId: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('prayer_requests')
    .delete()
    .eq('id', prayerId)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/user')
  return { success: true }
}
