import {
  Box,
  Card,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  StackDivider,
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";

const ImageCard = ({
  description,
  imageUrl,
  type,
}: {
  imageUrl: string;
  description: string;
  type: string;
}) => {
  return (
    <Card
      minHeight={"25rem"}
      maxW="2xs"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
      m={2}
    >
      <Image src={imageUrl} boxSize={"15rem"} />
      <Box p="3">
        <Box display="flex" alignItems="baseline">
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {type}
          </Box>
        </Box>
        <Box
          mt="1"
          fontWeight="light"
          fontSize={".8em"}
          as="h4"
          lineHeight="tight"
          display={"flex"}
          alignItems={"center"}
        >
          {description}
        </Box>
      </Box>
    </Card>
  );
};

const GoodPictures = () => {
  return (
    <Box m={4}>
      <Heading size="m" textAlign={"center"}>
        Good
      </Heading>
      <SimpleGrid columns={1}>
        <ImageCard
          imageUrl="/teddyLog.jpg"
          type="Good lighting"
          description="Good lighting allows the AI to see features of the subject more clearly"
        />
        <ImageCard
          imageUrl="/teddyGrass.jpg"
          type="Plain background"
          description="Focused with plain background and good contrast"
        />
        <ImageCard
          imageUrl="/teddyAngle.jpg"
          type="Multiple Angles"
          description="Good angles allow the AI to see the subject more clearly"
        />
      </SimpleGrid>
    </Box>
  );
};

const BadPictures = () => {
  return (
    <Box m={4}>
      <Heading size="m" textAlign={"center"}>
        Bad
      </Heading>
      <SimpleGrid columns={1}>
        <ImageCard
          imageUrl="/vinceLight.jpg"
          type="Poor lighting"
          description="Bad lighting makes it hard for the AI to see features of the subject"
        />
        <ImageCard
          imageUrl="/vinceLight2.jpg"
          type="Busy background"
          description="A busy background makes it hard for the AI to focus on the subject"
        />
        <ImageCard
          imageUrl="/WeirdAngleObstruction.jpg"
          type="Poor Angles"
          description="Poor angles make it hard for the AI to see the subject"
        />
      </SimpleGrid>
    </Box>
  );
};

const ExamplePictures = () => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <Box mt={6}>
      <Heading as="h2" mb={4} fontWeight="bold" fontSize="2xl">
        <i>Put quality in, get quality out</i>
      </Heading>
      <Box borderRadius="10px" padding={3}>
        <Text p={3} textAlign="center">
          <i>
            As the saying goes, Quality in equals Quality out. We can only train
            a studio as well as the pictures that are given to it.
          </i>
        </Text>
        {isMobile ? (
          <VStack spacing={8} mt={4} justifyContent={"space-around"}>
            <GoodPictures />
            <BadPictures />
          </VStack>
        ) : (
          <HStack
            spacing={8}
            mt={4}
            justifyContent={"space-around"}
            divider={<StackDivider borderWidth="2px" borderColor="gray.200" />}
          >
            <GoodPictures />
            <BadPictures />
          </HStack>
        )}
      </Box>
    </Box>
  );
};

export default ExamplePictures;