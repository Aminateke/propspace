const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    propertyType: { type: String, enum: ['Apartment', 'House', 'Studio'], required: true },
    images: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference optimization to link an individual property to a specific account ID
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);