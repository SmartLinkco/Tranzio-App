const fs = require('fs');
const path = require('path');

const newStructure = {
  "app": {
    "auth": {
      "signin": { "page.tsx": null },
      "signup": { "page.tsx": null }
    },
    "chat": {
      "[roomId]": { "page.tsx": null },
      "direct": {
        "[userId]": { "page.tsx": null }
      },
      "groups": {
        "[groupId]": { "page.tsx": null }
      },
      "page.tsx": null
    },
    "dashboard": { "page.tsx": null },
    "settings": { "page.tsx": null },
    "layout.tsx": null,
    "page.tsx": null
  },
  "components": {
    "auth": {
      "login-form.tsx": null,
      "signup-form.tsx": null
    },
    "chat": {
      "chat-bubble.tsx": null,
      "chat-input.tsx": null,
      "message-list.tsx": null,
      "room-list.tsx": null,
      "user-status.tsx": null
    },
    "common": {
      "alert.tsx": null,
      "button.tsx": null,
      "header.tsx": null,
      "footer.tsx": null,
      "loading.tsx": null,
      "modal.tsx": null
    },
    "dashboard": {
      "recent-chats.tsx": null,
      "stats-card.tsx": null,
      "user-profile.tsx": null
    }
  },
  "lib": {
    "auth.ts": null,
    "db.ts": null,
    "socket.ts": null,
    "utils.ts": null
  },
  "public": {
    "images": {
      "logo.svg": null,
      "avatars": {},
      "icons": {}
    }
  },
  "styles": {
    "globals.css": null
  },
  "types": {
    "chat.ts": null,
    "user.ts": null
  },
  "config": {
    "site.ts": null,
    "constants.ts": null
  },
  "hooks": {
    "useChat.ts": null,
    "useAuth.ts": null,
    "useSocket.ts": null
  }
};

/**
 * Recursively create the file and folder structure.
 * @param {string} basePath - The base directory for the structure.
 * @param {Object} structure - The nested structure object.
 */
function createOrUpdateStructure(basePath, structure) {
  Object.entries(structure).forEach(([name, content]) => {
    const currentPath = path.join(basePath, name);

    // Skip node_modules and hidden files or directories (those starting with a dot)
    if (name === 'node_modules' || name.startsWith('.')) return;

    if (content === null) {
      // Create or update a file
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(path.dirname(currentPath), { recursive: true });
        fs.writeFileSync(currentPath, '', 'utf8'); // Create an empty file
        console.log(`📄 File created: ${currentPath}`);
      } else {
        console.log(`✅ File exists: ${currentPath}`);
      }
    } else {
      // Create a directory (if it doesn't exist) and recurse
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
        console.log(`📁 Directory created: ${currentPath}`);
      } else {
        console.log(`✅ Directory exists: ${currentPath}`);
      }
      createOrUpdateStructure(currentPath, content);
    }
  });
}

/**
 * Delete files and directories that are no longer part of the new structure.
 * @param {string} basePath - The base directory to scan.
 * @param {Object} structure - The new desired structure.
 */
function cleanOldStructure(basePath, structure) {
  const existingEntries = fs.readdirSync(basePath);
  existingEntries.forEach((entry) => {
    const currentPath = path.join(basePath, entry);

    // Skip node_modules and hidden files or directories (those starting with a dot)
    if (entry === 'node_modules' || entry.startsWith('.')) return;

    const isDirectory = fs.statSync(currentPath).isDirectory();
    if (!(entry in structure)) {
      // Entry is not in the new structure, so delete it
      if (isDirectory) {
        fs.rmSync(currentPath, { recursive: true, force: true });
        console.log(`🗑️ Directory removed: ${currentPath}`);
      } else {
        fs.unlinkSync(currentPath);
        console.log(`🗑️ File removed: ${currentPath}`);
      }
    } else if (isDirectory && typeof structure[entry] === 'object') {
      // Recurse into subdirectory to clean old files
      cleanOldStructure(currentPath, structure[entry]);
    }
  });
}

// Set the base directory where the project should be modified
const baseDirectory = path.join(__dirname);

// Clean up any old files not in the new structure
cleanOldStructure(baseDirectory, newStructure);

// Create or update the project structure
createOrUpdateStructure(baseDirectory, newStructure);

console.log(`🎉 Project structure successfully updated at: ${baseDirectory}`);
