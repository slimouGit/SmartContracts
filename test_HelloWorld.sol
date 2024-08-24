// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Assert.sol content goes here
import "HelloWorld.sol";

contract HelloWorldTest {
    HelloWorld helloWorld;

    function beforeEach() public {
        helloWorld = new HelloWorld();
    }

    function testInitialGreeting() public view {
        string memory expected = "Hello, World!";
        string memory actual = helloWorld.getGreeting();
        bytes32 expectedHash = keccak256(bytes(expected));
        bytes32 actualHash = keccak256(bytes(actual));
        assert(actualHash == expectedHash);
    }

    function testSetGreeting() public {
        string memory newGreeting = "Hello, GitHub Copilot!";
        helloWorld.setGreeting(newGreeting);
        string memory expected = newGreeting;
        string memory actual = helloWorld.getGreeting();
        bytes32 expectedHash = keccak256(bytes(expected));
        bytes32 actualHash = keccak256(bytes(actual));
        assert(actualHash == expectedHash);
    }

    // function testOnlyOwnerCanSetGreeting() public {
    //     address nonOwner = address(0x123);
    //     string memory newGreeting = "Hello, GitHub Copilot!";
    //     (bool success, ) = address(helloWorld).call(abi.encodeWithSignature("setGreeting(string)", newGreeting));
    //     assert(!success);
    // }

    // function testOnlyAllowedCanGetGreeting() public {
    //     address nonAllowed = address(0x123);
    //     string memory expected = "Hello, World!";
    //     string memory actual = HelloWorld(nonAllowed).getGreeting();
    //     bytes32 expectedHash = keccak256(bytes(expected));
    //     bytes32 actualHash = keccak256(bytes(actual));
    //     assert(actualHash == expectedHash);
    // }
}