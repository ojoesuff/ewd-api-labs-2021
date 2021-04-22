import express from 'express';
import genreModel from './genreModel';

const router = express.Router();

// Get all genres
router.get('/', async (req, res) => {
    const users = await genreModel.find();
    res.status(200).json(users);
});

export default router;