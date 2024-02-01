const Groups = require('../model/Schema');

/*****************User APIs***************** */

exports.createUser = async(req,res) => {
    try {
        console.log("here");
        const data = req.body.username;
        
        console.log("data",data);
        res.json({
            data : "User Created"
        })
    } catch (error) {
        res.json({
            error : "Not created"
        })
    }
}


/*****************Group APIs**************** */

exports.addGroup = async(req,res) => {
    try {
        await Groups.add(data);
        console.log(data);
        res.json({
            msg : "Group added"
        })
    } catch (error) {
        res.json({
            error : error
        })
    }
}




exports.invalid = async(req,res,next)=>{
    const err = new Error();
    err.message = 'Invalid Route';
    err.status = 404;
    next(err);
}