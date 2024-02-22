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
        const  groupData = ((await Groups.where("GId","==",GId).get()).docs[0].data());
        console.log(groupData);
        return groupData;
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