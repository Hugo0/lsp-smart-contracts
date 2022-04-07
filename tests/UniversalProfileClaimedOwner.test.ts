import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  UniversalProfileClaimedOwner,
  UniversalProfileClaimedOwner__factory,
} from "../types";
import { INTERFACE_IDS } from "../constants";
import { isContext } from "vm";

describe("UniversalProfileClaimedOwner", () => {
  let owner: SignerWithAddress,
    nonOwner: SignerWithAddress,
    newOwner: SignerWithAddress;
  let accounts: SignerWithAddress[];
  let universalProfile: UniversalProfileClaimedOwner;

  beforeAll(async () => {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    nonOwner = accounts[1];
    newOwner = accounts[2];
  });

  describe("transferOwnership(...)", () => {
    beforeEach(async () => {
      universalProfile = await new UniversalProfileClaimedOwner__factory(
        accounts[0]
      ).deploy(owner.address);
    });
    it("owner should be allowed to transferOwnership(...)", async () => {
      await universalProfile.connect(owner).transferOwnership(newOwner.address);
    });

    it("non-owner should not be allowed to transferOwnership(...)", async () => {
      await expect(
        universalProfile.connect(newOwner).transferOwnership(newOwner.address)
      ).toBeRevertedWith("Ownable: caller is not the owner");
    });
  });

  describe("ownership transfer process", () => {
    beforeEach(async () => {
      universalProfile = await new UniversalProfileClaimedOwner__factory(
        accounts[0]
      ).deploy(owner.address);
    });

    describe("before ownership transfer", () => {
      it("nobody should be allowed to claim ownership", async () => {
        await universalProfile
          .connect(owner)
          .transferOwnership(newOwner.address);

        const randomEOA = accounts[8];

        await expect(
          universalProfile.connect(randomEOA).claimOwnership()
        ).toBeRevertedWith("not allowed to claim ownership");
      });
    });

    describe("when transfering ownership", () => {
      it("should revert if transferring ownership to address zero", async () => {
        await expect(universalProfile.connect(owner));
      });
    });

    // before starting a ownership transfer process, nobody should be allowed to claimOwnership()
    // how about if at the very beginning, it is the address zero?

    // also test that it still not possible to start a ownership transfer process with the
    // address zero, and that the ownership process should remain unstarted (= false)
    it("should start a ownership transfer process", async () => {
      let processBefore = await universalProfile.ownershipTransfer();
      expect(processBefore).toBeFalsy();

      await universalProfile.connect(owner).transferOwnership(newOwner.address);

      let processAfter = await universalProfile.ownershipTransfer();
      expect(processAfter).toBeTruthy();
    });

    it("should not be allowed to start a ownership process if one is ongoing", async () => {
      await universalProfile.connect(owner).transferOwnership(newOwner.address);

      await expect(
        universalProfile.connect(owner).transferOwnership(newOwner.address)
      ).toBeRevertedWith("ownership transfer currently ongoing");
    });

    it("owner should remain the same if the newOwner has not claimed it", async () => {
      await universalProfile.connect(owner).transferOwnership(newOwner.address);

      const contractOwner = await universalProfile.owner();
      expect(contractOwner).toEqual(owner.address);
    });

    it("should have set the upcoming new owner correctly", async () => {
      await universalProfile.connect(owner).transferOwnership(newOwner.address);

      let upcomingNewOwner = await universalProfile.upcomingNewOwner();
      expect(upcomingNewOwner).toEqual(newOwner.address);
    });

    describe("during ownership transfer process", () => {
      it("new owner should not be allowed to interact with the contract before claiming ownership", async () => {
        await universalProfile
          .connect(owner)
          .transferOwnership(newOwner.address);

        // try setting some data as an example
        let key =
          "0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe";
        let value = "0xbeefbeef";

        await expect(
          universalProfile
            .connect(newOwner)
            ["setData(bytes32,bytes)"](key, value)
        ).toBeRevertedWith("Ownable: caller is not the owner");
      });

      it("previous owner should still be allowed to interact with the UP if newOwner has not claimed it", async () => {
        await universalProfile
          .connect(owner)
          .transferOwnership(newOwner.address);

        let key =
          "0xcafecafecafecafecafecafecafecafecafecafecafecafecafecafecafecafe";
        let value = "0xbeefbeef";

        await universalProfile
          .connect(owner)
          ["setData(bytes32,bytes)"](key, value);

        let result = await universalProfile["getData(bytes32)"](key);
        expect(result).toEqual(value);
      });
    });

    describe("claimOwnership(...)", () => {
      it("random account should not be allowed to claim ownership", async () => {
        await universalProfile
          .connect(owner)
          .transferOwnership(newOwner.address);

        const randomEOA = accounts[8];

        await expect(
          universalProfile.connect(randomEOA).claimOwnership()
        ).toBeRevertedWith("not allowed to claim ownership");
      });
    });

    // it("new owner should not be able to interact with the contract until it claims it", async () => {});
  });
});
