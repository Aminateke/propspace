const express = require('express');
const router = express.Router();
const { getProperties, getMyProperties, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const auth = require('../middleware/auth');

router.get('/', getProperties); // GET /api/properties
router.get('/my-listings', auth, getMyProperties);
router.post('/', auth, createProperty); // POST /api/properties
router.put('/:id', auth, updateProperty); // PUT /api/properties/:id
router.delete('/:id', auth, deleteProperty); // DELETE /api/properties/:id

module.exports = router;