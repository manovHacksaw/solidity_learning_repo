import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Login from "../components/Login";
import { contractABI, contractAddress } from "../constants/constants";
import Connected from "../components/Connected";
import Finished from "../components/Finished";

const App = () => {
  
  const [account, setAccount] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  const fetchOwner = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const ownerAddress = await contractInstance.getOwner();
      setOwner(ownerAddress.toLowerCase());
      console.log("Owner address:", ownerAddress);
      console.log("Current address: ", account);
    } catch (error) {
      console.error("Error fetching owner:", error);
    }
  };

  const getAllCandidates = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const candidates = await contractInstance.getAllVotesOfCandidates();
      setCandidates(candidates);
      console.log("Candidates:", candidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const voteForCandidate = async (candidateIndex) => {
    if (hasVoted) {
      alert("You have already voted!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const tx = await contractInstance.vote(candidateIndex);
      await tx.wait();
      console.log("Vote cast for candidate index:", candidateIndex);
      await getAllCandidates();
      await checkVoterStatus();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const status = await contractInstance.getVotingStatus();
      setVotingStatus(status);
      console.log("Voting status:", status);
    } catch (error) {
      console.error("Error fetching voting status:", error);
    }
  };

  const fetchRemainingTime = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const time = await contractInstance.getRemainingTime();
      setRemainingTime(time.toString());
      console.log("Remaining time:", time.toString());
    } catch (error) {
      console.error("Error fetching remaining time:", error);
    }
  };

  const endVotingEarly = async () => {
    try {
      const currentAccount = account.toLowerCase(); // Normalize account address
      const normalizedOwner = owner.toLowerCase(); // Normalize owner address

      if (normalizedOwner === currentAccount) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
        const tx = await contractInstance.endVotingEarly();
        await tx.wait();

        console.log("Voting ended early");
      } else {
        alert("Only the owner is allowed to end the voting early.");
      }

      await fetchVotingStatus();
    } catch (error) {
      console.error("Error ending voting early:", error);
    }
  };

  const checkVoterStatus = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
      const status = await contractInstance.hasVoted(await signer.getAddress());
      setHasVoted(status);
      console.log("Has voted:", status);
    } catch (error) {
      console.error("Error checking voter status:", error);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await fetchOwner();
          await fetchVotingStatus();
          await fetchRemainingTime();
          await getAllCandidates();
          await checkVoterStatus();
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    const handleAccountChange = async (accounts) => {
      setAccount(accounts[0]);
      setIsConnected(accounts.length > 0);
      setCandidates([]); 
      setHasVoted(false); 
      await fetchOwner();
      await fetchVotingStatus();
      await fetchRemainingTime();
      await getAllCandidates();
      await checkVoterStatus();
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  }, []);

  return (
    <div className="App">
      <h1 className="app-title">Voting DApp</h1>
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            votingStatus={votingStatus}
            remainingTime={remainingTime}
            hasVoted={hasVoted}
            voteForCandidate={voteForCandidate}
            endVotingEarly={endVotingEarly} // Pass the function directly
          />
        ) : (
          <Login setIsConnected={setIsConnected} setAccount={setAccount} />
        )
      ) : (
        <Finished />
      )}
    </div>
  );
};

export default App;
