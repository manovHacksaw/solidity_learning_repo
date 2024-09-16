import PropTypes from "prop-types";

const Connected = (props) => {
    
  return (
    <div className="connected-container">
      <h1 className="connected-header">You have successfully connected to your wallet!</h1>
      <p className="connected-account">Address: {props.account}</p>
      
      <div className="candidates-container">
        <h2>Candidates:</h2>
        {props.candidates.length > 0 ? (
          <ul>
            {props.candidates.map((candidate, index) => (
              <li key={index}>
                {candidate.name} - Votes: {(candidate.voteCount).toString()}
                <button onClick={() => props.voteForCandidate(index)}>Vote</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No candidates available.</p>
        )}
      </div>

      

      <div className="voting-status">
        <h2>Voting Status:</h2>
        <p>{props.votingStatus ? "Voting is ongoing." : "Voting has ended."}</p>
      </div>

      <div className="remaining-time">
        <h2>Remaining Time:</h2>
        <p>{props.remainingTime ? `${Math.floor(props.remainingTime/60)} minutes ${props.remainingTime%60} seconds` : "Fetching remaining time..."}</p>
      </div>
          <button onClick={props.endVotingEarly}>End Voting Early</button> 
     
    </div>
  );
};

// Define prop types
Connected.propTypes = {
  account: PropTypes.string.isRequired,
  candidates: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
    })
  ).isRequired,
  voteForCandidate: PropTypes.func.isRequired,
  fetchVotingStatus: PropTypes.func.isRequired,
  fetchRemainingTime: PropTypes.func.isRequired,
  endVotingEarly: PropTypes.func.isRequired,
  remainingTime: PropTypes.string.isRequired,
  votingStatus: PropTypes.bool.isRequired,
};

export default Connected;
