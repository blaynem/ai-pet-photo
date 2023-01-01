import {
  PROMOTION_STUDIO_PACKAGE,
  STANDARD_STUDIO_PACKAGE,
} from "@/core/constants";
import { priceInUSD } from "@/core/utils/prices";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  List,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { PriceItem } from "../home/Pricing";

// TODO: Need to implement payment with credits as well

const FormPayment = ({
  project,
  handlePaymentSuccess,
  showPromotionalPricing,
}: {
  project: Project;
  handlePaymentSuccess: () => void;
  showPromotionalPricing?: boolean;
}) => {
  const [waitingPayment, setWaitingPayment] = useState(false);
  const { query } = useRouter();

  useQuery(
    "check-payment",
    () => axios.get(`/api/checkout/check/${query.ppi}/${query.session_id}`),
    {
      cacheTime: 0,
      refetchInterval: 500,
      enabled: waitingPayment,
      onSuccess: () => {
        handlePaymentSuccess();
      },
    }
  );

  useEffect(() => {
    setWaitingPayment(query.ppi === project.id);
  }, [query, project]);

  const visibleStudioPackage = showPromotionalPricing
    ? PROMOTION_STUDIO_PACKAGE
    : STANDARD_STUDIO_PACKAGE;

  return (
    <Box textAlign="center" width="100%">
      {waitingPayment ? (
        <Box>
          <Spinner speed="1s" size="xl" />
          <Text mt={2} size="sm">
            Validating payment
          </Text>
        </Box>
      ) : (
        <VStack spacing={4}>
          <Box fontWeight="black" fontSize="3.5rem">
            {priceInUSD(visibleStudioPackage.price)}
            <Box
              ml={1}
              as="span"
              fontWeight="500"
              color="coolGray.400"
              fontSize="1.2rem"
            >
              / model
            </Box>
          </Box>
          {/* TODO: Change the phrasing of this stuff, i dont like it */}
          <Box fontWeight="bold" fontSize="xl">
            Your Model is ready to be trained!
          </Box>
          <List textAlign="left" spacing={1}>
            <PriceItem>
              <b>1</b> custom <b> trained model</b>
            </PriceItem>
            <PriceItem>images generation (512x512 resolution)</PriceItem>
          </List>
          <Button
            as={Link}
            variant="brand"
            href={`/api/checkout/session?ppi=${project.id}&packageId=${visibleStudioPackage.id}`}
          >
            Unlock Now - {priceInUSD(visibleStudioPackage.price)}
          </Button>
          <Box pt={4}>
            <AvatarGroup size="md" max={10}>
              {project.imageUrls.map((url) => (
                <Avatar key={url} src={url} />
              ))}
            </AvatarGroup>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default FormPayment;
