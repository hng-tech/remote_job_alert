const Jobs = require('../models/jobs');
const Users = require('../models/user');
// const Agent = require('../models/agent');
const NewAgent = require('../models/newAgent');
const Applicant = require('../models/applicant');

class Db {
	/**
	 * @param {string} text
	 * @returns {object} Return all
	 */
	static find(param) {
		return new Promise((resolve, reject) => {
			Jobs.find(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOne(param) {
		return new Promise((resolve, reject) => {
			Jobs.findOne(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOneAndUpdate(param, text) {
		return new Promise((resolve, reject) => {
			Jobs.findOneAndUpdate(param, text)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOneAndDelete(param) {
		return new Promise((resolve, reject) => {
			Jobs.findOneAndDelete(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static create(param) {
		return new Promise((resolve, reject) => {
			Jobs.create(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	static insertMany(param) {
		return new Promise((resolve, reject) => {
			Jobs.insertMany(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static countDocuments(param) {
		return new Promise((resolve, reject) => {
			Jobs.countDocuments(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}

class DbApplicant {
	/**
	 * @param {string} text
	 * @returns {object} Return all
	 */
	static find(param) {
		return new Promise((resolve, reject) => {
			Applicant.find(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static create(param) {
		return new Promise((resolve, reject) => {
			Applicant.create(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	static findOneAndDelete(param) {
		return new Promise((resolve, reject) => {
			Applicant.findOneAndDelete(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}

class Subscribe {
	/**
	 * @param {string} text
	 * @returns {object} Return all
	 */
	static find(param) {
		return new Promise((resolve, reject) => {
			Users.find(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOne(param) {
		return new Promise((resolve, reject) => {
			Users.findOne(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOneAndUpdate(param, text) {
		return new Promise((resolve, reject) => {
			Users.findOneAndUpdate(param, text)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOneAndDelete(param) {
		return new Promise((resolve, reject) => {
			Users.findOneAndDelete(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static create(param) {
		return new Promise((resolve, reject) => {
			Users.create(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	static insertMany(param) {
		return new Promise((resolve, reject) => {
			Users.insertMany(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static countDocuments(param) {
		return new Promise((resolve, reject) => {
			Users.countDocuments(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static drop(param) {
		return new Promise((resolve, reject) => {
			Users.drop(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}

class AgentDb {
	/**
	 * @param {string} text
	 * @returns {object} Return all
	 */
	static find(param) {
		return new Promise((resolve, reject) => {
			NewAgent.find(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOne(param) {
		return new Promise((resolve, reject) => {
			NewAgent.findOne(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOneAndUpdate(param, text) {
		return new Promise((resolve, reject) => {
			NewAgent.findOneAndUpdate(param, text)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static findOneAndDelete(param) {
		return new Promise((resolve, reject) => {
			NewAgent.findOneAndDelete(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static create(param) {
		return new Promise((resolve, reject) => {
			NewAgent.create(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	static insertMany(param) {
		return new Promise((resolve, reject) => {
			NewAgent.insertMany(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static countDocuments(param) {
		return new Promise((resolve, reject) => {
			NewAgent.countDocuments(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
	static drop(param) {
		return new Promise((resolve, reject) => {
			NewAgent.drop(param)
				.then(res => {
					resolve(res);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}

module.exports = {
	Db,
	DbApplicant,
	Subscribe,
	AgentDb,
};
