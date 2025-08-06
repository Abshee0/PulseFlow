import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helpers
export const createBoard = async (board) => {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('boards')
    .insert([{
      ...board,
      user_id: user.id,
      created_by: user.id
    }])
    .select()
    .single()

  return { data, error }
}

export const getUserBoards = async () => {
  const user = await getCurrentUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('boards')
    .select(`
      *,
      board_shares!inner(user_id),
      profiles!boards_created_by_fkey(full_name, email)
    `)
    .or(`user_id.eq.${user.id},board_shares.user_id.eq.${user.id}`)

  return { data, error }
}

export const shareBoard = async (boardId, userEmail) => {
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', userEmail)
    .single()

  if (userError || !user) {
    throw new Error('User not found')
  }

  const { data, error } = await supabase
    .from('board_shares')
    .insert([{
      board_id: boardId,
      user_id: user.id
    }])

  return { data, error }
}