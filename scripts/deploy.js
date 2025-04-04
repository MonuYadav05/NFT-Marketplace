const { ethers } = require('hardhat')
const fs = require('fs')

async function main () {
  const NFTMarketplace = await ethers.getContractFactory('NFTMARKETPLACE')
  const nftMarketplace = await NFTMarketplace.deploy()
  await nftMarketplace.waitForDeployment()
  const address = await nftMarketplace.getAddress()
  const abi = nftMarketplace.interface.format()

  const data = {
    address: address,
    abi: abi
  }

  fs.writeFileSync('./app/NFTMarketplace.json', JSON.stringify(data))
  console.log('NFTMarketplace deployed to:', await nftMarketplace.getAddress())
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
