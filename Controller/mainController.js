const {Groups,Users,Transactions,userGroupMapping,firestore} = require('../model/Schema');
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
        
        const userRef = Users.doc();
        const userId = userRef.id;
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
        const {email,GName} = req.body;

        const UserId = await helper.getUserIdFromEmail(email);
        const groupRef = Groups.doc();
        const GId = groupRef.id;
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
            res.status(201).json({
                code : "101"
            });
            return;
        }
        const groupUserRef = userGroupMapping.doc();
        const GUMId = groupUserRef.id;
        const GIds = [GId];
        const GroupUserMappingData = {
            GUMId : GUMId,
            UId : UserId,
            GIds : GIds
        };
        
        const GroupUserMappingRes = await userGroupMapping.add(GroupUserMappingData);

        if(!GroupUserMappingRes){
            res.status(201).json({
                code : "101"
            });
            return;
        }

        res.status(200).json({
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
        console.log("inside");
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

        res.status(200).json({
            code : 100,
            groupsData : groupsData
        });

    } catch (error) {
        throw error;
    }
}


/*********************Transaction APIs********************* */

exports.addTransaction = async(req,res) => {
    try{
        const { amount, users, paidBy, GId } = req.body; // Extract GId from the request
        const date = await helper.getFullDate(); // Get the current date in the desired format

        // Data validation
        if (typeof amount !== 'number' || !Array.isArray(users) || !paidBy || !GId) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        // Create and set transaction in the Transactions collection
        const transactionRef = Transactions.doc();
        const TId = transactionRef.id;
        await transactionRef.set({
            TId,
            amount,
            users,
            paidBy,
            date
        });

        // Update the Groups collection with the new transaction ID
        let transactionComplete = false;
        await firestore.runTransaction(async (transaction) => {
            // Query for the document with the matching GId
            const groupQuerySnapshot = await transaction.get(Groups.where('GId', '==', GId));

            if (groupQuerySnapshot.empty) {
                console.log(`No group found with GId ${GId}.`);
                transactionComplete = false;
            } else {
                // Assuming GId is unique and only one document should match
                const groupDoc = groupQuerySnapshot.docs[0];
                const transactions = groupDoc.data().transactions || [];
                transactions.push(TId);

                // Update the document with the new transactions array
                transaction.update(groupDoc.ref, { transactions });
                transactionComplete = true;
            }
        });

        if (!transactionComplete) {
            // If transaction did not complete, return a specific code
            console.log('Transaction not completed. Group document was not updated.');
            return res.status(201).json({ code: 101 });
        }

        // If everything is successful, return a success code
        return res.status(200).json({ code: 100 });

    } catch (err) {
        console.log(err);
        res.json({
            error : err
        })
    }
}

exports.getTransactionForGroup = async (req, res) => {
    try {
        const { GId, UId } = req.body;

        // Validate GId and UId
        if (!GId || !UId) {
            return res.status(400).json({ error: 'GId and UId are required.' });
        }

        // Query the Groups collection for the document with the matching GId
        const groupQuerySnapshot = await Groups.where('GId', '==', GId).get();

        if (groupQuerySnapshot.empty) {
            return res.status(404).json({ error: 'Group not found.' });
        }

        // Assuming GId is unique and only one document should match
        const groupDoc = groupQuerySnapshot.docs[0];
        const transactionIds = groupDoc.data().transactions || [];
        const finalList = new Map();
        console.log("Transaction IDs: ", transactionIds);
        // Iterate over each transaction ID to process transaction data
        for (const transactionId of transactionIds) {
            console.log("Processing transactionId -> ", transactionId);
            const transactionRef = Transactions.doc(transactionId);
            const transactionDoc = await transactionRef.get();
            
            if (transactionDoc.exists) {
                
                const transactionData = transactionDoc.data();
                const users = transactionData.users;
                const paidBy = transactionData.paidBy;
                console.log(`Transaction ${transactionId} Users:`, users);
                
                if(paidBy === UId) {
                    users.forEach(user => {
                        const key = Object.keys(user)[0];
                        const value = user[key];
                        if(key !== UId){
                            if(finalList.has(key)) {
                                finalList.set(key, finalList.get(key) + value);
                            } else {
                                finalList.set(key, value);
                            }
                        }
                    });
                } else {
                    users.forEach(user => {
                        const key = Object.keys(user)[0];
                        const value = user[key];
                        if(key == UId) {
                            if(finalList.has(paidBy)){
                                finalList.set(paidBy, finalList.get(paidBy) - value);
                            } else {
                                finalList.set(paidBy,-value);
                            }
                            //console.log("Not paid ->",finalList.get(key));
                        }

                    });
                }
                console.log("Here ->");
            } else {
                console.log(`Transaction document ${transactionId} does not exist.`);
            }  
        }
        
        const finalListObject = Object.fromEntries(finalList);
        console.log(finalListObject);
        if(finalList.size === 0){
            return res.status(201).json({
                code : 101
            });
        } else {
            return res.status(200).json({
                code : 100,
                finalList : finalListObject
            });
        }
    } catch (err) {
        console.error('Error while fetching transactions:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


exports.invalid = async(req,res,next)=>{
    const err = new Error();
    err.message = 'Invalid Route';
    err.status = 404;
    next(err);
}