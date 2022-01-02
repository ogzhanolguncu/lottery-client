import { Flex, SkeletonText, Box, Button, Text, Stack } from "@chakra-ui/react";

import { maskAddress, networkMatcher } from "../util";
import { useSnapshot } from "valtio";
import { globalState } from "../store/globalStore";
import useChangeListener from "../hooks/useChangeListener";

const InfoBox = () => {
	const { isUserConnected, metaMaskInstance, isContractOwner } = useSnapshot(globalState);
	const [{ isContractOwnerLoading, isWalletBalanceLoading, walletBalance }] = useChangeListener();

	const walletAddress = maskAddress(metaMaskInstance?.selectedAddress);
	const walletNetwork = networkMatcher(metaMaskInstance?.networkVersion);

	const connectToMetamask = async () => {
		try {
			await metaMaskInstance?.request({
				method: "eth_requestAccounts",
			});
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Flex justifyContent={["center", "center", "flex-end", "flex-end"]} width="100%" padding="1rem">
			<Stack spacing="35px" direction={["column", "column", "row", "row"]}>
				<Flex>
					<SkeletonText isLoaded={isUserConnected} noOfLines={3} width="80px" height="48px">
						<Box>
							Network <Text color="white">{walletNetwork}</Text>
						</Box>
					</SkeletonText>
					<SkeletonText
						marginLeft="35px"
						isLoaded={isUserConnected && !isWalletBalanceLoading}
						noOfLines={3}
						width="120px"
						height="48px"
					>
						<Box>
							Wallet Balance <Text color="white">{walletBalance} ETH</Text>
						</Box>
					</SkeletonText>
				</Flex>
				<Flex>
					<SkeletonText
						isLoaded={isUserConnected && !isContractOwnerLoading}
						noOfLines={3}
						width="70px"
						height="48px"
					>
						<Box>
							Address
							{isContractOwner ? <Text color="red.500">Owner</Text> : walletAddress}
						</Box>
					</SkeletonText>
					<Button onClick={connectToMetamask} color="#916BBF" marginLeft="35px">
						{isUserConnected ? "Connected" : "Connect Wallet"}
					</Button>
				</Flex>
			</Stack>
		</Flex>
	);
};

export default InfoBox;
