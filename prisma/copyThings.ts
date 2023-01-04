import { PrismaClient, Prisma } from "@prisma/client";

// Note needing the ?pgbouncer=true here, otherwise the put doesn't work after the first findmany
const testDB = "";

const things: Prisma.StylesCreateInput[] = [
  {
    name: "Van Dogh",
    prompt: "painting of {instanceName} {instanceClass} in style of Van Gogh",
    negative_prompt: "",
    example_image_url: "",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Andy Warthog",
    prompt: "painting of {instanceName} {instanceClass} in style of Van Gogh",
    negative_prompt: "",
    example_image_url: "",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Magical",
    prompt: "painting of {instanceName} {instanceClass} in style of Van Gogh",
    negative_prompt: "",
    example_image_url: "",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Astronaut",
    prompt: "painting of {instanceName} {instanceClass} in style of Van Gogh",
    negative_prompt: "",
    example_image_url: "",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Astronaut - Woah",
    prompt: "painting of {instanceName} {instanceClass} in style of Van Gogh",
    negative_prompt: "",
    example_image_url: "",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Jackson Pollock",
    prompt:
      "painting of {instanceName} {instanceClass} in abtract style of Jackson Pollock",
    negative_prompt: "",
    example_image_url: "",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Pablo Picasso",
    prompt:
      "painting of {instanceName} {instanceClass} in style of Pablo Picasso",
    negative_prompt: "",
    example_image_url: "",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
];

const doThing = async () => {
  const testPrisma = new PrismaClient({ datasources: { db: { url: testDB } } });

  const put = await testPrisma.styles.createMany({ data: things });
  console.log(put);
};

doThing();
