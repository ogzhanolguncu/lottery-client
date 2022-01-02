import { Flex } from "@chakra-ui/react";

import useWalletConnected from "./hooks/useWalletConnected";
import ParticipantBox from "./components/ParticipantBox";
import InfoBox from "./components/InfoBox";
import JoinLottery from "./components/JoinLottery";

//TODO: FORCE NETWORK CHANGE ON LOAD IF NOT ROPSTEN

const App = () => {
	useWalletConnected();

	return (
		<Flex flexDirection="column" padding="1rem" margin="1rem">
			<InfoBox />
			<ParticipantBox />
			<JoinLottery />
		</Flex>
	);
};

export default App;
