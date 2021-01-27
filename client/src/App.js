import React, { Component } from "react";
import StarWarsPoll from "./contracts/StarWarsPoll.json";
import TopCharactersWidget from "./components/TopCharactersWidget";
import CharacterWidget from "./components/CharacterWidget";
import IsLoadingWidget from "./components/IsLoadingWidget";
import getWeb3 from "./getWeb3";
import Fuse from "fuse.js";
import "./App.css";
import { connect } from "react-redux";
import StarWarsLogo from "./Assets/starWarsLogo.png";
import "./App.css";

import {
  setWeb3Instance,
  setAccountsInstance,
  setContractInstance,
  storeCharacterData,
  storeCharacterSearchResults,
  setAccountHasVoted,
  setTopCharacters,
  setLoading,
} from "./Actions/actions";

import {
  Box,
  Text,
  Heading,
  VStack,
  Flex,
  Center,
  Input,
  Spinner,
  Image,
} from "@chakra-ui/react";

const mapStateToProps = (state) => {
  //Mapping props to state for react-redux
  const {
    accountVotedReducer,
    characterDataReducer,
    setTopCharactersReducer,
    setUpReducer,
  } = state;

  return {
    web3: setUpReducer.web3,
    accounts: setUpReducer.accounts,
    contract: setUpReducer.contract,
    isLoading: setUpReducer.isLoading,
    characterData: characterDataReducer.characterData,
    characterSearchResults: characterDataReducer.characterSearchResults,
    accountVoted: accountVotedReducer.accountVoted,
    topCharacters: setTopCharactersReducer.topCharacters,
  };
};

class App extends Component {
  //Constructor
  constructor(props) {
    super(props);

    //Props
    this.fuse = {};
    this.rank = ["1st", "2nd", "3rd"];
  }

  handleSearch = (query) => {
    const data = this.fuse.search(query);
    const value = data.map((d) => d.item);
    this.props.dispatch(storeCharacterSearchResults(value));
  };

