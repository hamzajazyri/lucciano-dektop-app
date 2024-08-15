const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Initialize the SQLite database
// prod env
const dbPath = path.join(process.resourcesPath, 'database.db');
// dev env
// const dbPath = path.join(__dirname, 'database.db'); // Path to your SQLite database file

let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Function to create the workspace table
function createWorkspaceTable() {
  const sql = `CREATE TABLE IF NOT EXISTS workspace (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    workspaceName TEXT NOT NULL
  )`;

  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating workspace table', err.message);
    } else {
      console.log('Workspace table created.');
    }
  });
}

createWorkspaceTable();

// Function to insert a record into the workspace table
function insertWorkspace(path, workspaceName, callback) {
  const sql = `INSERT INTO workspace (path, workspaceName) VALUES (?, ?)`;
  db.run(sql, [path, workspaceName], function (err) {
    if (err) {
      console.error('Error inserting workspace record', err.message);
      callback(err, null);
    } else {
      callback(null, this.lastID);
    }
  });
}

// Function to delete a record from the workspace table by ID
function deleteWorkspace(id, callback) {
  const sql = `DELETE FROM workspace WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting workspace record', err.message);
      callback(err);
    } else {
      callback(null);
    }
  });
}

// Function to select all records from the workspace table
function getAllWorkspaces(callback) {
  const sql = `SELECT * FROM workspace`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching workspaces', err.message);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
}


// Function to select a record from the workspace table by ID
function getWorkspaceById(id, callback) {
  const sql = `SELECT * FROM workspace WHERE id = ?`;
  console.log('Executing SQL:', sql, 'with ID:', id);

  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error fetching workspace by id', err.message);
      callback(err, null);
    } else {
      if (row) {
        console.log('Workspace found:', row);
      } else {
        console.log('No workspace found with id:', id);
      }
      callback(null, row);
    }
  });
}



////////////////////////////////////////////////////
//////              NOTES TABLE                /////



// Function to create the notes table
function createNotesTable() {
  const sql = `CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    description TEXT
  )`;

  db.run(sql, (err) => {
    if (err) {
      console.error('Error creating notes table:', err.message);
    } else {
      console.log('Notes table created.');
    }
  });
}

createNotesTable();

// Function to add a new note
function addNote(path, description, callback) {
  const sql = `INSERT INTO notes (path, description) VALUES (?, ?)`;
  db.run(sql, [path, description], function (err) {
    if (err) {
      console.error('Error adding note:', err.message);
      callback(err, null);
    } else {
      console.log('Note added with ID:', this.lastID);
      callback(null, this.lastID);
    }
  });
}

// Function to update an existing note
function updateNote(id, description, callback) {
  const sql = `UPDATE notes SET description = ? WHERE id = ?`;
  db.run(sql, [description, id], function (err) {
    if (err) {
      console.error('Error updating note:', err.message);
      callback(err, null);
    } else if (this.changes === 0) {
      console.log('No note found with the given ID.');
      callback(new Error('No note found with the given ID.'), null);
    } else {
      console.log('Note updated successfully.');
      callback(null, this.changes);
    }
  });
}



// Function to get a note by path
function getNoteByPath(path, callback) {
  const sql = `SELECT * FROM notes WHERE path = ?`;
  db.all(sql, [path], (err, row) => {
    if (err) {
      console.error('Error retrieving note:', err.message);
      callback(err, null);
    } else if (!row) {
      console.log('No note found with the given path.');
      callback(new Error('No note found with the given path.'), null);
    } else {
      console.log('Note retrieved:', row);
      callback(null, row);
    }
  });
}

// Function to delete a note by ID
function deleteNoteById(id, callback) {
  const sql = `DELETE FROM notes WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error deleting note:', err.message);
      callback(err, null);
    } else if (this.changes === 0) {
      console.log('No note found with the given ID.');
      callback(new Error('No note found with the given ID.'), null);
    } else {
      console.log('Note deleted successfully.');
      callback(null, this.changes);
    }
  });
}


// Export the functions
module.exports = { 
  createWorkspaceTable, insertWorkspace, deleteWorkspace, getAllWorkspaces, getWorkspaceById, 
  getNoteByPath, updateNote, addNote, deleteNoteById
};
