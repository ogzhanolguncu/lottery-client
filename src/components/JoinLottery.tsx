import React, { useEffect, useState } from "react";
import { Flex, Heading, Box, HStack, Button, Text } from "@chakra-ui/react";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS } from "../util";
import { contractFactory } from "../util/contractFactory";
import { useAtom } from "jotai";
import { fetchPlayerAtom, globalAtom } from "../store/globalStore";

const JoinLottery = () => {
	const [{ metaMaskInstance, isUserConnected, isContractOwner, contractError }, setState] =
		useAtom(globalAtom);
	const [{ playerCount }, fetchPlayers] = useAtom(fetchPlayerAtom);
	const [isTransactionPending, setIsTransactionPending] = useState(false);

	const handleJoinLottery = async () => {
		try {
			const etherAmount = "0.1";
			const tx = {
				to: CONTRACT_ADDRESS,
				value: ethers.utils.parseEther(etherAmount),
			};

			const web3Provider = new ethers.providers.Web3Provider(metaMaskInstance as any);
			const signer = web3Provider.getSigner();

			setIsTransactionPending(true);
			await signer.sendTransaction(tx);
			setIsTransactionPending(false);
		} catch (err) {
			setIsTransactionPending(false);
			setState((prevState) => ({
				...prevState,
				contractError: err.error.message.split("execution reverted: ")[1],
			}));
		}
	};

	const handlePickWinner = async () => {
		try {
			const lotteryContract = contractFactory();
			await lotteryContract.pickWinner();
		} catch (err) {
			console.log({ err });
			setState((prevState) => ({
				...prevState,
				contractError: err.error.message.split("execution reverted: ")[1],
			}));
		}
	};

	useEffect(() => {
		fetchPlayers();
	}, [fetchPlayers, isUserConnected]);

	const isPickWinnerAllowed =
		playerCount && (playerCount >= 10 || (isContractOwner && playerCount >= 3));
	return (
		<Flex justifyContent="center" alignItems="center" flexDirection="column" width="100%">
			<Heading textAlign="center">Place some ether to win the Lottery!</Heading>
			<Text marginTop="2rem" textAlign="center">
				Minimum entry fee is 0.1 ether. You can buy as many tickets as you want to increase to
				chance of winning.
			</Text>
			<Box marginTop="2rem">
				<Flex width="100%" justifyContent="center" flexDirection="column">
					<HStack spacing="35px" marginTop="2rem">
						<Button
							colorScheme="purple"
							variant="solid"
							justifyContent="center"
							_focus={{ borderColor: "transparent" }}
							backgroundColor="#3D2C8D"
							isLoading={isTransactionPending}
							disabled={!isUserConnected}
							onClick={handleJoinLottery}
						>
							Join the Lottery!
						</Button>
						<Button
							colorScheme="purple"
							variant="solid"
							justifyContent="center"
							_focus={{ borderColor: "transparent" }}
							backgroundColor="#3D2C8D"
							disabled={!isPickWinnerAllowed}
							onClick={handlePickWinner}
						>
							Pick the winner!
						</Button>
					</HStack>
					{contractError && (
						<Text textAlign="center" color="red.500" marginTop="2rem">
							Error: {contractError}
						</Text>
					)}
				</Flex>
			</Box>
		</Flex>
	);
};

export default JoinLottery;
