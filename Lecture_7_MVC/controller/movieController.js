const movieModel = require('../model/movieModel');

const createMovie = async function createMovie(req, res) {
    try {
        const userObject = req.body;
        const movie = await movieModel.create(userObject);
        res.status(201).json(movie);
    }catch {
        res.status(500).json({ 
            message: "Error creating movie",
            status: "failure"
         });
    }
}
module.exports = createMovie;


const getAllMovies = async function getAllMovies(req, res) {
    try {
        const movie = await movieModel.find();
        if(movie.length != 0) {
            res.status(200).json({
                message: movie,
                status: "success"
            })
        } else {
            res.status(404).json({
                message: "No movies found",
                status: "failure"
            })
        }
    }catch{
        res.status(500).json({ 
            message: "Error getting all movies",
            status: "failure"
         });
    }
}


const getMovie = async function getMovie(req, res) {
    try {
        const id = req.params.id;
        const movie = await movieModel.findById(id);
        if(movie){
            res.status(200).json({
                message: movie,
                status: "success"
            })
        }else{
            res.status(404).json({
                message: "No movie found",
                status: "failure"
            })
        }
    }catch{
        res.status(500).json({ 
            message: "Error getting movie",
            status: "failure"
         });
    }
}

const deleteMovie = async function deleteMovie(req, res) {
    try {
        const id = req.params.id;
        const movie = await movieModel.findByIdAndDelete(id);
        if(movie === null){
            res.status(404).json({
                message: "No movie found",
                status: "sucess"
            })
        }else{
            res.status(200).json({
                message: "Movie deleted successfully",
                status: "success"
            })  
        }

    }catch{
        res.status(500).json({ 
            message: "Error deleting movie",
            status: "failure"
         });
    }
}

module.exports = {
    createMovie,
    getAllMovies,
    getMovie,
    deleteMovie,
}