const DbPreference = require('./promise').DbPreference;
var Moment = require('moment');
var MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const fetch = require("node-fetch");

function getJobRoles() {
    var roles = ['Back End', 'DevOps', 'Front End', 'Full-Stack', 'Network Architect', 'Network Engineer', 'Project Manager', 'Security Engineer', 'Software Engineer', 'UI', 'UX', 'Web Developer'];

    return roles;
}

function getJobLevels() {
    var levels = ['Entry Level', 'Junior', 'Senior', 'Internship'];

    return levels;
}

function getJobTypes() {
    var jobTypes = ['Full Time', 'Part Time'];

    return jobTypes;
}

function getJobLocations() {
    var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
	,"Puerto Rico","Qatar","Remote","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
	,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"]; //Ref: https://gist.github.com/incredimike/1469814

    return country_list;
}

function getJobStack() {
    var stack = ['ABCL', 'ALF', 'ALGOL', 'Ada', 'Afnix', 'Agora', 'AppleScript', 'AutoIt', 'Awk', 'BASIC', 'BETA', 'BeanShell', 'Bliss', 'C', 'C#', 'C++', 'CLEO', 'CLIST', 'COBOL', 'Cecil', 'Charity', 'ChucK', 'Cilk', 'Clean', 'Cobra', 'ColdFusion', 'Component Pascal', 'Concurrent Pascal', 'Curl', 'Curry', 'D', 'DASL', 'DIBOL', 'E', 'Eiffel', 'Erlang', 'F#', 'F-Script', 'Forth', 'Fortran', 'Fril', 'Frink', 'Game Maker Language', 'HTML', 'Haskell', 'HyperTalk', 'ICI', 'IO', 'J', 'JASS', 'JOVIAL', 'Janus', 'Java', 'Joule', 'Joy', 'Kite', 'Lava', 'Leda', 'Limbo', 'Lisaac', 'Lisp', 'Lua', 'M', 'MATLAB', 'ML', 'MOO', 'Maya Embedded Language', 'Modula-2', 'Mondrian', 'Moto', 'Nemerle', 'OPAL', 'OPS5', 'Oberon', 'Object-Z', 'Objective-C', 'Obliq', 'Occam', 'Oxygene', 'Oz', 'PCASTL', 'PHP', 'PL/C', 'PL/I', 'Pascal', 'Perl', 'Pict', 'Pliant', 'Poplog', 'PostScript', 'Prograph', 'Prolog', 'Python', 'Q', 'REBOL', 'REXX', 'ROOP', 'RPG', 'Rapira', 'Revolution', 'Ruby', 'S-Lang', 'SALSA', 'SGML', 'SMALL', 'SR', 'Scala', 'Self', 'Slate', 'Smalltalk', 'Spin', 'Tcl', 'Turing', 'VBScript', 'Visual Basic', 'Visual FoxPro', 'Windows PowerShell', 'XHTML', 'XL', 'XML', 'XOTcl'];

    return stack;
}

function getJobFrequency() {
    var frequency = ['Daily', 'Weekly', 'Monthly'];

    return frequency
}

