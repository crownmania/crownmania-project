
async function main() {
    const Crownmania = await ethers.getContractFactory("Crownmania");

    // Deploying the contract with brand description, royalty percentage, and recipient address
    const crownmania = await upgrades.deployProxy(Crownmania, [
        "Crownmania is a visionary collectibles brand that combines exclusive, limited-edition physical collectibles with the power of blockchain technology. Each Crownmania collectible is paired with a unique non-fungible token (NFT), creating a bridge between the physical and digital worlds. Our mission is to celebrate culture, innovation, and the creators who shape the future, offering collectors an immersive experience with every piece", // Replace with the actual description
        1000, // 10% in basis points
        "0xC88fD39a990aED8B95A65d4cdD4A8D4d13600e8c" // Replace with the actual recipient address
    ], { initializer: 'initialize' });

    await crownmania.deployed();
    console.log("Crownmania contract deployed to:", crownmania.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });