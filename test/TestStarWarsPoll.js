const StarWarsPoll = artifacts.require("./StarWarsPoll.sol");
const fetch = require("node-fetch");


contract("StarWarsPoll", (accounts) => {

  it("...should get value of Total Characters before characters have been loaded.", async () => {
    const app = await StarWarsPoll.deployed();
    
    //Getting the value of  the characters before they have been loaded
    const value = await app.getTotalCharacters()

    assert.equal(value, 0, "The Total Characters was not initialised to zero");
  });

  it("...should initialise the characters you can vote for with the amount of characters sent from the API", async () => {
    //The data has to be first fetched from the api

    const response = await fetch(
      "https://rawcdn.githack.com/akabab/starwars-api/0.2.1/api/all.json"
    );
    const data = await response.json();
    //Length of data from the API
    const dataLength = data.length;

    //Getting deployed contract
    const app = await StarWarsPoll.deployed();

    //Seting character list size
    await app.setTotalCharacters(dataLength);

    //No see if it was set correctly
    const value = await app.getTotalCharacters();

    assert.equal(dataLength,value,"The amount of characters in the poll has been set wrong")
  });

  it("...should be able to get a list of characters that is equal to 87", async () =>{

    //Getting deployed contract
    const app = await StarWarsPoll.deployed();

    const data1 = await app.getAll();
    
    assert.equal(data1.length,87,"Not all characters have been retrieved from the contract");
  })

  it("...make sure when an account votes that it shows that the account has voted", async () =>{
    //Getting deployed contract
    const app = await StarWarsPoll.deployed();

    //Vote for Luke Skywalker who has an ID of 1
    await app.castVote(1);

    //Check that the account has voted
    const hasVoted = await app.hasAddressVoted();

    assert.equal(hasVoted,true,"It says this account has not voted");
  })

});


