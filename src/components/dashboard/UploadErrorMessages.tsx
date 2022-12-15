import { Box, Text } from "@chakra-ui/react";
import React from "react";

const UploadErrorMessages = ({
  messages,
  max_amt,
}: {
  messages: string[] | undefined;
  max_amt: number;
}) => {
  return (
    <Box mt={2} color="red.500">
      <Text fontWeight="bold">There are some errors with your images:</Text>
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

export default UploadErrorMessages;
