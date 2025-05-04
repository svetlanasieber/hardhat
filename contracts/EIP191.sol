// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract EIP191 {
    function verifySignature(
        string calldata message,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public pure returns (address) {
        bytes32 rawMessageHash = keccak256(bytes(message));
        
        bytes32 messageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", rawMessageHash)
        );
    
        address signer = ecrecover(messageHash, v, r, s);
        require(signer != address(0), "Invalid signature");
        return signer;
    }
}
