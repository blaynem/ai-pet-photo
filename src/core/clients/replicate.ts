import axios, { AxiosResponse } from "axios";

/**
 * Behind the scenes this runs replicate/dreambooth, so any input to that model can be passed
 *
 * Inputs here: https://replicate.com/replicate/dreambooth/api#inputs
 */
export type TrainingRequest = {
  /**
   * All of these inputs are the replicate/dreambooth inputs specifically.
   */
  input: {
    /**
     * The prompt with identifier specifying the instance
     *
     * ex: "cjw person" [cjw is the identifier, person is the class noun]
     *
     * The prompt that you use to describe your training images, in the format a [identifier] [class noun],
     * where identifier is some rare token. In the example above, we use cjw, but you can use
     * any string that you like. For best results, use an identifier containing three Unicode characters,
     * without spaces.
     */
    instance_prompt: string;

    /**
     * A negative prompt is an additional capability we can add to our model to tell the
     * stable diffusion model what we don't want to see in the generated image
     */
    negative_prompt?: string;

    /**
     * The prompt to specify images in the same class as provided instance images.
     *
     * a prompt of the broader category of images that you're training on, in the format a [class noun].
     * This is used to generate other images like your training data to avoid overfitting
     */
    class_prompt: string;

    /**
     * URL to a ZIP file containing the training data of instance images
     */
    instance_data: string;

    /**
     * URL to A ZIP file containing the training data of class images. Images will be generated if you do not provide.
     *
     * Note: Note: We don't use this, images are generated if you do not provide.
     */
    class_data?: string;

    /**
     * "Minimal class images for prior preservation loss. If not enough images are provided in class_data, additional images will be sampled with class_prompt.
     *
     * According to the paper, it’s recommended to generate num_epochs * num_samples images for prior preservation.
     * 200-300 works well for most cases.
     */
    num_class_images: number;

    /**
     * "The prompt used to generate sample outputs to save.
     *
     * Note: We don't use this, as we generate prompts afterwards.
     */
    save_sample_prompt?: string;

    /**
     * "The negative prompt used to generate sample outputs to save.
     *
     * Note: We don't use this, as we generate prompts afterwards.
     */
    save_sample_negative_prompt?: string;

    /**
     * "The number of samples to save.
     */
    n_save_sample?: number;

    /**
     * "CFG for save sample.
     */
    save_guidance_scale?: number;

    /**
     * "The number of inference steps for save sample.
     */
    save_infer_steps?: number;

    /**
     * "Flag to pad tokens to length 77.
     */
    pad_tokens?: boolean;

    /**
     * "Flag to add prior preservation loss.
     */
    with_prior_preservation?: boolean;

    /**
     * "Weight of prior preservation loss.
     */
    prior_loss_weight?: number;

    /**
     * "A seed for reproducible training
     */
    seed?: number;

    /**
     * "The resolution for input images. All the images in the train/validation dataset will be resized to this resolution.
     */
    resolution?: number;

    /**
     * "Whether to center crop images before resizing to resolution
     */
    center_crop?: boolean;

    /**
     * "Whether to train the text encoder
     */
    train_text_encoder?: boolean;

    /**
     * "Batch size (per device) for the training dataloader.
     */
    train_batch_size?: number;

    /**
     * "Batch size (per device) for sampling images.
     */
    sample_batch_size?: number;

    /**
     * "undefined
     */
    num_train_epochs?: number;

    /**
     * "Total number of training steps to perform. If provided, overrides num_train_epochs.
     *
     * This is the number to drop if a prediction takes too long.
     */
    max_train_steps: number;

    /**
     * "Number of updates steps to accumulate before performing a backward/update pass.
     */
    gradient_accumulation_steps?: number;

    /**
     * "Whether or not to use gradient checkpointing to save memory at the expense of slower backward pass.
     */
    gradient_checkpointing?: boolean;

    /**
     * "Initial learning rate (after the potential warmup period) to use.
     * recommend starting with a low learning rate (2e-6).
     * Notes: https://huggingface.co/blog/dreambooth#learning-rate-impact
     */
    learning_rate: number;

    /**
     * "Scale the learning rate by the number of GPUs, gradient accumulation steps, and batch size.
     */
    scale_lr?: boolean;

    /**
     * r_scheduler method uses for adjest the learning rate for optimizer. while training model we want learning rate change according our requirements,
     * for example at the initial state of training our we need little bit high learning rate than later states. if our learning too little
     * then model will take lot of time to train, and if learning rate high at later state of training then model will not achive global minima.
     * so thats why adjust learning rate is essential for getting higher accuracy.
     *
     * Default: polynomial - Polynomial decay of the learning rate.
     */
    lr_scheduler: string;

    /**
     * "Number of steps for the warmup in the lr scheduler.
     * Learning Rate Warm-up is a way to reduce the primacy effect of the early training examples. Without it, you may need to run a few extra epochs
     * to get the convergence desired, as the model un-trains those early superstitions.
     */
    lr_warmup_steps: number;

    /**
     * "Whether or not to use 8-bit Adam from bitsandbytes.
     */
    use_8bit_adam?: boolean;

    /**
     * "The beta1 parameter for the Adam optimizer.
     */
    adam_beta1?: number;

    /**
     * "The beta2 parameter for the Adam optimizer.
     */
    adam_beta2?: number;

    /**
     * "Weight decay to use
     */
    adam_weight_decay?: number;

    /**
     * "Epsilon value for the Adam optimizer
     */
    adam_epsilon?: number;

    /**
     * "Max gradient norm.
     */
    max_grad_norm?: number;

    /**
     * TBD: Unsure if this actually works on the replicate api, or if its just a dreambooth thing.
     */
    save_interval?: number;
  };
  /**
   * a name to give your model on Replicate, in the form username/modelname. For example, bfirsh/bfirshbooth.
   * Replicate automatically creates the model for you if it doesn't exist yet.
   */
  model: string;
  /**
   * a webhook to call when the job finishes. (Optional.)
   */
  webhook_completed?: string;
};

