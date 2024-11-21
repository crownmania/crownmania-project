// controllers/collectibleController.js
const Collectible = require('../models/Collectible');
const { ethers } = require('ethers');

/**
 * Verify a collectible based on serial number
 * @route POST /api/collectibles/verify
 * @param {string} serialNumber - Serial number of the collectible
 * @returns {object} - Collectible details
 */
exports.verifyCollectible = async (req, res) => {
  const { serialNumber } = req.body;
  try {
    const collectible = await Collectible.findOne({ serialNumber });
    if (!collectible) return res.status(404).json({ message: 'Collectible not found.' });

    if (!collectible.inUse) {
      return res.status(400).json({ message: 'Collectible is not yet assigned or packaged.' });
    }

    res.json(collectible);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Claim a collectible NFT
 * @route POST /api/collectibles/claim
 * @param {string} collectibleId - ID of the collectible
 * @returns {object} - Message and transaction hash
 */
exports.claimCollectible = async (req, res) => {
  const { collectibleId } = req.body;
  try {
    const collectible = await Collectible.findById(collectibleId);
    if (!collectible) return res.status(404).json({ message: 'Collectible not found.' });

    if (collectible.claimed) {
      return res.status(400).json({ message: 'Collectible already claimed.' });
    }

    const txHash = await transferNFT(req.user.walletAddress, collectible.tokenId);

    collectible.ownerWalletAddress = req.user.walletAddress;
    collectible.claimed = true;
    await collectible.save();

    res.json({ message: 'Collectible claimed successfully.', txHash });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Get collectibles owned by the user
 * @route GET /api/collectibles/my-collectibles
 * @returns {array} - List of collectibles
 */
exports.getMyCollectibles = async (req, res) => {
  try {
    const collectibles = await Collectible.find({ ownerWalletAddress: req.user.walletAddress });
    res.json(collectibles);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Mark a collectible as packaged
 * @route POST /api/collectibles/package
 * @param {string} serialNumber - Serial number of the collectible
 * @returns {object} - Updated collectible
 */
exports.packageCollectible = async (req, res) => {
  const { serialNumber } = req.body;
  try {
    const collectible = await Collectible.findOne({ serialNumber });
    if (!collectible) return res.status(404).json({ message: 'Collectible not found.' });

    if (collectible.inUse) {
      return res.status(400).json({ message: 'Collectible already packaged.' });
    }

    collectible.inUse = true;
    collectible.packagedDate = new Date();

    const countInUse = await Collectible.countDocuments({ inUse: true });
    collectible.collectibleNumber = countInUse + 1;

    await collectible.save();

    res.json({ message: 'Collectible packaged successfully.', collectible });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

/**
 * Transfer NFT to user's wallet
 * @param {string} toAddress - Recipient wallet address
 * @param {string} tokenId - NFT token ID
 * @returns {string} - Transaction hash
 */
const transferNFT = async (toAddress, tokenId) => {
  try {
    const provider = new ethers.providers.AlchemyProvider('matic', process.env.ALCHEMY_API_KEY);
    const wallet = new ethers.Wallet(process.env.COMPANY_WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

    const tx = await contract.safeTransferFrom(wallet.address, toAddress, tokenId);
    await tx.wait();

    return tx.hash;
  } catch (error) {
    console.error('Error transferring NFT:', error);
    throw error;
  }
};

// Replace with your actual contract ABI
const contractABI = [
  // Add your contract's ABI here
];