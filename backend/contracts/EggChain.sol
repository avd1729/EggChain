// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EggChain {
    enum State { Produced, Packed, Shipped, Received }

    struct Egg {
        uint256 id;
        address currentOwner;
        string location;
        State state;
        string metadata;
        uint256 timestamp;
    }

    mapping(uint256 => Egg) public eggs;
    uint256 public eggCounter;

    event EggCreated(uint256 id, address indexed owner, string location, string metadata);
    event EggUpdated(uint256 id, address indexed owner, State state, string location);

    modifier onlyOwner(uint256 _id) {
        require(msg.sender == eggs[_id].currentOwner, "Not the current owner");
        _;
    }

    function createEgg(string memory _location, string memory _metadata) public {
        eggCounter++;
        eggs[eggCounter] = Egg({
            id: eggCounter,
            currentOwner: msg.sender,
            location: _location,
            state: State.Produced,
            metadata: _metadata,
            timestamp: block.timestamp
        });

        emit EggCreated(eggCounter, msg.sender, _location, _metadata);
    }

    function updateEgg(uint256 _id, address _newOwner, string memory _newLocation) public onlyOwner(_id) {
        Egg storage egg = eggs[_id];
        require(uint(egg.state) < uint(State.Received), "Egg already received");

        // Update state and ownership
        egg.state = State(uint(egg.state) + 1);
        egg.currentOwner = _newOwner;
        egg.location = _newLocation;
        egg.timestamp = block.timestamp;

        emit EggUpdated(_id, _newOwner, egg.state, _newLocation);
    }

    function getEgg(uint256 _id) public view returns (Egg memory) {
        require(_id > 0 && _id <= eggCounter, "Invalid egg ID");
        return eggs[_id];
    }
}
