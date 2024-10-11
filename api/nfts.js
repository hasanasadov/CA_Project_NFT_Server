const express = require("express");
const { creators, nfts } = require("../fake-data");
const app = express();

app.post("/nfts", (req, res) => {
  try {
    const { skip, pageSize, searchStr } = req.body;
    if (!pageSize) {
      return res.status(400).json({ error: "Field 'pageSize' is required!" });
    }
    const startIndex = skip ? skip : 0;
    const endIndex = startIndex + pageSize;

    const mappedNFTSWithCreator = nfts.map((nft) => ({
      ...nft,
      creator: creators.find((c) => c.id == nft.creatorId),
      creatorId: undefined,
    }));
    const filteredNFTS = mappedNFTSWithCreator.filter(
      (nft) =>
        (searchStr ? nft.name.toLowerCase().includes(searchStr.toLowerCase()) : true) && nft.creator
    );
    const nftsSlice = filteredNFTS.slice(startIndex, endIndex);

    res.status(200).json({
      totalCount: filteredNFTS.length,
      hasMore: endIndex < filteredNFTS.length,
      nfts: nftsSlice,
    });
  } catch (error) {
    res.status(500).json({ error: `Internal Server Error! ${error}` });
  }
});

module.exports = app;
