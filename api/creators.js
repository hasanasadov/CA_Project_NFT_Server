const express = require("express");
const { creators, nfts } = require("../fake-data");
const app = express();

// Get all creators
app.get("/creators", (req, res) => {
  res.status(200).json(creators);
});

// Get creator by ID
app.get("/creators/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Creator id is required!" });
    }

    const creator = creators.find((creator) => creator.id == id);
    if (!creator) {
      return res.status(404).json({ error: `Creator not found with id: ${id}` });
    }
    creator.nfts = nfts.filter((nft) => nft.creatorId == id);
    res.status(200).json(creator);
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error! ${error}` });
  }
});

// Delete a creator
app.delete("/creators/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Creator id is required!" });
    }

    const creatorIdx = creators.findIndex((creator) => creator.id == id);
    if (creatorIdx === -1) {
      return res.status(404).json({ error: `Creator not found with id: ${id}` });
    }
    const deletedCreator = creators.splice(creatorIdx, 1)[0];
    res.status(200).json(deletedCreator);
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error! ${error}` });
  }
});

module.exports = app;
