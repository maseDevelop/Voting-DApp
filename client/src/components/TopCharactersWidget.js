import React from "react";
import {
  Box,
  Heading,
  Image,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Flex,
} from "@chakra-ui/react";

const TopCharactersWidget = (props) => {
  return (
    <Box bg="#686868" w="75%" h="200px" rounded="md">
      <Flex flexDirection="Horizontal">
        <Image
          borderRadius="full"
          boxSize="150px"
          ml={10}
          mt={6}
          src={props.character.image}
          alt={props.character.name}
          objectFit="scale-down"
        />

        <Box fontSize="3xl" pl={10} mt={20} flex={2}>
          <Heading>{props.character.name}</Heading>
        </Box>

        <StatGroup flex={1} pt={20}>
          <Stat>
            <StatLabel>Ranking</StatLabel>
            <StatNumber>{props.rank}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>Vote Count</StatLabel>
            <StatNumber>{props.votes}</StatNumber>
          </Stat>
        </StatGroup>
      </Flex>
    </Box>
  );
};

export default TopCharactersWidget;
