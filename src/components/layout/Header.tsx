import { StripeCheckoutSession } from "@/pages/api/credits/check/[ppi]/[sessionId]";
import {
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios, { AxiosResponse } from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { IoIosPaw } from "react-icons/io";
import { RiCopperCoinFill } from "react-icons/ri";
import { useQuery } from "react-query";
import PurchaseCreditsModal from "../credits/CreditsModal";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [waitingPayment, setWaitingPayment] = React.useState(false);
  const [creditAmount, setCreditAmount] = React.useState(0);
  const { isOpen, onClose, onOpen } = useDisclosure();

  useQuery(
    "check-payment",
    () =>
      axios.get(
        `/api/credits/check/${router.query.ppi}/${router.query.session_id}`
      ),
    {
      cacheTime: 0,
      refetchInterval: 500,
      enabled: waitingPayment,
      onSuccess: (data: AxiosResponse<StripeCheckoutSession>) => {
        setCreditAmount(data.data.total_credits!);
        setWaitingPayment(false);
        router.replace(router.asPath.split("?")[0], undefined, {
          shallow: true,
        });
      },
    }
  );

  useEffect(() => {
    setCreditAmount(session?.user.credits || 0);
  }, [session]);

  useEffect(() => {
    // `updateCredits` is required to be present in the stripe success_url to trigger this.
    const { ppi, session_id, updateCredits } = router.query;
    if (ppi && session_id && updateCredits) {
      setWaitingPayment(true);
    }
  }, [router]);

  return (
    <Flex
      width="100%"
      flexDirection="column"
      marginX="auto"
      maxWidth="container.lg"
      px={6}
    >
      <Flex justifyContent="space-between" py={4} as="footer">
        <Flex
          role="group"
          as={Link}
          href="/"
          alignItems="center"
          fontWeight="bold"
          fontSize="2xl"
        >
          <Icon
            transition="200ms all"
            _groupHover={{ color: "brand.500" }}
            as={IoIosPaw}
            marginRight={1}
          />
          <Text>PetPics</Text>
        </Flex>
        {session ? (
          <HStack>
            {session && (
              <Button onClick={onOpen} variant="transparent" size="sm" pr={0}>
                {creditAmount}
                {"   "}
                <Icon
                  as={RiCopperCoinFill}
                  boxSize="1.2em"
                  color={"gold"}
                  margin=".5em"
                />
              </Button>
            )}
            <Button href="/dashboard" as={Link} variant="brand" size="sm">
              Dashboard
            </Button>
            <Button
              variant="link"
              size="sm"
              color="blackAlpha.500"
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
              marginRight=".1rem"
            >
              Log out
            </Button>
          </HStack>
        ) : (
          <Button href="/login" as={Link} variant="brand" size="sm">
            Login
          </Button>
        )}
      </Flex>
      <PurchaseCreditsModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

export default Header;
