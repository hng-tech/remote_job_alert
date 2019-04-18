const db = require("./promise").DbApplicant;

const validateApplicantQueryText = require('../validation/applicant');


const Applicant = {

  
    async create_applicant(req, res){

        const { errors, isValid } = validateApplicantQueryText(req.body);

		// Check Validation
		if (!isValid) {
			req.flash("errors", "There are errors in your details filled, Retry");
		}

        const queryText = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            number: req.body.number,
            experience: req.body.experience,
            tech_stack: req.body.tech_stack,
            linkedin_profile: req.body.linkedin_profile,
            github_profile: req.body.github_profile,
            website: req.body.website
        }
        try {
            let createdApplicant = await db.create(queryText);
            req.flash("success", "Your Details have been Submitted Successfully");
            return res.redirect("/");
        } catch(error){
            req.flash("errors", "There are errors in your details filled, Retry");
            return res.send(error);
        }
    },
    async get_all(req, res){
        const queryText = {};
        try {
            let foundApplicant = await db.find(queryText);
            return res.status(200).render('applicant_data', {content: foundApplicant});
        } catch(error){
            return res.status(400).send(error);
        }

    }
}

module.exports = Applicant;