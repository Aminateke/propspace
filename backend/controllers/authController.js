const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt); // Salted and hashed registration
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.status(201).json({ token, user: { id: user.id, username, email } }); // 201 Created
        });
    } catch (err) {
        res.status(400).json({ message: 'Registration failed due to malformed payload' }); // 400 Bad Request
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ token, user: { id: user.id, username: user.username, email } }); // 200 OK
        });
    } catch (err) {
        res.status(400).json({ message: 'Bad request schemas' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, phone, avatar, oldPassword, newPassword } = req.body;
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' }); // 404 Not Found

        if (newPassword) {
            if (!oldPassword) return res.status(400).json({ message: 'Provide old password first' });
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Old password incorrect' });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (username) user.username = username;
        if (phone) user.phone = phone;
        if (avatar) user.avatar = avatar;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};