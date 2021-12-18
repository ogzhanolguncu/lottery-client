import { useCallback, useEffect, useState } from "react";
import { Flex, Heading, Box, Button, Text, HStack, SkeletonText } from "@chakra-ui/react";

import { ethers } from "ethers";

import lotteryAbi from "./Contract/Lottery.json";
import { Lottery as LotteryType } from "./Contract/types/Lottery";
import { networkMatcher } from "./util";

const CONTRACT_ADDRESS = "0x8A495C3Cd9C663853b132BE99E82a6D16e569d03";

const App = () => {
	const walletAddress = window.ethereum.selectedAddress;

	const [isWalletConnected, setIsWalletConnected] = useState(false);

	const [isContractOwner, setIsContractOwner] = useState(false);
	const [isContractOwnerLoading, setIsContractLoading] = useState(false);

	const [walletBalance, setWalletBalance] = useState<string>();
	const [isWalletBalance, setIsWalletBalance] = useState(false);

	const [playerCount, setPlayerCount] = useState<number>();

	const [contractError, setContractError] = useState<string>();

	const connectToMetamask = async () => {
		try {
			await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			setIsWalletConnected(true);
		} catch (err) {
			setIsWalletConnected(false);
			console.error(err);
		}
	};

	const contractFactory = () => {
		const ethereum = window.ethereum;

		const web3Provider = new ethers.providers.Web3Provider(ethereum as any);
		const signer = web3Provider.getSigner();

		return new ethers.Contract(CONTRACT_ADDRESS, lotteryAbi, signer) as LotteryType;
	};

	const getWalletBalance = useCallback(async () => {
		if (isWalletConnected) {
			const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);

			setIsWalletBalance(true);
			const walletsEtherAmount = Number(
				ethers.utils.formatEther(
					await web3Provider.getBalance(window.ethereum.selectedAddress || "")
				)
			).toFixed(4);

			setWalletBalance(walletsEtherAmount);
			setIsWalletBalance(false);
		}
	}, [isWalletConnected]);

	const contractOwner = useCallback(async () => {
		if (isWalletConnected) {
			setIsContractLoading(true);
			setIsContractOwner(
				(await contractFactory().owner()).toLowerCase() === window.ethereum.selectedAddress
			);
			setIsContractLoading(false);
		}
	}, [isWalletConnected]);

	const handleJoinLottery = async () => {
		const lotteryContract = contractFactory();
		const response = await lotteryContract.pickWinner();

		console.log({ response });
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
			if (isWalletConnected) {
				const lotteryContract = contractFactory();
				const playerCount = await lotteryContract.playersCount();
				setPlayerCount(playerCount.toNumber());
			}
		} catch (err) {
			console.log({ err });
			setContractError(err.error.message.split("execution reverted: ")[1]);
		}
	};
	console.log(playerCount);
	useEffect(() => {
		contractOwner();
		getWalletBalance();
	}, [contractOwner, getWalletBalance]);

	useEffect(() => {
		fetchPlayerCount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isWalletConnected]);

	const isPickWinnerAllowed =
		playerCount && (playerCount >= 10 || (isContractOwner && playerCount >= 3));

	return (
		<Flex flexDirection="column" padding="1rem" marginRight="1rem">
			<Flex justifyContent="flex-end" width="100%" padding="1rem">
				<HStack spacing="35px">
					<SkeletonText isLoaded={isWalletConnected} noOfLines={3} width="80px" height="48px">
						<Box>
							Network <Text color="white">{networkMatcher(window.ethereum.networkVersion)}</Text>
						</Box>
					</SkeletonText>
					<SkeletonText
						isLoaded={isWalletConnected && !isWalletBalance}
						noOfLines={3}
						width="120px"
						height="48px"
					>
						<Box>
							Wallet Balance <Text color="white">{walletBalance} ETH</Text>
						</Box>
					</SkeletonText>
					<SkeletonText
						isLoaded={isWalletConnected && !isContractOwnerLoading}
						noOfLines={3}
						width="70px"
						height="48px"
					>
						<Box>
							Address
							{isContractOwner ? <Text color="red.500">Owner</Text> : walletAddress}
						</Box>
					</SkeletonText>
					<Button onClick={connectToMetamask} color="#916BBF">
						{isWalletConnected ? "Connected" : "Connect Wallet"}
					</Button>
				</HStack>
			</Flex>

			<Flex
				justifyContent="center"
				alignItems="center"
				height="80vh"
				flexDirection="column"
				width="100%"
			>
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
