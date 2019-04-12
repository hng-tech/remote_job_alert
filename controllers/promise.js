const Jobs = require("../models/jobs");
const Users = require("../models/user");
const Agent = require("../models/agent");

class Db {
    /**
     * @param {string} text
     * @returns {object} Return all 
     */
    static find(param){
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
    static findOne(param){
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
    static findOneAndUpdate(param, text){
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
    static findOneAndDelete(param){
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
    static create(param){
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

class DbAgent {
    /**
     * @param {string} text
     * @returns {object} Return all 
     */
    static find(param){
        return new Promise((resolve, reject) => {
            Agent.find(param)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        });
    }
    static create(param){
        return new Promise((resolve, reject) => {
            Agent.create(param)
            .then((res) => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
        });    
    }
};

module.exports = {
    Db,
    DbAgent
};