const db = require("./promise");

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
            return res.status(200).send("This is to post the Agent Details to the database");
        } catch(error){
            return res.status(400).send(error);
        }
    },
    async get_all_agents(req, res){
        const queryText = {};
        try {
            let foundAgents = await db.find(queryText);
            return res.status(200).send("View all the data for the agents");;
        } catch(error){
            return res.status(400).send(error);
        }

    },
    async get_one_agent(req, res){
        const queryText = {
            _id: req.params.agent_id
        }
        try {
            let foundAgent = await db.findOne(queryText);
            return res.status(200).send("View the details of One Agent");
        } catch(error){
            return res.status(400).send(error);
        }

    },
    async edit_agent(req, res){
        const queryText = {
            _id: req.params.agent_id
        };
        try {
            let foundAgent = await db.findOne(queryText);
            return res.status(200).send("This route edits the agent's details");
        } catch(error){
            return res.status(400).send(error);
        }
    },
    async update_agent(req, res){
        const queryText = {
            _id: req.params.agent_id
        };
        const updateText = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            job_role: req.body.job_role
        }
        try {
            let updatedAgent = await db.findOneAndUpdate(queryText, updateText);
            return res.status(200).send("This Route updates the Agent details edited");
        } catch(error){
            return res.status(400).send(error);
        }
    },
    async delete_agent(req, res){
        const queryText = {
            _id: req.params.agent_id
        };
        try {
            let deletedAgent = await db.findOneAndDelete(queryText);
            return res.status(200).redirect("/");
        } catch(error){
            return res.status(400).send(error);
        }
    }
}

module.exports = Agent;