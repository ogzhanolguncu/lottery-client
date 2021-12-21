import { useEffect, useState } from "react";
import { Flex, Heading, Box, Button, Text, HStack } from "@chakra-ui/react";

import { ethers } from "ethers";

import { CONTRACT_ADDRESS, NETWORK_IDS } from "./util";
import { TransactionRequest } from "@ethersproject/providers";
import useWalletConnected from "./hooks/useWalletConnected";
import ParticipantBox from "./components/ParticipantBox";
import { contractFactory } from "./util/contractFactory";
import InfoBox from "./components/InfoBox";

//TODO: GOOD TO HAVE -> SWR TO PERIODICAALLY REFRESH
//TODO: AFTER PICK WINNER & JOIN LOTTERY CLICKED  REFRESH WALLET BALANCE
//TODO: STATE MANAGEMENT
//TODO: FORCE NETWORK CHANGE ON LOAD IF NOT ROPSTEN

const App = () => {
	const [isWalletConnected] = useWalletConnected();

	const [playerCount, setPlayerCount] = useState<number>();
	const [isPlayerCountLoading, setIsPlayerCountLoading] = useState(false);

	const [contractError, setContractError] = useState<string>();

	const [isTransactionPending, setIsTransactionPending] = useState(false);

	const handleJoinLottery = async () => {
		try {
			const etherAmount = "0.1";
			const tx: TransactionRequest = {
				to: CONTRACT_ADDRESS,
				value: ethers.utils.parseEther(etherAmount),
			};

			const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);
			const signer = web3Provider.getSigner();

			setIsTransactionPending(true);
			await signer.sendTransaction(tx);
			setIsTransactionPending(false);
		} catch (err) {
			setIsTransactionPending(false);
			setContractError(err.error.message.split("execution reverted: ")[1]);
		}
	};

	const handlePickWinner = async () => {
		try {
			const lotteryContract = contractFactory();
			await lotteryContract.pickWinner();
		} catch (err) {
			console.log({ err });
			setContractError(err.error.message.split("execution reverted: ")[1]);
		}
	};

	const fetchPlayerCount = async () => {
		try {
			if (isWalletConnected && window.ethereum.networkVersion === NETWORK_IDS.Ropsten) {
				const lotteryContract = contractFactory();
				setIsPlayerCountLoading(true);
				const playerCount = await lotteryContract.playersCount();
				setPlayerCount(playerCount.toNumber());
				setIsPlayerCountLoading(false);
			}
		} catch (err) {
			console.log({ err });
			setContractError(err.error.message.split("execution reverted: ")[1]);
		}
	};

	useEffect(() => {
		fetchPlayerCount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isWalletConnected]);

	//TODO: REPLACE TRUE WITH CONTRACT ORDER STATE
	const isPickWinnerAllowed = playerCount && (playerCount >= 10 || (true && playerCount >= 3));

	return (
		<Flex flexDirection="column" padding="1rem" margin="1rem">
			<InfoBox />
			<ParticipantBox playerCount={playerCount} isPlayerCountLoading={isPlayerCountLoading} />
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
								disabled={!isWalletConnected}
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
		</Flex>
	);
};

export default App;
