import React, { useCallback, useEffect, useState } from "react";
import { Flex, Box, Text, SkeletonText } from "@chakra-ui/react";

import { maskAddress, NETWORK_IDS } from "../util";

import { contractFactory } from "../util/contractFactory";
import { useAtom } from "jotai";
import { globalAtom, playerAtom } from "../store/globalStore";

const ParticipantBox = () => {
	const [{ metaMaskInstance, isUserConnected }, setState] = useAtom(globalAtom);
	const [{ playerCount, playerLoading }] = useAtom(playerAtom);

	const isRopsten = metaMaskInstance
		? metaMaskInstance.networkVersion === NETWORK_IDS.Ropsten
		: false;

	const [lastWinner, setLastWinner] = useState<string>();
	const [isLastWinnerLoading, setIsLastWinnerLoading] = useState(false);

	const fetchLastWinner = useCallback(async () => {
		try {
			if (isUserConnected && isRopsten) {
				const lotteryContract = contractFactory();
				setIsLastWinnerLoading(true);
				const lastWinnerAddress = await lotteryContract.lastWinner();
				setLastWinner(lastWinnerAddress);
				setIsLastWinnerLoading(false);
			}
		} catch (err) {
			setState((prevState) => ({
				...prevState,
				contractError: err.error.message.split("execution reverted: ")[1],
			}));
			console.log({ err });
		}
	}, [isUserConnected, isRopsten, setState]);

	useEffect(() => {
		fetchLastWinner();
	}, [fetchLastWinner]);

	return (
		<Flex
			width="100%"
			height="30vh"
			justifyContent="center"
			alignItems="flex-end"
			marginBottom="5rem"
		>
			<SkeletonText isLoaded={isRopsten} noOfLines={10} width="400px" height="170px">
				<Box
					borderRadius="10px"
					border="1px solid"
					borderColor="red.500"
					width="400px"
					height="170px"
					padding="1rem"
				>
					<Flex width="100%" alignItems="center" marginTop="1rem">
						<Text fontSize="xl" textAlign="left">
							No. Participant:
						</Text>
						<SkeletonText
							isLoaded={isUserConnected && !playerLoading}
							noOfLines={3}
							width="50px"
							marginLeft="0.3rem"
						>
							<Text fontSize="xl" color="red.500">
								{playerCount}
							</Text>
						</SkeletonText>
					</Flex>
					<Flex width="100%" alignItems="center" marginTop="2rem">
						<Text fontSize="xl" textAlign="left">
							Last winner's address:
						</Text>
						<SkeletonText
							isLoaded={isUserConnected && !isLastWinnerLoading}
							noOfLines={3}
							width={["70px", "70px", "120px", "120px"]}
							marginLeft="0.3rem"
						>
							<Text fontSize="xl" color="red.500">
								{maskAddress(lastWinner || null)}
							</Text>
						</SkeletonText>
					</Flex>
				</Box>
			</SkeletonText>
		</Flex>
	);
};

export default ParticipantBox;
