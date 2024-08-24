const HelloWorld = artifacts.require("HelloWorld");

contract("HelloWorld", (accounts) => {
    console.log("Contract block executed");  // Debugging-Output
    it("should deploy the contract", async () => {
        console.log("Test case executed");  // Debugging-Output
        const helloWorldInstance = await HelloWorld.deployed();
        assert(helloWorldInstance.address !== '');
    });
});