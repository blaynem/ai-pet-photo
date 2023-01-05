// Used to get the public bucket url of a style
export const getStylesUrl = (url: string) =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/styles/${url}`;
