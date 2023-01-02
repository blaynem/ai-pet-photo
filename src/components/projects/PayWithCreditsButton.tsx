import {
  Tooltip,
  Button,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  useDisclosure,
  ButtonGroup,
  PopoverFooter,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FC } from "react";

type PayWithCreditsButtonProps = {
  onPaymentApprove: () => void;
  creditCost: number;
};

const PayWithCreditsButton: FC<PayWithCreditsButtonProps> = ({
  creditCost,
  onPaymentApprove,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: userSession } = useSession();
  const userCredits = userSession?.user.credits!;

  const handleApprovePayment = () => {
    onClose();
    onPaymentApprove();
  };

  if (userCredits < creditCost) {
    return (
      <Tooltip label={`${userCredits} / ${creditCost} credits required`}>
        <Button disabled={userCredits < creditCost}>
          Unlock Now - {creditCost} Credits
        </Button>
      </Tooltip>
    );
  }
  return (
    <Popover returnFocusOnClose={false} isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Button onClick={onOpen}>Unlock Now - {creditCost} Credits</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Confirm</PopoverHeader>
        <PopoverBody>
          Approve spending {creditCost} credits to unlock this project?
        </PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleApprovePayment}>
              Approve
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default PayWithCreditsButton;
