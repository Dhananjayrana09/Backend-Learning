/****
**Create a Mongoose schema for a movie database that includes the following fields:**
- **title:** A required string field.
- **description:** A required string field.
- **releaseYear:** A required integer field.
- **genre:** A required string field with a predefined set of valid genres (e.g., Drama, Comedy, Action, Thriller, Horror, Romance, Sci-Fi, Animation, Documentary, Other).
- **rating:** An optional number field with a minimum of 1 and a maximum of 5.
- **cast:** An optional array of strings representing the cast members.
- **director:** An optional string field.
- **thumbnail:** An optional string field representing the URL of the movie's thumbnail.
- **trailerLink:** An optional string field representing the URL of the movie's trailer.
- **isPremium:** A boolean field indicating whether the movie is premium. The movie should be free if it's not premium.
 * 
 * 
 * 
 * **/

/*******************movieModel*********************/

const mongoose = require('mongoose')

const schemaRules = {
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release Year is required']
    },
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        enum: ['Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Animation', 'Documentary', 'Other']
    },
    rating: {
        type: Number,
        min: [1, "rating should cant be less then 1"],  
        max: [5, "rating should cant be more then 5"],
        default: null
    },
    cast: {
        type: [String],
        default: []
    },
    director: {
        type: [String],
        default: null
    },
    thumbnail: {
        type: String,
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    trailerLink: {
        type: String,
    }
    
}

const movieSchema = new mongoose.Schema(schemaRules)
const movieModel = mongoose.model('movie', movieSchema)
module.exports = movieModel;