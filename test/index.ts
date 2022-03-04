const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
const {
  BN,
  time,
  expectEvent,
  expectRevert
} = require("@openzeppelin/test-helpers");

var TestNft
var testNft
var BatchTransfer
var batchTransfer

let testAddr1 = '0xe91fA03795953A6bA213e7f01E9Efad66320e790';
let testAddr2 = '0x6329584367709fE6B219c6F0069b64Ffe01df3C1';
let testAddr3 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';


describe("TestNft", function () {
  /*
  beforeEach(async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);
  });
  */

  it("Should return the new balance of sender", async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);

    let mint = await testNft.mintNft(testAddr1);
    await mint.wait();

    let mint2 = await testNft.mintNft(testAddr1);
    await mint2.wait();

    let balance = await testNft.balanceOf(testAddr1);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('2');
  });

  it("Should transfer to EOA", async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);

    let mint = await testNft.mintNft(testAddr3);
    await mint.wait();

    let t1 = await testNft.ownerOf(1);

    console.log("t1 is ", t1);

    let tx = await testNft.transferFrom(testAddr3, testAddr1, 1);
    await tx.wait();

    let t2 = await testNft.ownerOf(1);

    console.log("after transfer, t2 is ", t2);

    let balance = await testNft.balanceOf(testAddr3);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('0');

    let balance2 = await testNft.balanceOf(testAddr1);
    console.log("balance is ", balance2);
    expect(balance2.toString()).equal('1');
  });


  it("Should transfer to contranct address", async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);

    let mint = await testNft.mintNft(testAddr3);
    await mint.wait();

    let t1 = await testNft.ownerOf(1);

    console.log("t1 is ", t1);

    let tx = await testNft.transferFrom(testAddr3, batchTransfer.address, 1);
    await tx.wait();

    let t2 = await testNft.ownerOf(1);

    console.log("after transfer, t2 is ", t2);

    let balance = await testNft.balanceOf(testAddr3);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('0');

    let balance2 = await testNft.balanceOf(batchTransfer.address);
    console.log("balance is ", balance2);
    expect(balance2.toString()).equal('1');
  });

  it("Should transfer from contranct address", async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);

    let mint = await testNft.mintNft(batchTransfer.address);
    await mint.wait();

    let balance = await testNft.balanceOf(batchTransfer.address);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('1');

    let balanceBefore = await testNft.balanceOf(testAddr2);
    console.log("balanceBefore is ", balanceBefore);

    let tx1 = await batchTransfer.transferSingle(
        testNft.address, 
        batchTransfer.address, 
        testAddr2, 
        1);
    await tx1.wait();

    let balance1 = await testNft.balanceOf(testAddr2);
    console.log("balanceafter is ", balance1);
    expect(balance1.toString()).equal('1');
  });

  it("Should batchtransfer from contranct address", async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);

    let mint = await testNft.mintNft(batchTransfer.address);
    await mint.wait();
    let mint2 = await testNft.mintNft(batchTransfer.address);
    await mint2.wait();
    let mint3 = await testNft.mintNft(batchTransfer.address);
    await mint3.wait();

    let balance = await testNft.balanceOf(batchTransfer.address);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('3');

    let balanceBefore1 = await testNft.balanceOf(testAddr1);
    let balanceBefore2 = await testNft.balanceOf(testAddr2);
    let balanceBefore3 = await testNft.balanceOf(testAddr3);
    console.log("balanceBefore1 is ", balanceBefore1,
      "balanceBefore2 is ", balanceBefore2,
      "balanceBefore3 is ", balanceBefore3);

    let tx1 = await batchTransfer.transferBatch(
        testNft.address, 
        batchTransfer.address, 
        [testAddr1,testAddr2,testAddr3] , 
        [1,2,3]);
    await tx1.wait();

    let balanceAfter1 = await testNft.balanceOf(testAddr1);
    let balanceAfter2 = await testNft.balanceOf(testAddr2);
    let balanceAfter3 = await testNft.balanceOf(testAddr3);
    console.log("balanceAfter1 is ", balanceAfter1,
      "balanceAfter2 is ", balanceAfter2,
      "balanceAfter3 is ", balanceAfter3);


    let balance1 = await testNft.balanceOf(batchTransfer.address);
    console.log("balanceafter is ", balance1);
    expect(balance1.toString()).equal('0');
  });

  it("Should error when batchtransfer with diff length", async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);

    let mint = await testNft.mintNft(batchTransfer.address);
    await mint.wait();
    let mint2 = await testNft.mintNft(batchTransfer.address);
    await mint2.wait();
    let mint3 = await testNft.mintNft(batchTransfer.address);
    await mint3.wait();

    let balance = await testNft.balanceOf(batchTransfer.address);
    console.log("balance is ", balance);
    expect(balance.toString()).equal('3');

    let balanceBefore1 = await testNft.balanceOf(testAddr1);
    let balanceBefore2 = await testNft.balanceOf(testAddr2);
    let balanceBefore3 = await testNft.balanceOf(testAddr3);
    console.log("balanceBefore1 is ", balanceBefore1,
      "balanceBefore2 is ", balanceBefore2,
      "balanceBefore3 is ", balanceBefore3);
    try {
      let tx1 = await batchTransfer.transferBatch(
          testNft.address, 
          batchTransfer.address, 
          [testAddr1,testAddr2] , 
          [1,2,3]);
      await tx1.wait();
    } catch (error) {
      console.log(error);
      //expect(error).contains("reverted with reason string 'Error: the to length must match tokenIds.'");
    }

    /*
    await expectRevert(batchTransfer.transferBatch(
      testNft.address, 
      batchTransfer.address, 
      [testAddr1,testAddr2] , 
      [1,2,3]), "Error: the to length must match tokenIds.");
      */

  });

  it("Should transfer to contranct address", async function () {
    TestNft = await ethers.getContractFactory("TestNft");
    testNft = await TestNft.deploy();
    await testNft.deployed();

    console.log("nft: ", testNft.address);

    BatchTransfer = await ethers.getContractFactory("BatchTransfer");
    batchTransfer = await BatchTransfer.deploy();
    console.log("batch: ", batchTransfer.address);

    let BatchTransfer1 = await ethers.getContractFactory("BatchTransfer");
    let batchTransfer1 = await BatchTransfer1.deploy();
    console.log("batch: ", batchTransfer1.address);

    let mint = await testNft.mintNft(batchTransfer.address);
    await mint.wait();

    let balance = await testNft.balanceOf(batchTransfer.address);
    
    let balance1 = await testNft.balanceOf(batchTransfer1.address);
    console.log("before transfer: balance1 is ", balance, "balance2 is ", balance1);

    try {
      let tx1 = await batchTransfer.transferSingle(
          testNft.address, 
          batchTransfer.address, 
          batchTransfer1.address, 
          1);
      await tx1.wait();
    } catch (e) {
      console.log(e);
    }

    let balance2 = await testNft.balanceOf(testAddr1);
    
    let balance3 = await testNft.balanceOf(batchTransfer1.address);
    console.log("after transfer: balance2 is ", balance2, "balance3 is ", balance3);
  });

});


