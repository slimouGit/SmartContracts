const HelloWorld = artifacts.require("HelloWorld");

contract("HelloWorld", (accounts) => {
    let helloWorldInstance;
    const owner = accounts[0];
    const nonOwner = accounts[1];
    const allowedAddress = accounts[2];
    const notAllowedAddress = accounts[3];

    beforeEach(async () => {
        helloWorldInstance = await HelloWorld.new({ from: owner });
    });

    it("should set the owner correctly", async () => {
        const contractOwner = await helloWorldInstance.owner();
        assert.equal(contractOwner, owner, "Owner should be the deployer");
    });

    it("should add an address to allowedAddresses", async () => {
        await helloWorldInstance.addAddress(allowedAddress, { from: owner });
        const isAllowed = await helloWorldInstance.allowedAddresses(allowedAddress);
        assert.isTrue(isAllowed, "Address should be allowed");
    });

    it("should not allow non-owner to add an address", async () => {
        try {
            await helloWorldInstance.addAddress(allowedAddress, { from: nonOwner });
            assert.fail("Non-owner should not be able to add an address");
        } catch (error) {
            assert.include(error.message, "Only the owner can call this function", "Expected only owner error");
        }
    });

    it("should set greeting correctly", async () => {
        const newGreeting = "Hello, Blockchain!";
        await helloWorldInstance.setGreeting(newGreeting, { from: owner });
        const currentGreeting = await helloWorldInstance.getGreeting({ from: allowedAddress });
        assert.equal(currentGreeting, newGreeting, "Greeting should be updated");
    });

    it("should not allow non-owner to set greeting", async () => {
        try {
            await helloWorldInstance.setGreeting("Unauthorized Greeting", { from: nonOwner });
            assert.fail("Non-owner should not be able to set greeting");
        } catch (error) {
            assert.include(error.message, "Only the owner can call this function", "Expected only owner error");
        }
    });

    it("should allow allowed addresses to get greeting", async () => {
        await helloWorldInstance.addAddress(allowedAddress, { from: owner });
        const currentGreeting = await helloWorldInstance.getGreeting({ from: allowedAddress });
        assert.equal(currentGreeting, "Hello, World!", "Allowed address should be able to get the greeting");
    });

    it("should not allow non-allowed addresses to get greeting", async () => {
        try {
            await helloWorldInstance.getGreeting({ from: notAllowedAddress });
            assert.fail("Non-allowed address should not be able to get the greeting");
        } catch (error) {
            assert.include(error.message, "You are not allowed to call this function", "Expected not allowed error");
        }
    });

    it("should remove an address from allowedAddresses", async () => {
        await helloWorldInstance.addAddress(allowedAddress, { from: owner });
        await helloWorldInstance.removeAddress(allowedAddress, { from: owner });
        const isAllowed = await helloWorldInstance.allowedAddresses(allowedAddress);
        assert.isFalse(isAllowed, "Address should not be allowed anymore");
    });
});
