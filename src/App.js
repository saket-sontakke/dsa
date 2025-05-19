// src/App.js
import React, { useState } from 'react';

// Compute (x,y) positions for each node via simple horizontal spacing
function computePositions(root, depth = 0, xStart = 0, xEnd = 600) {
  if (!root) return [];
  const x = (xStart + xEnd) / 2;
  const y = depth * 80 + 40;
  return [
    { id: `${root.val}-${depth}`, val: root.val, x, y, depth },
    ...computePositions(root.left,  depth + 1, xStart,    x),
    ...computePositions(root.right, depth + 1, x,         xEnd),
  ];
}

export default function App() {
  const [input,    setInput]    = useState('');
  const [treeData, setTreeData] = useState(null);
  const [output,   setOutput]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    // 1) Split & trim tokens
    const rawTokens = input.split(',').map(s => s.trim());

    // 2) Validate first token (root) must be a real number
    if (
      rawTokens.length === 0 ||
      rawTokens[0].toLowerCase() === 'null' ||
      rawTokens[0] === '' ||
      isNaN(Number(rawTokens[0]))
    ) {
      setOutput('Error: the first element (root) must be a valid number.');
      setTreeData(null);
      return;
    }

    // 3) Validate each token is either "null" or a number
    for (let i = 0; i < rawTokens.length; i++) {
      const t = rawTokens[i].toLowerCase();
      if (t !== 'null' && (t === '' || isNaN(Number(t)))) {
        setOutput(`Error: token #${i + 1} (“${rawTokens[i]}”) is not “null” or a number.`);
        setTreeData(null);
        return;
      }
    }

    // 4) Convert to [number|null]
    const nodes = rawTokens.map(t => (t.toLowerCase() === 'null' ? null : Number(t)));

    try {
      // Call server for BFS/DFS
      const res  = await fetch('/traverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setOutput(`BFS: ${data.bfs.join(', ')}\nDFS: ${data.dfs.join(', ')}`);

      // Rebuild tree on front end for visualization
      class Node {
        constructor(val) {
          this.val   = val;
          this.left  = null;
          this.right = null;
        }
      }
      function buildTree(arr) {
        if (!arr.length) return null;
        const root = new Node(arr[0]);
        const q    = [root];
        let i      = 1;
        while (i < arr.length) {
          const node = q.shift();
          if (arr[i] != null) {
            node.left = new Node(arr[i]);
            q.push(node.left);
          }
          i++;
          if (i < arr.length && arr[i] != null) {
            node.right = new Node(arr[i]);
            q.push(node.right);
          }
          i++;
        }
        return root;
      }

      const root      = buildTree(nodes);
      const positions = computePositions(root);
      setTreeData({ root, positions });

    } catch (err) {
      setOutput('Error: ' + err.message);
      setTreeData(null);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '2rem',
        backgroundColor: '#eae7dd',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ color: '#71503A' }}>
          Binary Tree Traversal & Visualization
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <input
            type="text"
            placeholder="e.g. 1,2,3,null,4"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              width: '300px',
              padding: '0.5rem',
              border: '1px solid #71503A',
              borderRadius: '5px',
              backgroundColor: '#fffaf2',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#71503A',
              color: '#eae7dd',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Go!
          </button>
        </form>

        {output && (
          <pre
            style={{
              textAlign: 'left',
              backgroundColor: '#fffaf2',
              padding: '1rem',
              borderRadius: '5px',
              color: '#71503A',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {output}
          </pre>
        )}

        {treeData && (
          <svg
            width={600}
            height={(Math.max(...treeData.positions.map(p => p.depth)) + 2) * 80}
            style={{ marginTop: '2rem', display: 'block', marginInline: 'auto' }}
          >
            {/* Draw edges */}
            {(() => {
              const posMap = {};
              treeData.positions.forEach(n => {
                posMap[n.id] = n;
              });

              function collectEdges(node, depth = 0) {
                if (!node) return [];
                const edges = [];
                const parentId = `${node.val}-${depth}`;
                if (node.left) {
                  const leftId = `${node.left.val}-${depth + 1}`;
                  edges.push({ from: posMap[parentId], to: posMap[leftId] });
                  edges.push(...collectEdges(node.left, depth + 1));
                }
                if (node.right) {
                  const rightId = `${node.right.val}-${depth + 1}`;
                  edges.push({ from: posMap[parentId], to: posMap[rightId] });
                  edges.push(...collectEdges(node.right, depth + 1));
                }
                return edges;
              }

              const edges = collectEdges(treeData.root);
              return edges.map((e, idx) => (
                <line
                  key={`edge-${idx}`}
                  x1={e.from.x}
                  y1={e.from.y + 20}
                  x2={e.to.x}
                  y2={e.to.y - 20}
                  stroke="#71503A"
                  strokeWidth={2}
                />
              ));
            })()}

            {/* Draw nodes */}
            {treeData.positions.map((n, idx) => (
              <g key={`node-${n.id}-${idx}`}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={20}
                  fill="#71503A"
                  stroke="#71503A"
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#eae7dd"
                  fontWeight="bold"
                >
                  {n.val}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}



