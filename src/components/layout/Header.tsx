import { Button, Flex, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { IoIosFlash } from "react-icons/io";
import { RiCopperCoinFill } from "react-icons/ri";
import { useQuery } from "react-query";

const Header = () => {
  const { data: session } = useSession({
    required: true,
  });
  const user = session?.user;
  const { query } = useRouter();
  const [waitingPayment, setWaitingPayment] = React.useState(false);
  const [credits, setCredits] = React.useState(session?.user.credits || 0);

  useQuery(
    "check-payment",
    () =>
      axios.get(
        `/api/credits/check/${query.ppi}/${query.session_id}/${query.price}`
      ),
    {
      cacheTime: 0,
      refetchInterval: 10,
      enabled: waitingPayment,
      onSuccess: () => {
        setCredits((credits) => credits + Number(query.price));
        setWaitingPayment(false);
      },
    }
  );

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
            as={IoIosFlash}
          />
          <Text>Photoshot.</Text>
        </Flex>
        {session ? (
          <HStack>
            <Button href="/credits" as={Link} variant="transparent" size="sm">
              {credits}
              {"   "}
              <Icon
                as={RiCopperCoinFill}
                boxSize="1.2em"
                color={"gold"}
                margin=".5em"
              />
            </Button>
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
    </Flex>
  );
};

export default Header;
