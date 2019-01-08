import dataBase from 'nedb';
const db = new dataBase(({filename: process.env.DB_LOCATION ||'chainlogging.db', autoload: true}));
export default (router) => {
    router.post('/log', (req, res, next) => {
        let message = {
            timestamp: new Date(),
            message: req.body.message
        }
        db.insert(message, (err, docs) => {
            console.log(err, docs);
            if (err === null) {
                res.json({success: true})
            }
        })
    })
}