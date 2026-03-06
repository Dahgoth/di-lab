const fs = require('fs');
const path = require('path');
const { createWorker } = require('tesseract.js');

// Directory containing the gem screenshots
const screenshotsDir = path.join(__dirname, 'docs', 'game-ui-screenshots', 'gems-screenshofts');
// Directory to save extracted icons
const outputDir = path.join(__dirname, 'public', 'icons', 'gems');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Helper function to read all PNG files in a directory
function getPngFiles(directory) {
  return fs.readdirSync(directory)
    .filter(file => file.toLowerCase().endsWith('.png'))
    .map(file => path.join(directory, file));
}

// Main function to process each screenshot
async function processScreenshots() {
  console.log('Initializing Tesseract worker...');
  const worker = await createWorker('eng');
  
  // Get all screenshot files
  const screenshotFiles = getPngFiles(screenshotsDir);
  console.log(`Found ${screenshotFiles.length} screenshot(s)...`);
  
  // Process each screenshot
  for (let i = 0; i < screenshotFiles.length; i++) {
    const screenshotPath = screenshotFiles[i];
    const fileName = path.basename(screenshotPath);
    console.log(`\nProcessing ${fileName}...`);
    
    try {
      // Perform OCR on the entire screenshot
      const { data: { text } } = await worker.recognize(screenshotPath);
      
      // Try to find gem names in the OCR text
      console.log('OCR Text:', JSON.stringify(text));
      
      // Check if we recognize any existing gem names from src/data/gems.json
      const gems = require('./src/data/gems.json');
      const recognizedGems = [];
      
      // Check all gem names in all categories (1-star, 2-star, 5-star)
      Object.values(gems.gems).flat().forEach(gem => {
        if (text.toLowerCase().includes(gem.name.toLowerCase())) {
          recognizedGems.push(gem);
        }
      });
      
      if (recognizedGems.length > 0) {
        console.log(`Found ${recognizedGems.length} matching gem(s):`);
        recognizedGems.forEach(gem => {
          console.log(`- ${gem.name} (${gem.starRating}-star)`);
        });
        
        // For now, just copy the entire screenshot as icon (will need to crop later)
        const outputPath = path.join(outputDir, `gem-${i + 1}.png`);
        fs.copyFileSync(screenshotPath, outputPath);
        console.log(`Saved icon to ${outputPath}`);
      } else {
        console.log('No matching gem names found.');
      }
    } catch (error) {
      console.error('Error processing:', fileName, error);
    }
  }
  
  console.log('\nDone processing all screenshots.');
  await worker.terminate();
  
  // Show summary
  const iconFiles = getPngFiles(outputDir);
  console.log(`\nExtracted ${iconFiles.length} icon(s) to ${outputDir}`);
  
  // List all extracted icons
  console.log('Icon files:');
  iconFiles.forEach(file => {
    const stats = fs.statSync(file);
    console.log(`- ${path.basename(file)} (${stats.size} bytes)`);
  });
}

// Run the process
processScreenshots().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
