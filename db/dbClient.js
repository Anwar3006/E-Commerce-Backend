const { default: mongoose } = require("mongoose")

const dbConnect = async (uri) => {
    try{
        await mongoose.connect(uri)
    } catch (error) {
        console.error(error);
    }
}

module.exports = dbConnect
