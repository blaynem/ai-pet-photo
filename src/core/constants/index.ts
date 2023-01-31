export * from "./pricing-packages";

/** ===== Amount of photos to generate ===== */
export const GENERATE_PHOTO_AMOUNT_PER_CREDIT = 4;

/** ===== Studio cost in credits, not dollars ===== */
export const STUDIO_COST_IN_CREDITS = 40;
export const IMAGE_GENERATION_COST_IN_CREDITS = 1;
export const UPSCALE_IMAGE_COST_IN_CREDITS = 2;

/** ==== Copywriting / front end name of components ==== **/
export const MODEL_NAME = "Model";

export const TWITTER_LINK = "https://twitter.com/petpics_ai";
export const EMAIL_ADDRESS_SUPPORT = "support@petpics.ai";

export const PUBLIC_BUCKET_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/model-images`;
