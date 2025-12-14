const ensureAuthenticated = require('../Middlewares/Auth');

const router = require('express').Router();
const { getAllProducts } = require('../Controllers/ProductController');

router.get('/', ensureAuthenticated, getAllProducts);

module.exports = router;