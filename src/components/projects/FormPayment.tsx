import {
  PROMOTION_STUDIO_PACKAGE,
  STANDARD_STUDIO_PACKAGE,
  STUDIO_COST_IN_CREDITS,
} from "@/core/constants";
import { priceInUSD } from "@/core/utils/prices";
import { reloadSession } from "@/core/utils/reloadSession";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  HStack,
  List,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { PriceItem } from "../home/Pricing";
import PayWithCreditsButton from "./PayWithCreditsButton";

const FormPayment = ({
  project,
  handlePaymentSuccess,
  showPromotionalPricing,
}: {
  project: Project;
  handlePaymentSuccess: () => void;
  showPromotionalPricing?: boolean;
}) => {
  const { data: userSession } = useSession();
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
        // Reload the session now to get the potential new credits value
        reloadSession();
      },
    }
  );

  const { mutate: payStudioWithCreditsMutation } = useMutation(
    "studio-payment-credits",
    () =>
      axios.post(
        `/api/credits/payment?ppi=${project.id}&userId=${userSession?.user.id}&purchaseId=STUDIO`
      ),
    {
      onSuccess: () => {
        handlePaymentSuccess();
        // Reload the session now to get the potential new credits value
        reloadSession();
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
          <Box fontWeight="bold" fontSize="xl">
            Your Studio is ready to be built!
          </Box>
          <List textAlign="left" spacing={1}>
            <PriceItem>
              <b>1</b> Studio with a <b>custom trained pet model</b>
            </PriceItem>
          </List>
          <HStack>
            <Button
              as={Link}
              variant="brand"
              href={`/api/checkout/session?ppi=${project.id}&packageId=${visibleStudioPackage.id}`}
            >
              Unlock Now - {priceInUSD(visibleStudioPackage.price)}
            </Button>
            {userSession?.user.credits! > 0 && (
              <PayWithCreditsButton
                creditCost={STUDIO_COST_IN_CREDITS}
                onPaymentApprove={payStudioWithCreditsMutation}
              />
            )}
          </HStack>
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
