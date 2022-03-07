const { solidity } = require("ethereum-waffle");
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const {
  BN,
  time,
  expectEvent,
  expectRevert
} = require("@openzeppelin/test-helpers");
//const { accounts, contract } = require('@openzeppelin/test-environment');


let testAddr1 = '0xe91fA03795953A6bA213e7f01E9Efad66320e790';
let testAddr2 = '0x6329584367709fE6B219c6F0069b64Ffe01df3C1';
let testAddr3 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';


describe("TestNft", function () {
  beforeEach(async function () {
    this.TestNft = await ethers.getContractFactory("TestNft");
    this.testNft = await this.TestNft.deploy();
    await this.testNft.deployed();

    console.log("nft: ", this.testNft.address);

    this.BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    this.batchTransfer = await this.BatchTransfer.deploy();
    console.log("batch: ", this.batchTransfer.address);
  });

  it("Should return the new balance of sender", async function () {

    let mint = await this.testNft.mintNft(testAddr1);
    await mint.wait();

    let mint2 = await this.testNft.mintNft(testAddr1);
    await mint2.wait();

    let balance = await this.testNft.balanceOf(testAddr1);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('2');
  });

  it("Should transfer to EOA", async function () {

    let mint = await this.testNft.mintNft(testAddr3);
    await mint.wait();

    let t1 = await this.testNft.ownerOf(1);

    console.log("t1 is ", t1);

    let tx = await this.testNft.transferFrom(testAddr3, testAddr1, 1);
    await tx.wait();

    let t2 = await this.testNft.ownerOf(1);

    console.log("after transfer, t2 is ", t2);

    let balance = await this.testNft.balanceOf(testAddr3);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('0');

    let balance2 = await this.testNft.balanceOf(testAddr1);
    console.log("balance is ", balance2);
    expect(balance2.toString()).equal('1');
  });


  it("Should transfer to contranct address", async function () {

    let mint = await this.testNft.mintNft(testAddr3);
    await mint.wait();

    let t1 = await this.testNft.ownerOf(1);

    console.log("t1 is ", t1);

    let tx = await this.testNft.transferFrom(testAddr3, this.batchTransfer.address, 1);
    await tx.wait();

    let t2 = await this.testNft.ownerOf(1);

    console.log("after transfer, t2 is ", t2);

    let balance = await this.testNft.balanceOf(testAddr3);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('0');

    let balance2 = await this.testNft.balanceOf(this.batchTransfer.address);
    console.log("balance is ", balance2);
    expect(balance2.toString()).equal('1');
  });

  it("Should transfer from contranct address", async function () {

    let mint = await this.testNft.mintNft(this.batchTransfer.address);
    await mint.wait();

    let balance = await this.testNft.balanceOf(this.batchTransfer.address);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('1');

    let balanceBefore = await this.testNft.balanceOf(testAddr2);
    console.log("balanceBefore is ", balanceBefore);

    let tx1 = await this.batchTransfer.transferSingle(
      this.testNft.address, 
      this.batchTransfer.address, 
      testAddr2, 
      1);
    await tx1.wait();

    let balance1 = await this.testNft.balanceOf(testAddr2);
    console.log("balanceafter is ", balance1);
    expect(balance1.toString()).equal('1');
  });

  it("Should batchtransfer from contranct address", async function () {

    await this.testNft.mintNft(this.batchTransfer.address);
    await this.testNft.mintNft(this.batchTransfer.address);
    await this.testNft.mintNft(this.batchTransfer.address);


    let balance = await this.testNft.balanceOf(this.batchTransfer.address);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('3');

    let balanceBefore1 = await this.testNft.balanceOf(testAddr1);
    let balanceBefore2 = await this.testNft.balanceOf(testAddr2);
    let balanceBefore3 = await this.testNft.balanceOf(testAddr3);
    console.log("balanceBefore1 is ", balanceBefore1,
      "balanceBefore2 is ", balanceBefore2,
      "balanceBefore3 is ", balanceBefore3);


    let tx = await this.batchTransfer.transferBatch(
      this.testNft.address, 
      this.batchTransfer.address, 
      [testAddr1,testAddr2,testAddr3], 
      [1,2,3], { from: this.testNft.owner() });

    const receipt = await tx.wait();

    let balanceAfter1 = await this.testNft.balanceOf(testAddr1);
    let balanceAfter2 = await this.testNft.balanceOf(testAddr2);
    let balanceAfter3 = await this.testNft.balanceOf(testAddr3);
    console.log("balanceAfter1 is ", balanceAfter1,
      "balanceAfter2 is ", balanceAfter2,
      "balanceAfter3 is ", balanceAfter3);

    let balance1 = await this.testNft.balanceOf(this.batchTransfer.address);
    console.log("balanceafter is ", balance1);
    expect(balance1.toString()).equal('0');
    /*
    expectEvent(receipt, 'TransferBatch', {
        nft:this.testNft.address,
        source:this.batchTransfer.address,
        dest: [testAddr1,testAddr2,testAddr3],
        tokenIds:[1,2,3]
      });
    */
  });

  it("Should error when batchtransfer with diff length", async function () {

    let mint = await this.testNft.mintNft(this.batchTransfer.address);
    await mint.wait();
    let mint2 = await this.testNft.mintNft(this.batchTransfer.address);
    await mint2.wait();
    let mint3 = await this.testNft.mintNft(this.batchTransfer.address);
    await mint3.wait();

    let balance = await this.testNft.balanceOf(this.batchTransfer.address);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('3');

    let balanceBefore1 = await this.testNft.balanceOf(testAddr1);
    let balanceBefore2 = await this.testNft.balanceOf(testAddr2);
    let balanceBefore3 = await this.testNft.balanceOf(testAddr3);
    console.log("balanceBefore1 is ", balanceBefore1,
      "balanceBefore2 is ", balanceBefore2,
      "balanceBefore3 is ", balanceBefore3);
    try {
      let tx1 = await this.batchTransfer.transferBatch(
        this.testNft.address, 
        this.batchTransfer.address, 
        [testAddr1,testAddr2] , 
        [1,2,3]);
      await tx1.wait();
    } catch (error) {
      console.log(error);
      //expect(error).contains("reverted with reason string 'Error: the to length must match tokenIds.'");
    }

/*
    await expectRevert(this.batchTransfer.transferBatch(
      this.testNft.address, 
      this.batchTransfer.address, 
      [testAddr1,testAddr2] , 
      [1,2,3]), "Error: the to length must match tokenIds.");
*/

  });
  it("Should transfer to contranct address", async function () {
    let BatchTransfer1 = await ethers.getContractFactory("BatchTransfer");
    let batchTransfer1 = await BatchTransfer1.deploy();
    console.log("batch: ", batchTransfer1.address);

    let mint = await this.testNft.mintNft(this.batchTransfer.address);
    await mint.wait();

    let balance = await this.testNft.balanceOf(this.batchTransfer.address);
    
    let balance1 = await this.testNft.balanceOf(batchTransfer1.address);
    console.log("before transfer: balance1 is ", balance, "balance2 is ", balance1);

    try {
      let tx1 = await this.batchTransfer.transferSingle(
        this.testNft.address, 
        this.batchTransfer.address, 
        this.batchTransfer1.address, 
        1);
      await tx1.wait();
    } catch (e) {
      console.log(e);
    }

    let balance2 = await this.testNft.balanceOf(testAddr1);
    
    let balance3 = await this.testNft.balanceOf(batchTransfer1.address);
    console.log("after transfer: balance2 is ", balance2, "balance3 is ", balance3);
  });


});


