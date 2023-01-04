import { ListItem, ListIcon } from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";

export const PriceItem = ({ children }: { children: React.ReactNode }) => (
  <ListItem>
    <ListIcon fontSize="xl" as={HiBadgeCheck} /> {children}
  </ListItem>
);
