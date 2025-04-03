// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.19;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMARKETPLACE is ERC721URIStorage {
    address payable owner;
    uint256 _tokenIds;
    uint256 _itemsSold;
    uint256 listPrice = 0.01 ether;

    constructor() ERC721("NFTMARKETPLACE", "NFTM") {
        console.log("NFTMARKETPLACE deployed");
        owner = payable(msg.sender);
        _tokenIds = 0;
        _itemsSold = 0;
    }

    struct ListedToken {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool currentlyListed;
    }

    mapping(uint256 => ListedToken) public idToListedToken;

    function updateListPrice(uint256 _newPrice) public payable {
        require(msg.sender == owner, "Only owner can update listing price");
        listPrice = _newPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }

    function getLatestIdToListedToken()
        public
        view
        returns (ListedToken memory)
    {
        uint256 latestId = _tokenIds;
        return idToListedToken[latestId];
    }

    function getListedForTokenId(
        uint256 _tokenId
    ) public view returns (ListedToken memory) {
        return idToListedToken[_tokenId];
    }

    function getCurrentTokenId() public view returns (uint256) {
        return _tokenIds;
    }

    function createToken( string memory tokenURI,uint256 price) public payable returns (uint256) {
        require(msg.value == listPrice, "Price must be equal to listing price");
        require(price > 0, "Price must be greater than 0");
        _tokenIds++;
        uint256 currentTokenId = _tokenIds;
        _safeMint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);

        createListedToken(currentTokenId, price);
        return currentTokenId;
    }

    function createListedToken(uint256 _tokenId, uint256 _price) private {
        idToListedToken[_tokenId] = ListedToken(
            _tokenId,
            payable(msg.sender),
            payable(address(this)),
            _price,
            true
        );

        _transfer(msg.sender, address(this), _tokenId);
    }

    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds;
        ListedToken[] memory tokens = new ListedToken[](nftCount);

        uint256 currentIndex = 0;
        for (uint i = 0; i < nftCount; i++) {
            uint256 currentId = i + 1;
            ListedToken memory currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex++;
        }
        return tokens;
    }

    function getMyNFTs() public view returns (ListedToken[] memory) {
        ListedToken[] memory tokens = getAllNFTs();
        uint256 nftCount = tokens.length;
        uint256 ownedCount = 0;
        for (uint i = 0; i < nftCount; i++) {
            if (tokens[i].owner == msg.sender || tokens[i].seller == msg.sender) {
                ownedCount++;
            }
        }

        ListedToken[] memory myTokens = new ListedToken[](ownedCount);
        for (uint i = 0; i < nftCount; i++) {
            if (tokens[i].owner == msg.sender || tokens[i].seller == msg.sender) {
                myTokens[i] = tokens[i];
            }
        }
        return myTokens;
    }

    function executeSale(uint256 _tokenId) public payable {
        uint256 price = idToListedToken[_tokenId].price;
        require(msg.value == price, "Please submit the asking price in order to complete purchase");

        address seller = idToListedToken[_tokenId].seller;

        idToListedToken[_tokenId].currentlyListed = true;
        _itemsSold += 1;
        idToListedToken[_tokenId].seller = payable(msg.sender);

        _transfer(address(this) , msg.sender , _tokenId);
        approve(address(this) ,  _tokenId);

        payable(owner).transfer(listPrice);
        payable(seller).transfer(msg.value);
    }
}