async function savePreference(req, res, next) {
    try {
    	var payRange = req.body.pay_range.split('-');
      	var minPay = parseFloat(payRange[0].trim());
    	var maxPay = parseFloat(payRange[1].trim());

		var userId = "12"; //To be changed to get logged in user id from session
		
		console.log(req.body.roles);

    	const queryText = {
			user_id: userId,
      		job_roles: Array.isArray(req.body.roles) ? req.body.roles.join("|||") : req.body.roles,
      		job_types: Array.isArray(req.body.types) ? req.body.types.join("|||") : req.body.types,
      		job_levels: Array.isArray(req.body.levels) ? req.body.levels.join("|||") : req.body.levels,
      		locations: Array.isArray(req.body.locations) ? req.body.locations.join("|||") : req.body.locations,
      		stack:  Array.isArray(req.body.stack) ? req.body.stack.join("|||") : req.body.stack,
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

async function preferences(req, res, next) {
	try {
		//var userId = "12"; //To be changed to get logged in user id from session

		//var userPreference = await DbPreference.find({ user_id: userId });

		res.render('jobPreference', {
			//current: userPreference,
			roles: getJobRoles(),
			levels: getJobLevels(),
			types: getJobTypes(),
			stack: getJobStack(),
			locations: getJobLocations(),
			frequency: getJobFrequency(),
		});
	}
	catch (err) {
		console.error(err);
    	next(err);
	}
}

async function getJobsForUser(id) {
	let data = await fetch("https://jobs.github.com/positions.json?location=remote");
    let allJobs = await data.json();
	var jobFilter = await DbPreference.findOne({ 'user_id': id });
	console.log(jobFilter);
	if (jobFilter) {

		//Use Frequency to filter jobs
		var startDate;
		var endDate;
		switch (jobFilter.frequency) {
			case 'Daily': 
				startDate = moment().utc().startOf('day');
				endDate =  moment().utc().endOf('day');
			case 'Weekly':
				startDate = moment().utc().startOf('week');
				endDate =  moment().utc().endOf('week');
			default:
				startDate = moment().utc().startOf('month');
				endDate =  moment().utc().endOf('month');
		}

		var jobsInDateRange = allJobs.filter(function(a){
			var range = moment.range(startDate, endDate);
			return range.contains(new Date(a.created_at));
		});

		var filteredJobs = [];

		/*
			Loop through all the jobs and select only jobs that fit all the remaining preferences of the user
		*/
		for (var jobIndex in jobsInDateRange) {
			var job = jobsInDateRange[jobIndex];
			console.log(job);
			var isValidForFilter = false;

			//Get jobs using roles
			if (jobFilter.job_roles) {
				var jobRoles = jobFilter.job_roles.split('|||');
				for(var roleIndex in jobRoles) {
					var role = jobRoles[roleIndex];
					if (job["title"].toLowerCase().includes(role.toLowerCase())) {
						isValidForFilter = true;
						break;
					}
				}

				if (!isValidForFilter)
					continue;
				isValidForFilter = false;
			}
			console.log("Passed job roles");

			//Get jobs using job types
			if (jobFilter.job_types) {
				var jobTypes = jobFilter.job_types.split('|||');
				for(var typeIndex in jobTypes) {
					var type = jobTypes[typeIndex];
					if (job["type"].toLowerCase().includes(type.toLowerCase())) {
						isValidForFilter = true;
						break;
					}
				}

				if (!isValidForFilter)
					continue;
				isValidForFilter = false;
			}
			console.log("Passed job types");

			//Get jobs using levels
			if (jobFilter.job_levels) {
				var jobLevels = jobFilter.job_levels.split('|||');
				for (var levelIndex in jobLevels) {
					var level = jobLevels[levelIndex];
					if (job["title"].toLowerCase().includes(level.toLowerCase())) {
						isValidForFilter = true;
						break;
					}
				}

				if (!isValidForFilter)
					continue;
				isValidForFilter = false;
			}
			console.log("Passed job levels");

			//Get jobs using location
			if (jobFilter.locations) {
				var jobLocations = jobFilter.locations.split('|||');
				for (var locationIndex in jobLocations) {
					var location = jobLocations[locationIndex];
					if (job["location"].toLowerCase().includes(location.toLowerCase()) || job["location"].toLowerCase().includes("remote")) {
						isValidForFilter = true;
						break;
					}
				}

				if (!isValidForFilter)
					continue;
				isValidForFilter = false;
			}
			console.log("Passed job location");

			//Get jobs using stack
			if (jobFilter.stack) {
				var jobStack = jobFilter.stack.split('|||');
				for (var stackIndex in jobStack) {
					var stack = jobStack[stackIndex];
					if (job["title"].toLowerCase().includes(stack.toLowerCase()) || job["description"].includes(stack)) {
						isValidForFilter = true;
						break;
					}
				}

				if (!isValidForFilter)
					continue;
				isValidForFilter = false;
			}
			console.log("Passed job stack");

			//Get jobs using minimum pay 
			if (jobFilter.min_pay) {
				//Check for minimum pay
				isValidForFilter = true;
			}

			//Get jobs using maximum pay
			if (jobFilter.max_pay) {
				//Check for maximum pay
				isValidForFilter = true;
			}

			filteredJobs.push(job);
		}

		return filteredJobs;
	}
	return allJobs;
}

module.exports = {
	preferences, 
	savePreference,
	getJobsForUser
};