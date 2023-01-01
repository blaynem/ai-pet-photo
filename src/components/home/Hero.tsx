import {
  GENERATE_PHOTO_AMOUNT_PER_CREDIT,
  PROMOTION_STUDIO_PACKAGE,
} from "@/core/constants";
import { priceInUSD } from "@/core/utils/prices";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  VStack,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi";
import Demo from "./Demo";

const Hero = () => {
  const { data: session } = useSession();
  const isLoggedIn = session?.user;

  return (
    <Box px={{ base: 2, md: 6 }}>
      <SimpleGrid
        as="main"
        minHeight="30rem"
        flex="1"
        flexDirection="column"
        marginX="auto"
        maxWidth="container.lg"
        columns={{ base: 1, lg: 2 }}
        px={{ base: 4, lg: 0 }}
        py={{ base: 10, lg: 0 }}
        gap={{ base: 10, lg: 0 }}
      >
        <VStack
          className="color"
          alignItems={{ base: "center", sm: "flex-start" }}
          spacing={10}
          justifyContent="center"
          flexDirection="column"
        >
          <Box textAlign={{ base: "center", sm: "left" }}>
            <Box
              mb={3}
              as="h1"
              maxWidth="43rem"
              lineHeight={{ base: "2.6rem", sm: "4rem" }}
              fontSize={{ base: "2.3rem", sm: "3.5rem" }}
              fontWeight="black"
            >
              Your{" "}
              <Text as="span" color={"accent.lightOrange"}>
                pet
              </Text>{" "}
              is a{" "}
              <Text as="span" color={"accent.lightOrange"}>
                model
              </Text>
              .
            </Box>
            <Box
              as="h2"
              maxWidth="30rem"
              fontSize={{ base: "xl", sm: "3xl" }}
              lineHeight={{ base: "xl", sm: "3xl" }}
              mb="4px"
            >
              <b>Unleash their potential</b> to become <b>a masterpiece</b>
            </Box>
            <Text fontSize={{ base: "m" }} mb={"2px"}>
              <Badge colorScheme="orange">
                {priceInUSD(PROMOTION_STUDIO_PACKAGE.price)}
              </Badge>{" "}
              for your first model +{" "}
              {PROMOTION_STUDIO_PACKAGE.bonusCredits *
                GENERATE_PHOTO_AMOUNT_PER_CREDIT}{" "}
              photos!*
            </Text>
          </Box>
          <Box>
            <Button
              as={Link}
              href={isLoggedIn ? "/dashboard" : "/login"}
              variant="brand"
              size="lg"
              shadow="xl"
              rightIcon={<HiArrowRight />}
            >
              Start Creating Now
            </Button>
          </Box>
        </VStack>
        <Flex alignItems="center">
          <Demo />
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

export default Hero;
