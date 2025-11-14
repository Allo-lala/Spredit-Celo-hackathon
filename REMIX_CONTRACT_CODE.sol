// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ClaimableToken
 * @dev ERC20 token that allows users to claim 20 tokens once per wallet address
 */
contract ClaimableToken is ERC20 {
    // Mapping to track which addresses have already claimed
    mapping(address => bool) public hasClaimed;
    
    // Amount of tokens to claim (20 tokens with 18 decimals)
    uint256 public constant CLAIM_AMOUNT = 20 * 10**18;
    
    // Owner of the contract
    address public owner;
    
    // Events
    event TokensClaimed(address indexed user, uint256 amount);
    
    constructor() ERC20("Claimable Token", "CLAIM") {
        owner = msg.sender;
        // Mint initial supply to contract owner for distribution
        _mint(msg.sender, 1000000 * 10**18); // 1 million tokens
    }
    
    /**
     * @dev Allows users to claim 20 tokens once
     * @notice Users can only claim once per wallet address
     */
    function claimTokens() external {
        require(!hasClaimed[msg.sender], "Tokens already claimed for this address");
        
        hasClaimed[msg.sender] = true;
        _mint(msg.sender, CLAIM_AMOUNT);
        
        emit TokensClaimed(msg.sender, CLAIM_AMOUNT);
    }
    
    /**
     * @dev Check if an address has already claimed
     * @param _address The address to check
     * @return true if the address has claimed, false otherwise
     */
    function checkClaimStatus(address _address) external view returns (bool) {
        return hasClaimed[_address];
    }
}

