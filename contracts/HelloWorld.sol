// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string private greeting;
    address public owner;
    mapping(address => bool) public allowedAddresses;

    constructor() {
        greeting = "Hello, World!";
        owner = msg.sender; // Der Ersteller des Contracts wird als Besitzer festgelegt
    }

    // Modifier, um sicherzustellen, dass nur der Besitzer eine Funktion ausführen kann
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    // Modifier, um sicherzustellen, dass nur zugelassene Adressen eine Funktion ausführen können
    modifier onlyAllowed() {
        require(allowedAddresses[msg.sender], "You are not allowed to call this function");
        _;
    }

    // Funktion, um eine Adresse zur Liste der zugelassenen Adressen hinzuzufügen
    function addAddress(address _address) public onlyOwner {
        allowedAddresses[_address] = true;
    }

    // Funktion, um eine Adresse von der Liste der zugelassenen Adressen zu entfernen
    function removeAddress(address _address) public onlyOwner {
        allowedAddresses[_address] = false;
    }

    // Funktion zum Setzen des Begrüßungstexts
    function setGreeting(string memory _greeting) public onlyOwner {
        greeting = _greeting;
    }

    // Funktion zum Abrufen des Begrüßungstexts, nur für zugelassene Adressen
    function getGreeting() public view onlyAllowed returns (string memory) {
        return greeting;
    }
}
