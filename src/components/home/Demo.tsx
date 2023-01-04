import { DEMO_IMAGES } from "@/core/constants/publicImages";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Image,
  useMediaQuery,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Pause, WindupChildren } from "windups";
import AvatarsPlaceholder from "./AvatarsPlaceholder";

const teddyImgs = [
  "/pics/teddyGrass.jpg",
  "/pics/tedOnABed.jpg",
  "/pics/teddyLog.jpg",
];
const vincentImgs = [
  "/pics/vinceGoodBoy.jpg",
  "/pics/vinceGoodBoy2.jpg",
  "/pics/vinceMajestic.jpg",
];
const MotionImage = motion(Image);
const MotionBox = motion(Box);

const Demo = () => {
  const [step, setStep] = useState(0);
  const [isMobile] = useMediaQuery("(max-width: 450px)");
  const [images, setImages] = useState(teddyImgs);
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((step) => {
        // set images to match pet
        if (DEMO_IMAGES[(step + 1) % DEMO_IMAGES.length].petId === "teddy")
          setImages(teddyImgs);
        else setImages(vincentImgs);
        return (step + 1) % DEMO_IMAGES.length;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <Box ml={{ base: 0, lg: 10 }} width="100%">
      <Box
        maxWidth={"20em"}
        marginX="auto"
        fontSize="md"
        shadow="0 14px 40px 10px var(--chakra-colors-accent-lightOrange), 0 5px 10px -7px black"
        borderRadius="md"
        py={2}
        px={3}
        backgroundColor="white"
        borderWidth={1}
        borderColor="gray.200"
        display={"flex"}
      >
        <HStack divider={<Divider orientation="vertical" borderWidth={2} />}>
          <Box>Style</Box>

          <MotionBox
            key={DEMO_IMAGES[step].label}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <p>{DEMO_IMAGES[step].label}</p>
          </MotionBox>
        </HStack>
      </Box>
      <Flex justifyContent="space-between" mt={6} pr={isMobile ? 0 : 6}>
        <Box width="100%" position="relative" ml={isMobile ? 0 : 10}>
          <AvatarsPlaceholder imageUrls={images} />
        </Box>
        <AnimatePresence mode="wait">
          <MotionImage
            key={DEMO_IMAGES[step].label}
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ delay: 0.2 }}
            shadow="2xl"
            borderRadius="3xl"
            width="10rem"
            zIndex={10}
            alt={DEMO_IMAGES[step].label}
            src={DEMO_IMAGES[step].imageUrl}
          />
        </AnimatePresence>
      </Flex>
    </Box>
  );
};

export default Demo;
