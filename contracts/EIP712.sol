// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract EIP712Verifier is EIP712 {
    bytes32 public MYSTRUCT_TYPEHASH =
        keccak256(
            "VaultApproval(address owner,address operator,uint256 value)"
        );

    constructor() EIP712("VaultProtocol", "v1") {}

    function verify(
        address owner,
        address operator,
        uint256 value,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns (bool) {
        bytes32 structHash = keccak256(
            abi.encode(MYSTRUCT_TYPEHASH, owner, operator, value)
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, v, r, s);
        return signer == owner;
    }
}
