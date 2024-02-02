const {Groups,Users,Transactions,userGroupMapping} = require('../model/Schema');
const helper  = require('../utilities/helper');

/**
 * 
 Status Code :{
    100 : "success",
    101 : "failed",
    102 : "user already exists",
 } 
 */

/*****************User APIs***************** */

exports.createUser = async(req,res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if(await helper.userExists(email)){
            console.log("here");
            res.json({
                code : 102
            })
            return;
        }

        const userId = await helper.getUserId();
        console.log(userId);
        if(userId === -1){
            console.log('Error in getting user id');
            res.json({
                code : 101
            });
            return;
        }

        const userDataObj = {
            UId : userId,
            UName : username,
            email : email,
            password : password
        }

        await Users.add(userDataObj).then((result)=>{
            res.json({
                code : 100
            });
        }).catch((err)=>{
            console.log('Error while adding data' , err);
            res.json({
                code : 101
            });
        });
        return;
        
    } catch (error) {
        console.log(error);
        res.json({
            error : "Not created"
        });
        return;
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