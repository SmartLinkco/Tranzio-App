const fs = require('fs');
const path = require('path');

/**
 * Recursively get the directory structure of a given path.
 * 
 * @param {string} dirPath - The path of the directory.
 * @param {number} depth - Current depth of recursion.
 * @returns {string} - The formatted directory structure.
 */
const getDirectoryStructure = (dirPath, depth = 0) => {
  const entries = fs.readdirSync(dirPath); // Get list of files and folders
  let structure = '';

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry);
    const isDirectory = fs.lstatSync(fullPath).isDirectory();

    structure += '  '.repeat(depth) + '|-- ' + entry + '\n'; // Indent based on depth

    if (isDirectory) {
      structure += getDirectoryStructure(fullPath, depth + 1); // Recursive call
    }
  });

  return structure;
};

// Set the path to your Next.js project (relative or absolute path)
const projectPath = path.join(__dirname, 'path/to/your/nextjs/project');

// Get the structure of the directory
const structure = getDirectoryStructure(projectPath);

// Write the structure to a file
const outputFile = path.join(__dirname, 'file-structure.txt');
fs.writeFileSync(outputFile, structure);

console.log('✅ File structure saved to:', outputFile);
