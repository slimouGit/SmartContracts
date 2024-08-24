// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    // Struktur zur Speicherung von Details zu einer Spende
    struct Contribution {
        address contributor;
        uint amount;
    }

    // Liste aller Spenden
    Contribution[] public contributions;

    // Speichert die Gesamtanzahl der gesammelten Mittel
    uint public totalFunds;

    // Speichert das Ziel der Crowdfunding-Kampagne
    uint public goal;

    // Der Besitzer des Projekts (derjenige, der das Geld abheben kann, wenn das Ziel erreicht ist)
    address public owner;

    // Zeitpunkt, bis zu dem die Kampagne läuft
    uint public deadline;

    // Gibt an, ob das Ziel erreicht wurde
    bool public goalReached;

    // Gibt an, ob der Besitzer das Geld abgehoben hat
    bool public fundsWithdrawn;

    constructor(uint _goal, uint _durationInMinutes) {
        goal = _goal;
        owner = msg.sender;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
        goalReached = false;
        fundsWithdrawn = false;
    }

    // Funktion zur Teilnahme am Crowdfunding
    function contribute() public payable {
        require(block.timestamp < deadline, "The crowdfunding campaign is over.");
        require(msg.value > 0, "Contribution must be greater than 0.");

        contributions.push(Contribution({
            contributor: msg.sender,
            amount: msg.value
        }));

        totalFunds += msg.value;

        if (totalFunds >= goal) {
            goalReached = true;
        }
    }

    // Funktion, um die gesammelten Mittel abzuheben, falls das Ziel erreicht ist
    function withdrawFunds() public {
        require(msg.sender == owner, "Only the project owner can withdraw the funds.");
        require(goalReached, "Goal not reached yet.");
        require(!fundsWithdrawn, "Funds already withdrawn.");

        fundsWithdrawn = true;
        payable(owner).transfer(totalFunds);
    }

    // Funktion, um das Geld zurückzufordern, falls das Ziel nicht erreicht wurde
    function refund() public {
        require(block.timestamp >= deadline, "The crowdfunding campaign is still ongoing.");
        require(!goalReached, "Goal has been reached, no refunds available.");

        uint refundAmount = 0;

        for (uint i = 0; i < contributions.length; i++) {
            if (contributions[i].contributor == msg.sender && contributions[i].amount > 0) {
                refundAmount += contributions[i].amount;
                contributions[i].amount = 0; // Verhindern, dass die gleiche Person mehrmals erstattet wird
            }
        }

        require(refundAmount > 0, "No contributions to refund.");

        payable(msg.sender).transfer(refundAmount);
    }
}
