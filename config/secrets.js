// hold all secrets here
    // most likely NOT hard coded
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'is it secret?',
}