  componentDidMount = async () => {
    try {
      //Fetching API Character Data and storing it in state
      fetch("https://rawcdn.githack.com/akabab/starwars-api/0.2.1/api/all.json")
        .then((response) => response.json())
        .then((data) => {
          //Storing data in state variable
          this.props.dispatch(storeCharacterData(data));

          //Creating Fuse object to search
          this.fuse = new Fuse(this.props.characterData, {
            keys: ["name", "species"],
            includeScore: true,
          });

          //Set isLoading to false
          this.props.dispatch(setLoading(false));
        });

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      const deployedNetwork = StarWarsPoll.networks[networkId];

      const instance = new web3.eth.Contract(
        StarWarsPoll.abi,
        deployedNetwork && deployedNetwork.address
      );

      //Setting up contract and adress instance and an instance of web3
      this.props.dispatch(setWeb3Instance(web3));

      this.props.dispatch(setAccountsInstance(accounts));

      this.props.dispatch(setContractInstance(instance));

      //Setting up event listener so when the account changes the page changes the account - Because running on localhost you need to manually reset transactions
      window.ethereum.on("accountsChanged", async (a) => {
        const net = await web3.eth.net.getNetworkType((d) => {
          return d;
        });

        if (net === "private") {
          alert(
            "Because Metamask is connected to a private instance of the Ethereum block chain, when you change accounts you must reset the transactions for the account.\n" +
              "\nThis can be done by going to MetaMask browser extension and following the steps below:\n" +
              "\nSettings -> Advanced -> Reset Account\n" +
              "\nTo see these changes take affect you will then need to refresh the page."
          );
        } else {
          this.props.dispatch(setAccountsInstance(a[0]));
        }
      });

      this.runStartUp();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  runStartUp = async () => {
    //Setting the amount of characters in the poll
    const n = this.props.characterData.length;

    let a = await this.props.contract.methods
      .getTotalCharacters()
      .call()
      .then((data) => data);

    if (n != a) {
      //The amount of characters has been updated so need to change the number of characters in the poll
      await this.props.contract.methods
        .setTotalCharacters(n)
        .send({ from: this.props.accounts[0] });
    }

    //Updating the display with the top characters
    this.updateTopDisplay();
  };

  updateTopDisplay = async () => {
    //Getting the leader board to display
    let arr = await this.props.contract.methods
      .getAll()
      .call()
      .then((data) => data);

    //Checking to see if the address has voted before
    const hasVoted = await this.props.contract.methods
      .hasAddressVoted()
      .call({ from: this.props.accounts[0] })
      .then((data) => data);

    //Setting state -> if the account has currently voted
    this.props.dispatch(setAccountHasVoted(hasVoted));

    //Create objects to sort
    const newArr = arr.map((count, index) => {
      return {
        id: index,
        voteCount: parseInt(count),
      };
    });

    //Sorting the value pairsf
    newArr.sort((a, b) => a.voteCount - b.voteCount);

    //Get top three values to display on leader board, by adding them to an array
    let leaders = [];
    leaders.push(newArr[newArr.length - 1]);
    leaders.push(newArr[newArr.length - 2]);
    leaders.push(newArr[newArr.length - 3]);

    //Making sure there are vote count values
    let a = leaders.filter((data) => {
      if (data.voteCount !== 0) {
        return data;
      }
    });

    if (a.length === 0) {
      this.props.dispatch(setTopCharacters([]));
    } else {
      this.props.dispatch(setTopCharacters(a));
    }
  };

  render() {
    if (!this.props.web3) {
      return (
        <div>
          <Center mt={4}>
            <Heading>Loading Web3, accounts, and contract...</Heading>
          </Center>
          <Center mt={2}>
            Please make sure you have MetaMask installed on your browser.
          </Center>
          <Center>
            <Spinner
              mt={8}
              thickness="10px"
              speed="0.50s"
              emptyColor="gray.200"
              color="gray.500"
              size="xl"
            />
          </Center>
        </div>
      );
    }
    return (
      <React.Fragment className="body">
        <Box bg="black">
          <Center>
            <Image
              w="50%"
              h="500px"
              src={StarWarsLogo}
              objectFit="scale-down"
              alt="Star Wars"
            />
          </Center>

          <Center>
            <Box bg="#FFE81F" w="50%" p={4} color="white" borderRadius="full">
              <Heading
                className="text"
                fontSize="3xl"
                textAlign="center"
                color="#111"
              >
                Vote For Your Favourite Star Wars Character
              </Heading>
            </Box>
          </Center>

          <VStack pt={10}>
            {this.props.topCharacters.length !== 0 ? (
              this.props.topCharacters.map((data, i) => {
                return (
                  <TopCharactersWidget
                    votes={data.voteCount}
                    character={this.props.characterData[data.id]}
                    rank={this.rank[i]}
                  />
                );
              })
            ) : (
              <Text>No Characters have been voted for</Text>
            )}
          </VStack>

          <Center mt={6}>
            <Box bg="#FFE81F" w="50%" color="white" mt={2} borderRadius="full">
              <Text color="#111" textAlign="center">
                Connected Account: {this.props.accounts}
              </Text>
            </Box>
          </Center>

          <Center fontSize="md" mt={10} h="42px" color="white">
            Search and Vote for your favourite character below
          </Center>

          <Center>
            <Input
              w="25"
              placeholder="Search..."
              color="white"
              onChange={(event) => this.handleSearch(event.target.value)}
            />
          </Center>

          {this.props.isLoading ? (
            <IsLoadingWidget />
          ) : (
            <Flex wrap="wrap" pl={8}>
              {Object.values(
                this.props.characterSearchResults.length === 0
                  ? this.props.characterData
                  : this.props.characterSearchResults
              ).map((type) => {
                return (
                  <CharacterWidget
                    data={type}
                    updateTopDisplay={this.updateTopDisplay}
                  />
                );
              })}
            </Flex>
          )}

          <Center className="text" color="white" pb={4}>
            Mason Elliott
          </Center>
        </Box>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(App);
