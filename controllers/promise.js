const Jobs = require("../models/jobs");
const Users = require("../models/user");

class Db {
    /**
     * @param {string} text
     * @returns {object} Return all 
     */
    find(param){
        return new Promise((resolve, reject) => {
            Jobs.find(param)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
    findOne(param){
        return new Promise((resolve, reject) => {
            Jobs.findOne(param)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
    findOneAndUpdate(param, text){
        return new Promise((resolve, reject) => {
            Jobs.findOneAndUpdate(param, text)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
    findOneAndDelete(param){
        return new Promise((resolve, reject) => {
            Jobs.findOneAndDelete(param)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
    create(param){
        return new Promise((resolve, reject) => {
            Jobs.create(param)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        });    
    }
};

module.exports = Db;