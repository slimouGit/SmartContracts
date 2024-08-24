const Crowdfunding = artifacts.require("Crowdfunding");

contract("Crowdfunding", (accounts) => {
    let crowdfundingInstance;
    const [owner, contributor1, contributor2, nonOwner] = accounts;

    const goal = web3.utils.toWei('10', 'ether'); // 10 ETH Ziel
    const duration = 10; // 10 Minuten

    beforeEach(async () => {
        crowdfundingInstance = await Crowdfunding.new(goal, duration, { from: owner });
    });

    it("should set the correct owner", async () => {
        const contractOwner = await crowdfundingInstance.owner();
        assert.equal(contractOwner, owner, "Owner should be the contract deployer");
    });

    it("should allow contributions before the deadline", async () => {
        const contributionAmount = web3.utils.toWei('1', 'ether'); // 1 ETH
        await crowdfundingInstance.contribute({ from: contributor1, value: contributionAmount });

        const totalFunds = await crowdfundingInstance.totalFunds();
        assert.equal(totalFunds.toString(), contributionAmount, "Total funds should match the contribution");
    });

    it("should not allow contributions after the deadline", async () => {
        const contributionAmount = web3.utils.toWei('1', 'ether'); // 1 ETH

        // Simulate passage of time by increasing the blockchain time
        await time.increase(duration * 60 + 1);

        try {
            await crowdfundingInstance.contribute({ from: contributor1, value: contributionAmount });
            assert.fail("Contribution should not be allowed after the deadline");
        } catch (error) {
            assert.include(error.message, "The crowdfunding campaign is over.", "Expected deadline error");
        }
    });

    it("should allow the owner to withdraw funds if the goal is reached", async () => {
        const contributionAmount = web3.utils.toWei('10', 'ether'); // 10 ETH
        await crowdfundingInstance.contribute({ from: contributor1, value: contributionAmount });

        const goalReached = await crowdfundingInstance.goalReached();
        assert.isTrue(goalReached, "Goal should be reached");

        const initialBalance = web3.utils.toBN(await web3.eth.getBalance(owner));
        await crowdfundingInstance.withdrawFunds({ from: owner });

        const newBalance = web3.utils.toBN(await web3.eth.getBalance(owner));
        assert.isTrue(newBalance.gt(initialBalance), "Owner's balance should increase after withdrawal");
    });

    it("should not allow non-owners to withdraw funds", async () => {
        const contributionAmount = web3.utils.toWei('10', 'ether'); // 10 ETH
        await crowdfundingInstance.contribute({ from: contributor1, value: contributionAmount });

        try {
            await crowdfundingInstance.withdrawFunds({ from: nonOwner });
            assert.fail("Non-owner should not be able to withdraw funds");
        } catch (error) {
            assert.include(error.message, "Only the project owner can withdraw the funds.", "Expected owner-only error");
        }
    });

    it("should allow refunds if the goal is not reached and the deadline has passed", async () => {
        const contributionAmount = web3.utils.toWei('5', 'ether'); // 5 ETH
        await crowdfundingInstance.contribute({ from: contributor1, value: contributionAmount });

        // Simulate passage of time by increasing the blockchain time
        await time.increase(duration * 60 + 1);

        await crowdfundingInstance.refund({ from: contributor1 });

        const totalFunds = await crowdfundingInstance.totalFunds();
        assert.equal(totalFunds.toString(), '0', "Total funds should be zero after refunds");

        const contribution = await crowdfundingInstance.contributions(0);
        assert.equal(contribution.amount.toString(), '0', "Contribution amount should be reset to zero");
    });

    it("should not allow refunds if the goal is reached", async () => {
        const contributionAmount = web3.utils.toWei('10', 'ether'); // 10 ETH
        await crowdfundingInstance.contribute({ from: contributor1, value: contributionAmount });

        const goalReached = await crowdfundingInstance.goalReached();
        assert.isTrue(goalReached, "Goal should be reached");

        try {
            await crowdfundingInstance.refund({ from: contributor1 });
            assert.fail("Refund should not be allowed if goal is reached");
        } catch (error) {
            assert.include(error.message, "Goal has been reached, no refunds available.", "Expected no refund error");
        }
    });
});
