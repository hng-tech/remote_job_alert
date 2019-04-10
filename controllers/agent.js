const db = require("./promise").DbAgent;

const Agent = {
    async create_agent(req, res){
        const queryText = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            job_role: req.body.job_role
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