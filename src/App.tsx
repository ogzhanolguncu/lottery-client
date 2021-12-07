import { useEffect } from "react";
import { Flex, Heading, Input, Box, Button, Text } from "@chakra-ui/react";

import invariant from "invariant";

const connectToMetamask = async () => {
  try {
    invariant(window.ethereum, "No crypto wallet found. Please install it.");
    window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (err) {
    throw new Error(err);
  }
};

const App = () => {
  useEffect(() => {
    connectToMetamask();
  }, []);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      width="100%"
    >
      <Heading textAlign="center">Place some ether to win the Lottery!</Heading>
      <Text marginTop="2rem" textAlign="center">
        Minimum entry fee is 0.1 ether. You can buy as many tickets as you want
        to increase to chance of winning.
      </Text>
      <Box marginTop="2rem">
        <Input
          placeholder="Deposit Amount"
          focusBorderColor="#916BBF"
          backgroundColor="transparent"
          borderRadius="30px"
          border="2px solid"
          borderColor="#916BBF"
          color="#fff"
          _placeholder={{ color: "gray.100" }}
          _hover={{ borderColor: "#916BBF" }}
        />
        <Flex width="100%" justifyContent="center">
          <Button
            colorScheme="purple"
            variant="solid"
            marginTop="2rem"
            justifyContent="center"
            _focus={{ borderColor: "transparent" }}
            backgroundColor="#916BBF"
          >
            Deposit
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default App;
