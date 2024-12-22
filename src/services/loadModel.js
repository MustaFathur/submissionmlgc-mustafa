const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    const modelUrl = process.env.MODEL_URL;
    console.log('Loading model from URL:', modelUrl);
    try {
        const model = await tf.loadGraphModel(modelUrl);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Failed to load model:', error);
        throw error;
    }
}

module.exports = loadModel;