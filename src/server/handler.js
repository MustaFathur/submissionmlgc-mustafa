const predictClassification = require('../services/inferenceService');
const { Firestore } = require('@google-cloud/firestore');
const crypto = require('crypto');
const InputError = require('../exceptions/InputError');

const firestore = new Firestore({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    try {
        console.log('Starting prediction...');
        const { confidenceScore, label, suggestion } = await predictClassification(model, image);
        console.log('Prediction completed:', { confidenceScore, label, suggestion });

        const id = crypto.randomUUID();
        const createdAt = new Date().toISOString();

        const data = {
            id,
            result: label,
            suggestion,
            createdAt,
        };

        console.log('Saving prediction to Firestore...');
        await firestore.collection('predictions').doc(id).set(data);
        console.log('Prediction saved to Firestore');

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        }).code(201); // Pastikan status kode adalah integer
    } catch (error) {
        if (error instanceof InputError) {
            console.error('Input error:', error);
            return h.response({
                status: 'fail',
                message: 'Terjadi kesalahan dalam melakukan prediksi',
            }).code(400); // Pastikan status kode adalah integer
        }

        console.error('Internal Server Error:', error);
        return h.response({
            status: 'error',
            message: 'An internal server error occurred',
        }).code(500); // Pastikan status kode adalah integer
    }
}

module.exports = postPredictHandler;