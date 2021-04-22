import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String }
});


export default mongoose.model('Genre', GenreSchema);