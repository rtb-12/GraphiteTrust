// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


/**
 * @title ReputationRegistry
 * @dev A comprehensive on-chain reputation registry for managing wallet/DAO reputation scores
 */
contract ReputationRegistry is AccessControl, Pausable, ReentrancyGuard {
    // Role definitions
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ATTESTER_ROLE = keccak256("ATTESTER_ROLE");

    // Structs
    struct ReputationScore {
        uint256 kycLevel;           // 0-5, where 5 is highest
        uint256 complianceScore;    // 0-100
        uint256 trustScore;         // 0-100
        uint256 lastUpdate;         // Timestamp
        bool isActive;              // Account status
        uint256 totalAttestations;  // Number of positive attestations
        uint256 totalAttestors;     // Number of unique attestors
    }

    struct Attestation {
        address attester;
        uint256 score;
        string reason;
        uint256 timestamp;
        bool isValid;
    }

    struct ReputationHistory {
        uint256 timestamp;
        uint256 kycLevel;
        uint256 complianceScore;
        uint256 trustScore;
        string reason;
    }

    // State variables
    mapping(address => ReputationScore) public reputationScores;
    mapping(address => mapping(address => Attestation)) public attestations;
    mapping(address => ReputationHistory[]) public reputationHistory;
    mapping(address => uint256) public reputationWeights;
    mapping(address => Attestation[]) public attestationHistory;
    
    
    // Constants
    uint256 public constant MAX_KYC_LEVEL = 5;
    uint256 public constant MAX_SCORE = 100;
    uint256 public constant MIN_ATTESTATION_SCORE = 1;
    uint256 public constant MAX_ATTESTATION_SCORE = 10;
    
    // Events
    event ReputationUpdated(
        address indexed account,
        uint256 kycLevel,
        uint256 complianceScore,
        uint256 trustScore,
        string reason
    );
    
    event AttestationAdded(
        address indexed attester,
        address indexed subject,
        uint256 score,
        string reason
    );
    
    event AttestationRevoked(
        address indexed attester,
        address indexed subject
    );
    
    event EmergencyPaused(address indexed by);
    event EmergencyUnpaused(address indexed by);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);
    }

    /**
     * @dev Updates reputation scores for an account
     * @param account Address to update
     * @param kycLevel New KYC level (0-5)
     * @param complianceScore New compliance score (0-100)
     * @param trustScore New trust score (0-100)
     * @param reason Reason for update
     */
    function updateReputation(
        address account,
        uint256 kycLevel,
        uint256 complianceScore,
        uint256 trustScore,
        string memory reason
    ) external onlyRole(ORACLE_ROLE) whenNotPaused nonReentrant {
        require(kycLevel <= MAX_KYC_LEVEL, "Invalid KYC level");
        require(complianceScore <= MAX_SCORE, "Invalid compliance score");
        require(trustScore <= MAX_SCORE, "Invalid trust score");
        
        // Store current scores in history
        reputationHistory[account].push(ReputationHistory({
            timestamp: block.timestamp,
            kycLevel: reputationScores[account].kycLevel,
            complianceScore: reputationScores[account].complianceScore,
            trustScore: reputationScores[account].trustScore,
            reason: reason
        }));
        
        // Update scores
        reputationScores[account] = ReputationScore({
            kycLevel: kycLevel,
            complianceScore: complianceScore,
            trustScore: trustScore,
            lastUpdate: block.timestamp,
            isActive: true,
            totalAttestations: reputationScores[account].totalAttestations,
            totalAttestors: reputationScores[account].totalAttestors
        });
        
        emit ReputationUpdated(account, kycLevel, complianceScore, trustScore, reason);
    }

    /**
     * @dev Adds an attestation for an account
     * @param subject Address being attested
     * @param score Attestation score (1-10)
     * @param reason Reason for attestation
     */
    function addAttestation(
        address subject,
        uint256 score,
        string memory reason
    ) external onlyRole(ATTESTER_ROLE) whenNotPaused nonReentrant {
        require(score >= MIN_ATTESTATION_SCORE && score <= MAX_ATTESTATION_SCORE, "Invalid score");
        require(!attestations[msg.sender][subject].isValid, "Already attested");
        
        attestations[msg.sender][subject] = Attestation({
            attester: msg.sender,
            score: score,
            reason: reason,
            timestamp: block.timestamp,
            isValid: true
        });
        
        reputationScores[subject].totalAttestations += score;
        reputationScores[subject].totalAttestors += 1;
        
        attestationHistory[subject].push(
            Attestation({
                attester: msg.sender,
                score: score,
                reason: reason,
                timestamp: block.timestamp,
                isValid: true
            })
        );
        
        emit AttestationAdded(msg.sender, subject, score, reason);
    }

    /**
     * @dev Revokes an attestation
     * @param subject Address whose attestation is being revoked
     */
    function revokeAttestation(
        address subject
    ) external onlyRole(ATTESTER_ROLE) whenNotPaused nonReentrant {
        require(attestations[msg.sender][subject].isValid, "No valid attestation");
        
        uint256 score = attestations[msg.sender][subject].score;
        reputationScores[subject].totalAttestations -= score;
        reputationScores[subject].totalAttestors -= 1;
        
        // Find and mark the latest valid attestation from this attester as invalid
        Attestation[] storage history = attestationHistory[subject];
        for (uint256 i = history.length; i > 0; i--) {
            if (history[i-1].attester == msg.sender && history[i-1].isValid) {
                history[i-1].isValid = false;
                break;
            }
        }
        
        emit AttestationRevoked(msg.sender, subject);
    }

    /**
     * @dev Gets the weighted reputation score for an account
     * @param account Address to check
     * @return Weighted score (0-100)
     */
    function getWeightedScore(address account) external view returns (uint256) {
        ReputationScore memory score = reputationScores[account];
        if (!score.isActive) return 0;
        
        uint256 weightedScore = (
            (score.kycLevel * 20) + // KYC worth 20%
            (score.complianceScore * 40) + // Compliance worth 40%
            (score.trustScore * 40) // Trust worth 40%
        ) / 100;
        
        return weightedScore;
    }

    /**
     * @dev Gets the attestation history for an account
     * @param account Address to check
     * @return Array of attestation scores
     */
    function getAttestationHistory(address account) external view returns (Attestation[] memory) {
        return attestationHistory[account];
    }

    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyRole(ADMIN_ROLE) {
        _pause();
        emit EmergencyPaused(msg.sender);
    }

    /**
     * @dev Emergency unpause function
     */
    function emergencyUnpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
        emit EmergencyUnpaused(msg.sender);
    }

    /**
     * @dev Deactivates an account's reputation
     * @param account Address to deactivate
     */
    function deactivateAccount(address account) external onlyRole(ADMIN_ROLE) whenNotPaused {
        reputationScores[account].isActive = false;
        emit ReputationUpdated(
            account,
            reputationScores[account].kycLevel,
            reputationScores[account].complianceScore,
            reputationScores[account].trustScore,
            "Account deactivated"
        );
    }

    /**
     * @dev Updates reputation weights
     * @param kycWeight Weight for KYC score (0-100)
     * @param complianceWeight Weight for compliance score (0-100)
     * @param trustWeight Weight for trust score (0-100)
     */
    function updateWeights(
        uint256 kycWeight,
        uint256 complianceWeight,
        uint256 trustWeight
    ) external onlyRole(ADMIN_ROLE) whenNotPaused {
        require(kycWeight + complianceWeight + trustWeight == 100, "Weights must sum to 100");
        reputationWeights[msg.sender] = kycWeight;
    }
} 