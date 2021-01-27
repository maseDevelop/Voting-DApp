import React from "react";
import {
  Box,
  Text,
  Link,
  Image,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  const { accountVotedReducer, setTopCharactersReducer, setUpReducer } = state;

  return {
    accounts: setUpReducer.accounts,
    contract: setUpReducer.contract,
    accountVoted: accountVotedReducer.accountVoted,
    topCharacters: setTopCharactersReducer.topCharacters,
  };
};

const CharacterWidget = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const castVote = async (id) => {
    await props.contract.methods
      .castVote(id - 1)
      .send({ from: props.accounts[0] });
    //Setting the person to has voted on the website, it will have automataically been updated on the blockchain
    props.updateTopDisplay();
  };

  return (
    <Box
      borderRadius={4}
      align="center"
      border="1px"
      bgColor="#686868"
      borderColor="black"
      w="18%"
      h="280px"
      m={3}
    >
      <Image
        boxSize="200px"
        boxSize="150px"
        objectFit="scale-down"
        src={props.data.image}
        alt={props.data.name}
        borderRadius="full"
        mt={2}
      />
      <Box bg="#FFE81F" w="60%" mt={2} mb={1} color="white" borderRadius="full">
        <Text color="black" padding={2}>
          {props.data.name}
        </Text>
      </Box>

      <Flex>
        {props.accountVoted ? (
          <Button overflow="hidden" isDisabled={true} flex={1} margin={3} colorScheme="gray">
            Voted
          </Button>
        ) : (
          <Button overflow="hidden"
            colorScheme="yellow"
            flex={1}
            margin={3}
            onClick={() => castVote(props.data.id)}
          >
            Vote
          </Button>
        )}

        <Button overflow="hidden"  flex={1} margin={3} onClick={onOpen}>
          More Info
        </Button>

        <Modal isOpen={isOpen} onClose={onClose} size="xl" colorScheme="gray">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{props.data.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Species: {props.data.species}</Text>
              <Text>Gender: {props.data.gender}</Text>
              <Text>Home World: {props.data.homeworld}</Text>
              <Link color="teal.500" href={props.data.wiki} isExternal>
                Check out {props.data.name}'s Wookiepedia Page
              </Link>
            </ModalBody>
            <ModalFooter>
              {props.accountVoted ? (
                <Button overflow="hidden" isDisabled={true} colorScheme="gray" mr={3}>
                  Voted
                </Button>
              ) : (
                <Button overflow="hidden" colorScheme="yellow" mr={3}>
                  Vote
                </Button>
              )}
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Box>
  );
};

export default connect(mapStateToProps)(CharacterWidget);
