const DbPreference = require('./promise').DbPreference;
const Jobs = require('../controllers/controllers').Jobs;

async function getJobRoles(req, res, next) {
    var roles = ['FrontEnd', 'DevOps', 'FullStack', 'UI', 'UX' ];

    res.json({
        count: roles.length,
        data: roles
    });
}

async function getJobLevels(req, res, next) {
    var levels = ['Entry-Level', 'Senior', 'Internship'];

    res.json({
        count: levels.length,
        data: levels
    });
}

async function getJobTypes(req, res, next) {
    var jobTypes = ['Full-Time', 'Part-Time', 'Remote'];

    res.json({
        count: jobTypes.length,
        data: jobTypes
    });
}

async function getJobLocations(req, res, next) {
    var jobLocations = ['Nigeria', 'United States'];

    res.json({
        count: jobLocations.length,
        data: jobLocations
    });
}

async function getJobStack(req, res, next) {
    var stack = ['Java', 'Python'];

    res.json({
        count: stack.length,
        data: stack
    });
}

async function getJobFrequency(req, res, next) {
    var frequency = ['Daily', 'Weekly', 'Monthly'];

    res.json({
        count: frequency.length,
        data: frequency
    });
}

async function savePreference(req, res, next) {
    try {
    	var payRange = req.body.pay_range.split('-');
      	var minPay = parseFloat(payRange[0].trim());
    	var maxPay = parseFloat(payRange[1].trim());

    	const queryText = {
      		user_id: req.body.user_id,
      		job_roles: req.body.roles.join("|||"),
      		job_types: req.body.types.join("|||"),
      		job_levels: req.body.levels.join("|||"),
      		locations: req.body.locations.join("|||"),
      		stack: req.body.stack.join("|||"),
      		min_pay: minPay,
      		max_pay: maxPay,
      		frequency: req.body.frequency
    	};

    	if (req.body.preference_id) {
      		queryText._id = req.body.preference_id;
      		var savedPreference = await DbPreference.findOneAndUpdate(queryText);
   		}
    	else {
      		var savedPreference = await DbPreference.create(queryText);
    	}
    	req.flash('success', 'Job preferences saved successfully');
    	return res.redirect('/');
  	}
  	catch (err) {
    	console.error(err);
    	next(err);
  	}
}

async function getJobsForUser(id) {
	var allJobs = await Jobs.fetchData;
	var jobFilter = await DbPreference.find({ '_id': id });
	if (jobFilter) {
		var filteredJobs = [];

		for (var job in allJobs) {
			var isJobAdded = false; // To ensure that a job that meets multiple conditions is not added more than once

			//Get jobs using roles
			if (jobFilter.job_roles) {
				var jobRoles = jobFilter.job_roles.split('|||');
				for(var role in jobRoles) {
					if (job["title"].includes(role)) {
						filteredJobs.push(job);
						isJobAdded = true;
						break;
					}
				}
			}

			//Get jobs using job types
			if (jobFilter.job_types && !isJobAdded) {
				var jobTypes = jobFilter.job_types.split('|||');
				for(var type in jobTypes) {
					if (job["type"].includes(type)) {
						filteredJobs.push(job);
						isJobAdded = true;
						break;
					}
				}
			}

			//Get jobs using levels
			if (jobFilter.job_levels && !isJobAdded) {
				var jobLevels = jobFilter.job_levels.split('|||');
				for (var level in jobLevels) {
					if (job["title"].includes(level)) {
						filteredJobs.push(job);
						isJobAdded = true;
						break;
					}
				}
			}

			//Get jobs using location
			if (jobFilter.locations && !isJobAdded) {
				var jobLocations = jobFilter.locations.split('|||');
				for (var location in jobLocations) {
					if (job["location"].includes(location)) {
						filteredJobs.push(job);
						isJobAdded = true;
						break;
					}
				}
			}

			//Get jobs using stack
			if (jobFilter.stack && !isJobAdded) {
				var jobStack = jobFilter.stack.split('|||');
				for (var stack in jobStack) {
					if (job["title"].includes(stack) || job["description"].includes(stack)) {
						filteredJobs.push(job);
						isJobAdded = true;
						break;
					}
				}
			}

			//Get jobs using minimum pay 
			if (jobFilter.min_pay && !isJobAdded) {
				//Check for minimum pay
			}

			//Get jobs using maximum pay
			if (jobFilter.max_pay && !isJobAdded) {
				//Check for maximum pay
			}
		}

		return filteredJobs;
	}
	return allJobs;
}

module.exports = {
  	getJobRoles,
  	getJobLevels,
  	getJobTypes,
  	getJobStack,
  	getJobLocations,
  	getJobFrequency,
  	savePreference
};