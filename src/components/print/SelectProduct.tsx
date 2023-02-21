import { priceInUSD } from "@/core/utils/prices";
import { reloadSession } from "@/core/utils/reloadSession";
import { ShotsPick } from "@/pages/api/projects";
import {
  Card,
  CardBody,
  Stack,
  Heading,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  Image,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import React, { Component } from "react";
import { useMutation } from "react-query";
import AddressModal from "./AddressModal";

interface SelectProductProps {
  shot: ShotsPick;
}
// create a list of product objects, like a print, poster, canvas, hoodie, etc.
const products = [
  {
    name: "Print",
    description: "A print of your image on paper",
    price: 1000,
    image: "https://via.placeholder.com/150",
    sku: "A-LH-DT97200",
  },
  {
    name: "Poster",
    description: "A poster of your image on paper",
    price: 2000,
    image: "https://via.placeholder.com/150",
    sku: "A-LH-DT97200",
  },
  {
    name: "Canvas",
    description: "A canvas of your image on paper",
    price: 3000,
    image: "https://via.placeholder.com/150",
    sku: "A-LH-DT97200",
  },
  {
    name: "Hoodie",
    description: "A hoodie of your image on paper",
    price: 4000,
    image: "https://via.placeholder.com/150",
    sku: "A-LH-DT97200",
  },
];
// create a component that takes a list of products and displays them in a grid, with a button to select the product with chakra-ui and a card component

const SelectProduct: React.FunctionComponent<SelectProductProps> = ({
  shot,
}) => {
  const { mutate: mutatePurchase } = useMutation(
    `upscale-shot-${shot.id}`,
    (shot: ShotsPick) =>
      axios.post(`/api/shots/print?id=${shot.id}`).then((res) => res.data),
    {
      onSuccess: () => {
        // Reload the session fetches their new credits balance
        reloadSession();
      },
    }
  );

  const handlePurchase = () => {
    mutatePurchase(shot);
  };
  return (
    <>
      <SimpleGrid columns={3} spacing={10}>
        {products.map((product) => (
          <ProductCard
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            handlePurchase={handlePurchase}
          />
        ))}
      </SimpleGrid>
      <AddressModal />
    </>
  );
};

const ProductCard = ({
  name,
  description,
  price,
  image,
  handlePurchase,
}: {
  name: string;
  description: string;
  price: number;
  image: string;
  handlePurchase: () => void;
}) => {
  return (
    <Card maxW="sm" backgroundColor={"whiteAlpha.700"}>
      <CardBody>
        <Image src={image} alt={description} borderRadius="lg" />
        <Stack mt="6" spacing="3">
          <Heading size="md">{name}</Heading>
          <Text>{description}</Text>
          <Text color="blue.600" fontSize="2xl">
            {priceInUSD(price)}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button onClick={handlePurchase} variant="solid" colorScheme="blue">
            Buy now
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
export default SelectProduct;
