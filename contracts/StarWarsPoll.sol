// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract StarWarsPoll {
    //Total Number of Characters in the Poll
    uint256 private totalCharacters;

    // Read/write
    mapping(address => bool) private addressVoted; //Address and has voted

    //Read/write
    mapping(uint256 => uint256) private candidates; //Id and vote count

    constructor() public {
        totalCharacters = 0;
    }

    //Cast a vote
    function castVote(uint256 id) public {
        //Checking that the address has not voted before
        require(!addressVoted[msg.sender], "This address has already voted");
        //Get the mapping of the id and vote count
        candidates[id]++;
        //Setting the address value to voted
        addressVoted[msg.sender] = true;
    }

    //Has the address already voted - CheckIfAccountVoted()
    function hasAddressVoted() public view returns (bool) {
        return addressVoted[msg.sender];
    }

    //Get top three highest vote counts
    function getAll() public view returns (uint[] memory) {
        require(totalCharacters != 0,"There are no characters to vote for in the pool");
        uint[] memory ret = new uint[](totalCharacters);
        for (uint256 i = 0; i < totalCharacters; i++) {
            ret[i] = candidates[i];
        }
        return ret;
    }

    function setTotalCharacters(uint256 numCharacters) public {
        require(
            numCharacters != totalCharacters,
            "The Amount of Characters Is already set at the value entered"
        );

        //Setting the number of characters in the poll
        totalCharacters = numCharacters;
    }

    function getTotalCharacters() public view returns (uint256) {
        return totalCharacters;
    }
}
