import { getPackageInfo } from "@/core/utils/getPackageInfo";
import { priceInUSD } from "@/core/utils/prices";
import { Box, useRadio } from "@chakra-ui/react";

export const RadioCard = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const inputProps = getInputProps();
  const checkbox = getCheckboxProps();

  // Get pricing package info for displaying
  const pricingPackage = getPackageInfo(inputProps.value);

  return (
    <Box as="label">
      <input {...inputProps} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "brand.500",
          color: "blackAlpha.700",
          borderColor: "brand.500",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        <b>{pricingPackage?.totalCredits} Credits</b> for{" "}
        {priceInUSD(pricingPackage?.price!)}
      </Box>
    </Box>
  );
};
