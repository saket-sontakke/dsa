const express = require('express');
const bodyParser = require('body-parser');
const { buildTree, bfs, dfs } = require('./api/traverseLogic');

const app = express();
app.use(bodyParser.json());

app.post('/traverse', (req, res) => {
  const { nodes } = req.body;
  if (!Array.isArray(nodes)) {
    return res.status(400).json({ error: 'Expecting { nodes: number[] }' });
  }
  const tree = buildTree(nodes);
  res.json({ bfs: bfs(tree), dfs: dfs(tree) });
});

// Serve React static files
app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));