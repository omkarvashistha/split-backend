const {Users,Groups, userGroupMapping} = require('../model/Schema');

exports.userExists = async(email) => {
    try {
        var query = await Users.where('email','==',email).get();
        console.log(query.empty);
        return !query.empty;
    } catch (error) {
        console.log("userExists error -> ", error);
        throw error;
    }
}

exports.checkUserCredentials = async(email,password) => {
    try {
        var query = await Users.where('email','==',email).where('password','==',password).get();
        return !query.empty;
    } catch (error) {
        throw error;
    }
}

exports.getUserId = async() => {
    try {
        const querySnapshot = await Users.get();
        const totalDocuments = querySnapshot.size;

        if(totalDocuments === 0){
            return "U100";
        } else {
            return "U" + (100 + totalDocuments + 1);
        }

    } catch (error) {
        throw error;
    }
}

exports.getUserIdFromEmail = async(email)=>{
    try {
        const userIdRes = await Users.where('email','==',email).get();
        if(userIdRes.empty){
            return null;
        }
        return userIdRes.docs[0].data().UId;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to get the username (UName) from the User collection by UId.
 * @param {string} userId - The UId of the user to fetch the username for.
 * @returns {Promise<string|null>} - The username (UName) if found, otherwise null.
 */
exports.getUserNameFromId = async(userId) => {
    try {
        // Query the User collection for a document where UId matches userId
        const userQuerySnapshot = await Users.where('UId', '==', userId).get();

        if (userQuerySnapshot.empty) {
            console.log(`No user found with UId ${userId}.`);
            return null; // No user found
        }

        // Assuming UId is unique and only one document should match
        const userDoc = userQuerySnapshot.docs[0];
        return userDoc.data().UName; // Return the UName
    } catch (err) {
        console.error(`Error fetching username for UId ${userId}:`, err);
        return null; // In case of error, return null
    }
}

/********************************* GROUP APIs ************************* */

exports.createGroupId = async()=>{
    try {
        const querySnapshot = await Groups.get();
        const totalDocuments = querySnapshot.size;
        console.log(totalDocuments);
        if(totalDocuments == 0){
            return "G1";
        } else {
            return "G" + (totalDocuments + 1);
        }
    } catch (error) {
        throw error;
    }
}

exports.getGroupUserMappingId = async()=>{
    try {
        const totalDocuments = (await userGroupMapping.get()).size;
        
        if(totalDocuments === 0){
            
            return "UGM1";
        }
        return"UGM" + (totalDocuments + 1); 
    } catch (error) {
        throw error;
    }
}

exports.getGroupDataFromId = async(GId) => {
    try {
        const  groupData = ((await Groups.where("GId","==",GId).get()));
        if(!groupData.empty) {
            const doc = groupData.docs[0];
            return doc.data();
        }
        return;
    } catch (error) {
        throw error;
    }
}

exports.getFullDate = ()=> {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // JavaScript months start at 0
    const day = today.getDate();
  
    return `${day}/${month}/${year}`;
}