type PredictionRequest = {
  // * The prompt that you use to describe the prediction request, in the format a [identifier] [class noun].
  // * Ex: Teddy dog, portrait photograph, 85mm medium format photo
  input: any;
  /**
   * Version that comes back from replicate trainings.
   */
  version: string;
};

/**
 * Get/Post /v1/trainings
 * Note: The input depends on what model you are running.
 *       To see the available inputs, click the "Run with API" tab on the model you are
 *       running. For example, stability-ai/stable-diffusion takes prompt as an input.
 */
export type TrainingResponse = {
  id: string;
  input: any;
  model: string;
  status: "starting" | "pushing" | "queued" | "succeeded";
  webhook_completed: string;
  version: string;
  logs: any;
  error?: any;
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
};

/**
 * Get /v1/predictions
 *
 * Note: The input depends on what model you are running.
 *       To see the available inputs, click the "Run with API" tab on the model you are
 *       running. For example, stability-ai/stable-diffusion takes prompt as an input.
 *
 * https://replicate.com/docs/reference/http#create-prediction
 */
export type PredictionResponse = {
  id: string;
  version: string;
  urls: {
    get: string;
    cancel: string;
  };
  created_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  status: "starting" | "pushing" | "succeeded";
  input: any; // the input is free form it comes
  output: any;
  error: any;
  logs: any;
  metrics: {};
};

interface ReplicateClient {
  get: <t>(url: string) => Promise<AxiosResponse<t>>;
  post: <t>(
    url: string,
    data: TrainingRequest | PredictionRequest,
    headers?: any
  ) => Promise<AxiosResponse<t>>;
}

const replicateClient: ReplicateClient = axios.create({
  baseURL: "https://dreambooth-api-experimental.replicate.com",
  headers: {
    Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    "Accept-Encoding": "*",
  },
});

export default replicateClient;
