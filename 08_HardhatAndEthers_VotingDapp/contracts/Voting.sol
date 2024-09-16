// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Voting {
    // Struct to represent a candidate
    struct Candidate {
        string name; // Name of the candidate
        uint256 voteCount; // Number of votes received
    }

    // Array to hold the list of candidates
    Candidate[] public candidates;

    // Address of the contract owner
    address public owner;

    // Mapping to track whether an address has voted
    mapping(address => bool) public voters;

    // Voting time variables
    uint256 public votingStart; // Timestamp when voting starts
    uint256 public votingEnd; // Timestamp when voting ends

    // Events to log actions on the blockchain
    event CandidateAdded(string name);
    event Voted(address voter, uint256 candidateIndex);
    event VotingEndedEarly();
    event VoteCountUpdated(uint256 candidateIndex, uint256 newVoteCount); // Emit event for vote count change

    // Constructor to initialize the contract with candidates and voting duration
    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        require(
            _candidateNames.length > 0,
            "At least one candidate is required."
        );

        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(
                Candidate({name: _candidateNames[i], voteCount: 0})
            );
            emit CandidateAdded(_candidateNames[i]);
        }

        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier duringVoting() {
        require(
            block.timestamp >= votingStart && block.timestamp < votingEnd,
            "Voting is not currently allowed."
        );
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({name: _name, voteCount: 0}));
        emit CandidateAdded(_name);
    }

    function vote(uint256 _candidateIndex) public duringVoting {
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;

        emit Voted(msg.sender, _candidateIndex);
        emit VoteCountUpdated(
            _candidateIndex,
            candidates[_candidateIndex].voteCount
        ); // Emit event for updated vote count
    }

    function getAllVotesOfCandidates()
        public
        view
        returns (Candidate[] memory)
    {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    function getCandidate(
        uint256 _index
    ) public view returns (string memory name, uint256 voteCount) {
        require(_index < candidates.length, "Invalid candidate index.");
        Candidate storage candidate = candidates[_index];
        return (candidate.name, candidate.voteCount);
    }

    function getVoteCount(
        uint256 _candidateIndex
    ) public view returns (uint256) {
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );
        return candidates[_candidateIndex].voteCount;
    }

    function endVotingEarly() public onlyOwner {
        votingEnd = block.timestamp;
        emit VotingEndedEarly();
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner address cannot be zero.");
        owner = newOwner;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // New function to check if an address has voted
    function hasVoted(address voter) public view returns (bool) {
        return voters[voter];
    }
}
