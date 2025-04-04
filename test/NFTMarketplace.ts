import { expect } from 'chai'
import { ethers } from 'hardhat'
// import { NFTMARKETPLACE } from '../typechain-types' // Adjust path based on your setup

describe('NFTMARKETPLACE', function () {
  // @ts-ignore
  let nftMarketplace: NFTMARKETPLACE
  let owner: any, addr1: any, addr2: any

  beforeEach(async function () {
    const NFTMarketplace = await ethers.getContractFactory('NFTMARKETPLACE')
    ;[owner, addr1, addr2] = await ethers.getSigners()
    // @ts-ignore
    nftMarketplace = (await NFTMarketplace.deploy()) as NFTMARKETPLACE
  })

  it('Should deploy correctly and set the owner', async function () {
    expect(await nftMarketplace.getOwner()).to.equal(owner.address)
  })

  it('Should update the listing price', async function () {
    const newPrice = ethers.parseEther('0.02')
    await nftMarketplace.updateListPrice(newPrice)
    expect(await nftMarketplace.getListPrice()).to.equal(newPrice)
  })

  it('Should create and list an NFT', async function () {
    const tokenURI = 'https://my-nft.com/metadata.json'
    const price = ethers.parseEther('1')

    await nftMarketplace.createToken(tokenURI, price, {
      value: ethers.parseEther('0.01')
    })
    const tokenId = await nftMarketplace.getCurrentTokenId()

    const listedToken = await nftMarketplace.getListedForTokenId(tokenId)
    expect(listedToken.tokenId).to.equal(tokenId)
    expect(listedToken.price).to.equal(price)
    expect(listedToken.currentlyListed).to.be.true
  })

  it('Should execute NFT sale', async function () {
    const tokenURI = 'https://my-nft.com/metadata.json'
    const price = ethers.parseEther('1')

    await nftMarketplace.createToken(tokenURI, price, {
      value: ethers.parseEther('0.01')
    })
    const tokenId = await nftMarketplace.getCurrentTokenId()

    // addr1 buys NFT
    await nftMarketplace.connect(addr1).executeSale(tokenId, { value: price })

    const listedToken = await nftMarketplace.getListedForTokenId(tokenId)
    expect(listedToken.seller).to.equal(addr1.address)
  })

  it('Should return all NFTs and owned NFTs', async function () {
    const tokenURI = 'https://my-nft.com/metadata.json'
    const price = ethers.parseEther('1')

    await nftMarketplace.createToken(tokenURI, price, {
      value: ethers.parseEther('0.01')
    })

    const allNFTs = await nftMarketplace.getAllNFTs()
    expect(allNFTs.length).to.be.greaterThan(0)

    const myNFTs = await nftMarketplace.getMyNFTs()
    expect(myNFTs.length).to.be.greaterThan(0)
  })
})
