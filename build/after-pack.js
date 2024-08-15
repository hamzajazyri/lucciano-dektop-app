const { exec } = require('child_process');
const path = require('path');
const os = require('os');

exports.default = async function (context) {
  const platform = os.platform();
  
  if (platform === 'linux') {
    const targetPath = path.join(context.appOutDir, 'chrome-sandbox');
    await exec(`sudo chown root:root ${targetPath} && sudo chmod 4755 ${targetPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error setting permissions on Linux: ${error}`);
        return;
      }
      console.log(`Permissions set for chrome-sandbox on Linux: ${stdout}`);
    });
  } else if (platform === 'win32') {
    // No need to set permissions on Windows, but you could add other Windows-specific logic here if needed
    console.log('No additional permissions required for Windows.');
  } else if (platform === 'darwin') {
    // macOS-specific logic, if any
    console.log('No additional permissions required for macOS.');
  } else {
    console.log(`Unsupported platform: ${platform}`);
  }
};
