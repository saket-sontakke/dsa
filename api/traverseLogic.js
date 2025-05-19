// // Helper: binary-tree builder + traversals
// class Node {
//   constructor(val) {
//     this.val = val;
//     this.left = null;
//     this.right = null;
//   }
// }

// function buildTree(arr) {
//   if (!arr.length) return null;
//   const root = new Node(arr[0]);
//   const queue = [root];
//   let i = 1;
//   while (i < arr.length) {
//     const node = queue.shift();
//     if (arr[i] != null) {
//       node.left = new Node(arr[i]);
//       queue.push(node.left);
//     }
//     i++;
//     if (i < arr.length && arr[i] != null) {
//       node.right = new Node(arr[i]);
//       queue.push(node.right);
//     }
//     i++;
//   }
//   return root;
// }

// function bfs(root) {
//   if (!root) return [];
//   const result = [];
//   const q = [root];
//   while (q.length) {
//     const n = q.shift();
//     result.push(n.val);
//     if (n.left) q.push(n.left);
//     if (n.right) q.push(n.right);
//   }
//   return result;
// }

// function dfs(root) {
//   if (!root) return [];
//   return [root.val, ...dfs(root.left), ...dfs(root.right)];
// }

// module.exports = { buildTree, bfs, dfs };










// Helper: binary-tree builder + traversals
class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function buildTree(arr) {
  if (!arr.length) return null;
  const root = new Node(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] != null) {
      node.left = new Node(arr[i]);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] != null) {
      node.right = new Node(arr[i]);
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function bfs(root) {
  if (!root) return [];
  const result = [];
  const q = [root];
  while (q.length) {
    const n = q.shift();
    result.push(n.val);
    if (n.left) q.push(n.left);
    if (n.right) q.push(n.right);
  }
  return result;
}

// Preorder Traversal (Root, Left, Right)
function preorder(root) {
  if (!root) return [];
  return [root.val, ...preorder(root.left), ...preorder(root.right)];
}

// Inorder Traversal (Left, Root, Right)
function inorder(root) {
  if (!root) return [];
  return [...inorder(root.left), root.val, ...inorder(root.right)];
}

// Postorder Traversal (Left, Right, Root)
function postorder(root) {
  if (!root) return [];
  return [...postorder(root.left), ...postorder(root.right), root.val];
}

// DFS using preorder traversal
function dfs(root) {
  return preorder(root);
}

module.exports = { buildTree, bfs, dfs, preorder, inorder, postorder };
