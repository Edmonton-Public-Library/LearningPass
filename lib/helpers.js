

// Helpers object.
const helpers = {};

// Takes an arbitrary string and try to parse it into JSON, but 
// handle errors gracefully.
// if something goes wrong return an empty object.
helpers.parseJsonToObject = function(str){
    try{
        var obj = JSON.parse(str);
        return obj;
    } catch(e) {
        console.log('Error invalid JSON in str: "',str,'"');
        return {};
    }
};

module.exports = helpers;
