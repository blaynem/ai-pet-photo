import { Shot } from "@prisma/client";
import supabase from "../clients/supabase";

/**
 * Get's the full shot url from the correct supabase storage bucket.
 */
export const getFullShotUrl = (
  shot: Pick<Shot, "id" | "projectId">,
  upscaled?: boolean
): string => {
  const url = getShotsUrlPath(shot, upscaled);
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shots/${url}`;
};

/**
 * Gets the url path for a shot in the shots bucket
 *
 * standard url = {projectId}/standard/{id}.png
 * upscaled url = {projectId}/upscaled/{id}.png
 */
export const getShotsUrlPath = (
  shot: Pick<Shot, "id" | "projectId">,
  upscaled?: boolean
): string => {
  // if upscaled is true, return upscaled url
  const imageResolution = upscaled ? "upscaled" : "standard";
  const bucketUrl = `${shot.projectId}/${imageResolution}/${shot.id}.png`;
  return bucketUrl;
};

/**
 * Fetch image from a URL and store it inside supabase storage "shots"
 *
 * returns the url of the image in the bucket
 */
export const fetchImageAndStoreIt = async (
  url: string,
  shot: Pick<Shot, "id" | "projectId">
): Promise<string | null> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const imagePath = getShotsUrlPath(shot);

  // This should always just return the `{id}.png` part of the url
  const bucketFileName = imagePath.split("/").slice(-1)[0];

  const { error } = await supabase.storage
    .from("shots")
    .upload(imagePath, buffer);
  if (error) {
    if ((error as any).error === "Duplicate") {
      // If it's a duplicate, we can just return the url
      return bucketFileName;
    }
    return null;
  }

  return bucketFileName;
};
