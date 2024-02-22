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

exports.login = async(req,res) => {
    try {
        const userData = req.body;
        const userCheckResponse = await helper.checkUserCredentials(userData.email,userData.password);

        if(userCheckResponse){
            res.json({
                code : 100
            })
        } else {
            res.json({
                code : 101
            })
        }
        return;
    } catch (error) {
        res.json({
            error : error
        })
        return;
    }
}


/*****************Group APIs**************** */

exports.addGroup = async(req,res) => {
    try {
        const userData = req.body;
        const email = userData.email;
        const GName = userData.gName;

        const UserId = await helper.getUserIdFromEmail(email);

        const GId = await helper.createGroupId();
        const GroupMembers = [UserId];
        const createdOn = helper.getFullDate();
        const groupData = {
            GId : GId,
            GName : GName,
            GroupOwner : UserId,
            GroupMembers : GroupMembers,
            CreatedOn : createdOn
        }

        const GroupAddingRes = await Groups.add(groupData);

        if(!GroupAddingRes){
            res.json({
                code : "101"
            });
            return;
        }

        const GUMId = await helper.getGroupUserMappingId();
        const GIds = [GId];
        const GroupUserMappingData = {
            GUMId : GUMId,
            UId : UserId,
            GIds : GIds
        };
        
        const GroupUserMappingRes = await userGroupMapping.add(GroupUserMappingData);

        if(!GroupUserMappingRes){
            res.json({
                code : "101"
            });
            return;
        }

        res.json({
            code : "100"
        });
    } catch (error) {
        res.json({
            error : error
        })
    }
}

exports.getGroups = async(req,res) => {
    try {
        const email = req.params.email;
        const UId = await helper.getUserIdFromEmail(email);

        var groups = [];
        const querySnapshot = await userGroupMapping.where("UId","==",UId).get();
        querySnapshot.docs.forEach(element => {
            groups.push(element.data().GIds[0]);
        });

        console.log(groups);
        var groupsData = [];

        for(let i=0;i<groups.length;i++){
            const GId = groups[i];
            const groupData = await helper.getGroupDataFromId(GId);
            groupsData.push(groupData);
        }

        res.json({
            code : 100,
            groupsData : groupsData
        });

    } catch (error) {
        throw error;
    }
}


exports.invalid = async(req,res,next)=>{
    const err = new Error();
    err.message = 'Invalid Route';
    err.status = 404;
    next(err);
}