const fs = require('fs');
const path = require('path');

// Path to the gems JSON file
const gemsJsonPath = path.join(__dirname, 'src', 'data', 'gems.json');

// Read the current gems JSON
const gemsData = JSON.parse(fs.readFileSync(gemsJsonPath, 'utf8'));

// Mapping from gem name to icon file based on OCR results
const gemIconMapping = {
  // 5-star gems
  "Phoenix Ashes": "gem-1.png",
  "Seeping Bile": "gem-1.png", // Also appears in gem-1, gem-2, gem-3, gem-4
  "Echoing Shade": "gem-7.png",
  "Bottled Hope": "gem-8.png",
  "Gloom Cask": "gem-9.png",
  "Frozen Heart": "gem-10.png",
  "Hellfire Fragment": "gem-12.png",
  
  // 2-star gems
  "Unity Crystal": "gem-33.png",
  "Pain Clasp": "gem-34.png", // Appears in multiple screenshots
  "Kir Sling": "gem-34.png", // Appears in multiple screenshots
  "The Abiding Curse": "gem-35.png",
  "Volatility Shard": "gem-36.png",
  "Mother's Lament": "gem-40.png",
  "Ironbane": "gem-40.png",
  "Viper's Bite": "gem-41.png", // Also in gem-39, gem-40, gem-42
  "Mossthorn": "gem-43.png", // Also in gem-44
  "Cold Confidant": "gem-45.png",
  "Mercy's Harvest": "gem-46.png",
  "Specter Glass": "gem-47.png",
  
  // 1-star gems
  "The Black Rose": "gem-51.png",
  "Nightmare Wreath": "gem-52.png",
  "Berserker's Eye": "gem-53.png",
  "Respite Stone": "gem-55.png",
  "Ca'arsen's Invigoration": "gem-56.png",
  "Everlasting Torment": "gem-58.png",
  "Zod Stone": "gem-58.png", // Also in gem-59
  "Chained Death": "gem-61.png",
  "Mocking Laughter": "gem-62.png",
  "Seled's Weakening": "gem-63.png",
  "Heartstone": "gem-63.png", // Appears in multiple screenshots
  "Trickshot Gem": "gem-64.png",
  "Blessed Pebble": "gem-65.png",
  "Lo's Focused Gaze": "gem-67.png",
  "Unrefined Passage": "gem-70.png",
  "Misery Elixir": "gem-71.png",
  "Lucent Watcher": "gem-72.png",
  "Faltergrasp": "gem-73.png", // Appears in multiple screenshots
  "Havoc Bearer": "gem-74.png",
  "Surging Sea": "gem-76.png",
  "Mountain Toe": "gem-77.png",
  "Flaystone": "gem-78.png"
};

// Function to update gem icons
function updateGemIcons() {
  let updatedCount = 0;
  
  // Update icons for all gems in all categories (1-star, 2-star, 5-star)
  Object.values(gemsData.gems).flat().forEach(gem => {
    if (gemIconMapping.hasOwnProperty(gem.name)) {
      gem.icon = `/icons/gems/${gemIconMapping[gem.name]}`;
      updatedCount++;
      console.log(`Updated icon for ${gem.name}: ${gem.icon}`);
    } else {
      // Remove any existing icon for gems not in the mapping (to show placeholders)
      delete gem.icon;
    }
  });
  
  // Write the updated gems JSON
  fs.writeFileSync(gemsJsonPath, JSON.stringify(gemsData, null, 2));
  console.log(`\nSuccessfully updated ${updatedCount} gem icons.`);
  
  // Show summary
  const totalGems = Object.values(gemsData.gems).flat().length;
  console.log(`Total gems: ${totalGems}`);
  console.log(`Gems with icons: ${updatedCount}`);
  console.log(`Gems without icons (placeholders): ${totalGems - updatedCount}`);
}

// Run the update
updateGemIcons();
