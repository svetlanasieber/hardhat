const { hashMessage } = require("ethers");

task("sign", "").setAction(async (taskArgs, { ethers }) => {
  const [signer] = await ethers.getSigners();

  const message = "Hello, EIP191 0x45";
  // Sign the message
  const hashBytes = ethers.getBytes(
    ethers.keccak256(ethers.toUtf8Bytes(message))
  );

  const signature = await signer.signMessage(hashBytes);
  // Get the message hash

  const sig = ethers.Signature.from(signature);
  const contractFactory = await ethers.getContractFactory("EIP191");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();

  const result = await contract.verifySignature(message, sig.v, sig.r, sig.s);

  console.log("Signer: ", signer.address);
  console.log("Recovered signer: ", result);

  const messageHash = ethers.hashMessage(hashBytes);

  const recoveredAddress = ethers.recoverAddress(messageHash, signature);
  console.log(
    "Signatures match:",
    signer.address.toLowerCase() === recoveredAddress.toLowerCase()
  );
});

task("sign712", "").setAction(async (taskArgs, { ethers }) => {
  const [signer] = await ethers.getSigners();

  const contractFactory = await ethers.getContractFactory("EIP712Verifier");
  const contract = await contractFactory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const operator = "0xC4973de5eE925b8219f1E74559FB217A8e355EcF";
  const value = ethers.parseEther("0.5");

  const domain = {
    name: "VaultProtocol",
    version: "v1",
    chainId: 31337,
    verifyingContract: contractAddress,
  };

  const types = {
    VaultApproval: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
      { name: "value", type: "uint256" },
    ],
  };

  const messageValue = { owner: signer.address, operator, value };

  const signature = await signer.signTypedData(domain, types, messageValue);
  const sig = ethers.Signature.from(signature);
  const isValid = await contract.verify(
    signer.address,
    operator,
    value,
    sig.v,
    sig.r,
    sig.s
  );

  console.log(isValid);
});
