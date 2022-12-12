import axios from "axios";

type AxiosPutRequest = {
  input: {
    /**
     * The prompt that you use to describe your training images, in the format a [identifier] [class noun],
     * where identifier is some rare token. In the example above, we use cjw, but you can use
     * any string that you like. For best results, use an identifier containing three Unicode characters,
     * without spaces.
     */
    instance_prompt: string;
    /**
     * a prompt of the broader category of images that you're training on, in the format a [class noun].
     * This is used to generate other images like your training data to avoid overfitting
     */
    class_prompt: string;
    /**
     * the URL to your training data.
     */
    instance_data: string;
    /**
     * the maximum number of steps of the training job. This is the number to drop if a prediction takes too long.
     */
    max_train_steps: number;
    /**
     * According to the paper, it’s recommended to generate num_epochs * num_samples images for prior preservation.
     * 200-300 works well for most cases.
     */
    num_class_images: number;
    /**
     * The learning rate for the training job. We recommend starting with a low learning rate (2e-6).
     * Notes: https://huggingface.co/blog/dreambooth#learning-rate-impact
     */
    learning_rate: number;
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

interface ReplicateClient {
  get: (url: string) => Promise<any>;
  post: (url: string, data: AxiosPutRequest, headers: any) => Promise<any>;
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
