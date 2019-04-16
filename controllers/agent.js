const db = require("./promise").DbAgent;

const validateAgentQueryText = require('../validation/agent');


const Agent = {

  
    async create_agent(req, res){

        const { errors, isValid } = validateAgentQueryText(req.body);

		// Check Validation
		if (!isValid) {
			return res.status(400).json(errors);
		}

        const queryText = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number
        }
        try {
            let createdAgent = await db.create(queryText);
            return res.status(200).redirect("/");
        } catch(error){
            return res.status(400).send(error);
        }
    },
    async get_all_agents(req, res){
        const queryText = {};
        try {
            let foundAgents = await db.find(queryText);
            return res.status(200).render('agents', {agents: foundAgents});
        } catch(error){
            return res.status(400).send(error);
        }

    }
}

module.exports = Agent;