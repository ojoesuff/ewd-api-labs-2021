import express from 'express';
import movieModel from './movieModel';
import asyncHandler from 'express-async-handler';
import { NotFound } from './../../responses';

const router = express.Router();

router.get('/', async (req, res) => {

    let { page = 1, limit = 4 } = req.query; // destructure page and limit and set default values
    [page, limit] = [+page, +limit]; //trick to convert to numeric (req.query will contain string values)

    const totalDocumentsPromise = movieModel.estimatedDocumentCount(); //Kick off async calls
    const moviesPromise = movieModel.find().limit(limit).skip((page - 1) * limit);

    const totalDocuments = await totalDocumentsPromise; //wait for the above promises to be fulfilled
    const movies = await moviesPromise;

    const returnObject = { page: page, total_pages: Math.ceil(totalDocuments / limit), total_results: totalDocuments, results: movies };//construct return Object and insert into response object

    res.status(200).json(returnObject);
});

// Get movie details
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const movie = await movieModel.findById(id).exec();
    if (movie) {
        res.status(200).json(movie.reviews);
    } else {
        res.status(404).json(NotFound);
    }
});

// Get movie reviews
router.get('/:id/reviews', async (req, res) => {
    const id = req.params.id;
    const movie = await movieModel.findById(id).exec();
    if (movie) {
        res.status(200).json(movie.reviews);
    } else {
        res.status(404).json(NotFound);
    }
});

// post movie review
router.post('/:id/reviews', asyncHandler(async (req, res) => {
    const id = req.params.id;
    req.body.created_at = Date.now()
    req.body.updated_at = Date.now()
    const movie = await movieModel.findByIdAndUpdate(id, {"reviews": req.body });
    if (movie)
        res.json({ success: true, token: "FakeTokenForNow" });
    else
        res.json(404, NotFound);
}));

export default router;