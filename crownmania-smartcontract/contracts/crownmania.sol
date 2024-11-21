// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";

contract Crownmania is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    uint256 public royaltyPercentage;
    address payable public royaltyRecipient;
    string public brandDescription;
    uint256 public collectibleCount;

    enum SpecialEditionType { Standard, Gold, Silver, Pink, Purple }
    struct Collection {
        string name;
        string description;
        uint256 totalCollectibles;
        mapping(SpecialEditionType => uint256) specialEditionCounts;
        bool exists;
    }
    struct CollectibleMetadata {
        string name;
        string description;
        string mediaLink;
        SpecialEditionType editionType;
    }

    mapping(uint256 => Collection) public collections;
    mapping(uint256 => CollectibleMetadata) public collectibleMetadata;
    mapping(uint256 => uint256) public collectibleToCollection;
    mapping(uint256 => uint256) public listingPrices;
    mapping(uint256 => bool) public stakedTokens;
    uint256 public collectionCount;

    event CollectibleStaked(address indexed user, uint256 tokenId);
    event CollectibleUnstaked(address indexed user, uint256 tokenId);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(
        string memory _description,
        uint256 _royaltyPercentage,
        address payable _royaltyRecipient
    ) public initializer {
        __ERC721_init("Crownmania Collectibles", "CRWN");
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __Ownable_init();
        __Pausable_init();
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MANAGER_ROLE, msg.sender);

        brandDescription = _description;
        royaltyPercentage = _royaltyPercentage;
        royaltyRecipient = _royaltyRecipient;
    }

    // Royalty functions
    function setRoyalty(uint256 _royaltyPercentage, address payable _recipient) public onlyOwner {
        royaltyPercentage = _royaltyPercentage;
        royaltyRecipient = _recipient;
    }

    function calculateRoyalty(uint256 _salePrice) public view returns (uint256) {
        return (_salePrice * royaltyPercentage) / 10000;
    }

    function transferRoyalty(uint256 _salePrice) internal {
        uint256 royalty = calculateRoyalty(_salePrice);
        royaltyRecipient.transfer(royalty);
    }

    // Collection management
    function addCollection(
        string memory name,
        string memory description,
        uint256 totalCollectibles
    ) public onlyRole(MANAGER_ROLE) {
        collectionCount++;
        collections[collectionCount].name = name;
        collections[collectionCount].description = description;
        collections[collectionCount].totalCollectibles = totalCollectibles;
        collections[collectionCount].exists = true;
    }

    function addCollectibleToCollection(
        uint256 tokenId,
        uint256 collectionId,
        SpecialEditionType editionType,
        string memory name,
        string memory description,
        string memory mediaLink
    ) public onlyRole(MANAGER_ROLE) {
        require(collections[collectionId].exists, "Collection does not exist");
        collectibleToCollection[tokenId] = collectionId;
        collectibleMetadata[tokenId] = CollectibleMetadata(
            name,
            description,
            mediaLink,
            editionType
        );
        collections[collectionId].specialEditionCounts[editionType]++;
        collectibleCount++;
    }

    // Pausable functions
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    // Marketplace functions
    function listForSale(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can list for sale");
        listingPrices[tokenId] = price;
    }

    function buyFromMarketplace(uint256 tokenId) public payable {
        uint256 price = listingPrices[tokenId];
        require(price > 0, "Item is not for sale");
        require(msg.value >= price, "Insufficient funds");

        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);

        payable(seller).transfer(msg.value - calculateRoyalty(price));
        transferRoyalty(price);
    }

    // Staking functionality
    function stakeCollectible(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can stake");
        stakedTokens[tokenId] = true;
        emit CollectibleStaked(msg.sender, tokenId);
    }

    function unstakeCollectible(uint256 tokenId) public {
        require(stakedTokens[tokenId], "Token not staked");
        require(ownerOf(tokenId) == msg.sender, "Only owner can unstake");
        stakedTokens[tokenId] = false;
        emit CollectibleUnstaked(msg.sender, tokenId);
    }

    // Multi-token minting
    function mintMultipleCollectibles(
        address[] memory recipients,
        uint256 collectionId,
        SpecialEditionType editionType,
        string memory name,
        string memory description,
        string memory mediaLink
    ) public onlyRole(MANAGER_ROLE) {
        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 newTokenId = collectibleCount + i + 1;
            addCollectibleToCollection(newTokenId, collectionId, editionType, name, description, mediaLink);
            _mint(recipients[i], newTokenId);
        }
        collectibleCount += recipients.length;
    }

    // Overrides for ERC721 and AccessControl
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(AccessControlUpgradeable, ERC721Upgradeable, ERC721EnumerableUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}