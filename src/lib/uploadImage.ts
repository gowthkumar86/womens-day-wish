import { supabase } from "./supabase"

export const uploadImage = async (file: File) => {

  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from("wish-images")
    .upload(fileName, file)

  if (error) {
    console.error(error)
    throw error
  }

  const { data: publicUrl } = supabase.storage
    .from("wish-images")
    .getPublicUrl(fileName)

  return publicUrl.publicUrl
}