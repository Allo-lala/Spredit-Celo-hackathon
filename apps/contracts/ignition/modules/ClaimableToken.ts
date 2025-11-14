// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimableTokenModule = buildModule("ClaimableTokenModule", (m) => {
  const claimableToken = m.contract("ClaimableToken", []);

  return { claimableToken };
});

export default ClaimableTokenModule;

