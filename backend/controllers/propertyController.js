const Property = require('../models/Property');

exports.getProperties = async (req, res) => {
    try {
        const { city, minPrice, maxPrice } = req.query;
        let query = {};
        if (city) query.location = new RegExp(city, 'i');
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        const properties = await Property.find(query).populate('author', 'username');
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyProperties = async (req, res) => {
    try {
        const properties = await Property.find({ author: req.user.id });
        res.status(200).json(properties); // Dedicated "My Listings" screen data
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createProperty = async (req, res) => {
    try {
        const { title, description, price, location, propertyType, images } = req.body;
        const property = new Property({
            title, description, price, location, propertyType, images, author: req.user.id
        });
        await property.save();
        res.status(201).json(property); // 201 Created
    } catch (err) {
        res.status(400).json({ message: 'Payload validation error' });
    }
};

exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        // Strict Object Ownership Validation at server level
        if (property.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden: You are not the owner' }); // 403 Forbidden
        }

        property = await Property.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(property);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: 'Property not found' });

        if (property.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await property.deleteOne();
        res.status(200).json({ message: 'Property removed completely' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};