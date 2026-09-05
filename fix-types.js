const fs = require('fs');

// Fix AudioManager
let audioManager = fs.readFileSync('src/audio/AudioManager.ts', 'utf8');
audioManager = audioManager.replace(/bgVolume/g, 'backgroundVolume');
audioManager = audioManager.replace(/'ready'/g, "'idle'");
fs.writeFileSync('src/audio/AudioManager.ts', audioManager);

// Fix BreathingEngine
let breathingEngine = fs.readFileSync('src/engine/BreathingEngine.ts', 'utf8');
breathingEngine = breathingEngine.replace(/DEFAULT_BREATHING_STATE/g, 'INITIAL_BREATHING_STATE');
breathingEngine = breathingEngine.replace(/phaseElapsedSeconds/g, 'phaseRemaining'); 
// Wait, phaseRemaining counts down, phaseElapsedSeconds counts up. 
// Let's modify the engine to match the type.
