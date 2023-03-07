// Create a modal dialog to collect the address information

import * as React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Address } from "@/pages/print/[productId]/[shotId]";

// create a form to collect the address information with chakra-ui

export const AddressForm = ({
  addressInput,
  setAddressInput,
}: {
  addressInput: Address;
  setAddressInput: (address: Address) => void;
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    console.log("submit");
  };
  return (
    <form>
      <VStack spacing={3}>
        <FormControl>
          <FormLabel htmlFor="firstName">First Name</FormLabel>
          <Input
            onChange={(e) =>
              setAddressInput({ ...addressInput, firstName: e.target.value })
            }
            type="text"
            name="firstName"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="lastName">Last Name</FormLabel>
          <Input
            onChange={(e) =>
              setAddressInput({ ...addressInput, lastName: e.target.value })
            }
            type="text"
            name="lastName"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            onChange={(e) =>
              setAddressInput({ ...addressInput, address1: e.target.value })
            }
            type="text"
            name="address"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="address2">Address Line 2</FormLabel>
          <Input
            onChange={(e) =>
              setAddressInput({ ...addressInput, address2: e.target.value })
            }
            type="text"
            name="address2"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="city">City</FormLabel>
          <Input
            onChange={(e) =>
              setAddressInput({ ...addressInput, city: e.target.value })
            }
            type="text"
            name="city"
          />
        </FormControl>
        <StateSelect address={addressInput} setAddressInput={setAddressInput} />
        <FormControl>
          <FormLabel htmlFor="zip">Zip</FormLabel>
          <Input
            onChange={(e) =>
              setAddressInput({ ...addressInput, zip: e.target.value })
            }
            type="text"
            name="zip"
          />
        </FormControl>
        <Button onClick={() => console.log(addressInput)}>Submit</Button>
      </VStack>
    </form>
  );
};

const states = [
  { name: "Alabama", abbreviation: "AL" },
  { name: "Arizona", abbreviation: "AZ" },
  { name: "Arkansas", abbreviation: "AR" },
  { name: "California", abbreviation: "CA" },
  { name: "Colorado", abbreviation: "CO" },
  { name: "Connecticut", abbreviation: "CT" },
  { name: "Delaware", abbreviation: "DE" },
  { name: "District Of Columbia", abbreviation: "DC" },
  { name: "Florida", abbreviation: "FL" },
  { name: "Georgia", abbreviation: "GA" },
  { name: "Idaho", abbreviation: "ID" },
  { name: "Illinois", abbreviation: "IL" },
  { name: "Indiana", abbreviation: "IN" },
  { name: "Iowa", abbreviation: "IA" },
  { name: "Kansas", abbreviation: "KS" },
  { name: "Kentucky", abbreviation: "KY" },
  { name: "Louisiana", abbreviation: "LA" },
  { name: "Maine", abbreviation: "ME" },
  { name: "Maryland", abbreviation: "MD" },
  { name: "Massachusetts", abbreviation: "MA" },
  { name: "Michigan", abbreviation: "MI" },
  { name: "Minnesota", abbreviation: "MN" },
  { name: "Mississippi", abbreviation: "MS" },
  { name: "Missouri", abbreviation: "MO" },
  { name: "Montana", abbreviation: "MT" },
  { name: "Nebraska", abbreviation: "NE" },
  { name: "Nevada", abbreviation: "NV" },
  { name: "New Hampshire", abbreviation: "NH" },
  { name: "New Jersey", abbreviation: "NJ" },
  { name: "New Mexico", abbreviation: "NM" },
  { name: "New York", abbreviation: "NY" },
  { name: "North Carolina", abbreviation: "NC" },
  { name: "North Dakota", abbreviation: "ND" },
  { name: "Ohio", abbreviation: "OH" },
  { name: "Oklahoma", abbreviation: "OK" },
  { name: "Oregon", abbreviation: "OR" },
  { name: "Pennsylvania", abbreviation: "PA" },
  { name: "Rhode Island", abbreviation: "RI" },
  { name: "South Carolina", abbreviation: "SC" },
  { name: "South Dakota", abbreviation: "SD" },
  { name: "Tennessee", abbreviation: "TN" },
  { name: "Texas", abbreviation: "TX" },
  { name: "Utah", abbreviation: "UT" },
  { name: "Vermont", abbreviation: "VT" },
  { name: "Virginia", abbreviation: "VA" },
  { name: "Washington", abbreviation: "WA" },
  { name: "West Virginia", abbreviation: "WV" },
  { name: "Wisconsin", abbreviation: "WI" },
  { name: "Wyoming", abbreviation: "WY" },
];

const StateSelect = ({
  address,
  setAddressInput,
}: {
  address: Address;
  setAddressInput: (address: Address) => void;
}) => {
  return (
    <FormControl>
      <FormLabel htmlFor="state">State</FormLabel>
      <Select
        placeholder="Select option"
        onChange={(e) => setAddressInput({ ...address, state: e.target.value })}
      >
        {states.map((state) => (
          <option key={state.abbreviation} value={state.abbreviation}>
            {state.name}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
