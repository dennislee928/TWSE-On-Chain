import { expect } from "chai";
import hre from "hardhat";
import type { TWSeDataAnchor } from "../typechain-types";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("TWSeDataAnchor", function () {
  let dataAnchor: TWSeDataAnchor;
  let owner: HardhatEthersSigner;
  let submitter: HardhatEthersSigner;
  let unauthorized: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, submitter, unauthorized] = await ethers.getSigners();

    const TWSeDataAnchor = await ethers.getContractFactory("TWSeDataAnchor");
    dataAnchor = await TWSeDataAnchor.deploy(owner.address);
    await dataAnchor.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct owner", async function () {
      expect(await dataAnchor.owner()).to.equal(owner.address);
    });

    it("Should authorize the owner as initial submitter", async function () {
      expect(await dataAnchor.authorizedSubmitters(owner.address)).to.be.true;
    });

    it("Should start with zero records", async function () {
      expect(await dataAnchor.getTotalRecords()).to.equal(0);
    });
  });

  describe("Authorization", function () {
    it("Should allow owner to authorize submitters", async function () {
      await dataAnchor.setAuthorizedSubmitter(submitter.address, true);
      expect(await dataAnchor.authorizedSubmitters(submitter.address)).to.be
        .true;
    });

    it("Should allow owner to unauthorize submitters", async function () {
      await dataAnchor.setAuthorizedSubmitter(submitter.address, true);
      await dataAnchor.setAuthorizedSubmitter(submitter.address, false);
      expect(await dataAnchor.authorizedSubmitters(submitter.address)).to.be
        .false;
    });

    it("Should not allow non-owner to authorize submitters", async function () {
      await expect(
        dataAnchor
          .connect(unauthorized)
          .setAuthorizedSubmitter(submitter.address, true)
      ).to.be.revertedWithCustomError(dataAnchor, "OwnableUnauthorizedAccount");
    });
  });

  describe("Data Anchoring", function () {
    const testCid = "QmTest123456789";
    const testDataType = "stock_basic";
    const testDataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));

    it("Should allow authorized submitter to anchor data", async function () {
      await expect(dataAnchor.anchorData(testCid, testDataType, testDataHash))
        .to.emit(dataAnchor, "DataAnchored")
        .withArgs(
          1,
          testDataType,
          testCid,
          owner.address,
          (await ethers.provider.getBlockNumber()) + 1
        );
    });

    it("Should increment record counter", async function () {
      await dataAnchor.anchorData(testCid, testDataType, testDataHash);
      expect(await dataAnchor.getTotalRecords()).to.equal(1);
    });

    it("Should store record data correctly", async function () {
      await dataAnchor.anchorData(testCid, testDataType, testDataHash);

      const record = await dataAnchor.getRecord(1);
      expect(record.ipfsCid).to.equal(testCid);
      expect(record.dataType).to.equal(testDataType);
      expect(record.submitter).to.equal(owner.address);
      expect(record.dataHash).to.equal(testDataHash);
    });

    it("Should not allow unauthorized submitter to anchor data", async function () {
      await expect(
        dataAnchor
          .connect(unauthorized)
          .anchorData(testCid, testDataType, testDataHash)
      ).to.be.revertedWith("Not authorized to submit data");
    });

    it("Should not allow empty IPFS CID", async function () {
      await expect(
        dataAnchor.anchorData("", testDataType, testDataHash)
      ).to.be.revertedWith("IPFS CID cannot be empty");
    });

    it("Should not allow empty data type", async function () {
      await expect(
        dataAnchor.anchorData(testCid, "", testDataHash)
      ).to.be.revertedWith("Data type cannot be empty");
    });
  });

  describe("Data Retrieval", function () {
    const testCid1 = "QmTest123456789";
    const testCid2 = "QmTest987654321";
    const testDataType = "stock_basic";
    const testDataHash = ethers.keccak256(ethers.toUtf8Bytes("test data"));

    beforeEach(async function () {
      await dataAnchor.anchorData(testCid1, testDataType, testDataHash);
      await dataAnchor.anchorData(testCid2, testDataType, testDataHash);
    });

    it("Should retrieve correct record by ID", async function () {
      const record = await dataAnchor.getRecord(1);
      expect(record.ipfsCid).to.equal(testCid1);
    });

    it("Should get latest record by type", async function () {
      const latestRecord = await dataAnchor.getLatestRecord(testDataType);
      expect(latestRecord.ipfsCid).to.equal(testCid2);
    });

    it("Should get record count by type", async function () {
      const count = await dataAnchor.getRecordCountByType(testDataType);
      expect(count).to.equal(2);
    });

    it("Should verify existing CID", async function () {
      const [exists, recordId] = await dataAnchor.verifyCid(testCid1);
      expect(exists).to.be.true;
      expect(recordId).to.equal(1);
    });

    it("Should not verify non-existing CID", async function () {
      const [exists, recordId] = await dataAnchor.verifyCid("QmNonExistent");
      expect(exists).to.be.false;
      expect(recordId).to.equal(0);
    });
  });
});
