require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Simulated blockchain connection
const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_URL);
const signer = provider.getSigner();

// Game state
let currentQuest = null;

// Start a new quest
app.post('/start-quest', (req, res) => {
  const questId = Math.floor(Math.random() * 1000);
  currentQuest = {
    id: questId,
    status: 'started',
    startTime: Date.now(),
  };
  res.json({ message: `Quest ${questId} started!` });
});

// Fight a creature
app.post('/fight', (req, res) => {
  if (!currentQuest || currentQuest.status !== 'started') {
    res.status(400).json({ message: "No quest started!" });
    return;
  }

  const fightOutcome = Math.random() < 0.5 ? 'win' : 'lose';
  if (fightOutcome === 'win') {
    currentQuest.status = 'won';
    res.json({ message: "You've defeated the creature!" });
  } else {
    currentQuest.status = 'lost';
    res.json({ message: "You've been defeated by the creature." });
  }
});

// Claim rewards
app.get('/claim-rewards', (req, res) => {
  if (!currentQuest || currentQuest.status !== 'won') {
    res.status(400).json({ message: "No rewards to claim!" });
    return;
  }

  // Simulate sending rewards via blockchain
  const tx = {
    to: req.query.address,
    value: ethers.utils.parseEther("0.01"),
  };
  
  signer.sendTransaction(tx).then((transaction) => {
    res.json({ message: "Rewards claimed!", transaction });
  }).catch(error => {
    res.status(500).json({ message: "Error claiming rewards.", error });
  });
});

app.listen(port, () => {
  console.log(`EtherQuest game server running at http://localhost:${port}`);
});
