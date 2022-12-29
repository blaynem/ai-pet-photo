import { Box, Text } from "@chakra-ui/react";
import React from "react";

export enum ErrorMessageHeader {
  UPLOADER = "There are some errors with your images:",
}

const ErrorMessages = ({
  header,
  messages,
  max_amt,
}: {
  header?: string;
  messages: string[] | undefined;
  max_amt: number;
}) => {
  return (
    <Box mt={2} color="red.500">
      {header && <Text fontWeight="bold">{header}</Text>}
      {messages?.map((errorMessage) => (
        <Box key={errorMessage}>
          {errorMessage
            .replace("10000000 bytes", "10mo")
            .replace("many files", `many files (max ${max_amt})`)}
        </Box>
      ))}
    </Box>
  );
};

export default ErrorMessages;
