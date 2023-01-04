import {
  AspectRatio,
  Box,
  Center,
  SimpleGrid,
  Spinner,
  Image,
  Text,
  Heading,
} from "@chakra-ui/react";
import { Styles } from "@prisma/client";

const tempStyles: Partial<Styles>[] = [
  {
    name: "Van Dogh",
    prompt: "painting of {instanceName} {instanceClass} in style of Van Gogh",
    negative_prompt: "",
    example_image_url: "out-0.jpg",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Andy Warthog",
    prompt:
      "painting of {instanceName} {instanceClass} in style of Andy Warhol",
    negative_prompt: "",
    example_image_url: "out-0.jpg",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Magical",
    prompt: "painting of {instanceName} {instanceClass} in stylqdqgh",
    negative_prompt: "",
    example_image_url: "out-0.jpg",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Astronaut",
    prompt:
      "painting of {instanceName} {instanceClass} in seqwetyle of Van Gogh",
    negative_prompt: "",
    example_image_url: "out-0.jpg",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Astronaut - Woah",
    prompt:
      "painting of {instanceName} {instanceClass} ineqeqe style of Van Gogh",
    negative_prompt: "",
    example_image_url: "out-0.jpg",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Jackson Pollock",
    prompt:
      "painting of {instanceName} {instanceClass} in abdqwatract style of Jackson Pollock",
    negative_prompt: "",
    example_image_url: "out-0.jpg",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
  {
    name: "Pablo Picasso",
    prompt:
      "painting of {instanceName} {instanceClass} itqwrrtqn style of Pablo Picasso",
    negative_prompt: "",
    example_image_url: "out-0.jpg",
    prompt_strength: 1,
    seed: 1,
    guidance_scale: 1,
    num_inference_steps: 1,
    scheduler: "DDIM",
  },
];

/**
 * Grid for displaying a list of shots cards.
 */
const StylesDisplay = () => {
  const availableStyles: Partial<Styles>[] = tempStyles;
  return (
    <Box>
      <Heading mb={8}>Available Styles (Updated weekly!)</Heading>
      <SimpleGrid columns={[4, 5]} spacing={[1, 2]}>
        {availableStyles.map((style) => (
          <Box key={style.name} backgroundColor="transparent" overflow="hidden">
            <Image
              borderRadius="lg"
              alt={style.name || "Stylized image of your pet"}
              src={style.example_image_url}
              fallback={
                <AspectRatio ratio={1} height={"100%"}>
                  <Center>
                    <Spinner speed="2s" color="gray.400" />
                  </Center>
                </AspectRatio>
              }
            />
            <Text fontSize={"sm"}>{style.name}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StylesDisplay;
