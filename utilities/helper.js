const {Users} = require('../model/Schema');

exports.userExists = async(email) => {
    try {
        var query = await Users.where('email','==',email).get();
        console.log(query.empty);
        return !query.empty;
    } catch (error) {
        console.log("userExists error -> ", error);
        return false;
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
        return -1;
    }
}