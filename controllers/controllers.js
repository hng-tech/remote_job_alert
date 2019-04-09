const db = require("./promise");

const Jobs = {
    async create(req, res){
        const queryText = {
            advert_header: req.body.advert_header,
            company_name: req.body.company_name,
            job_title: req.body.job_title,
            job_link: req.body.job_link,
            job_description: req.body.job_description,
            job_category: req.body.job_category,
            location: req.body.location,
        };
        try {
            let createdJob = await db.create(queryText);
            console.log(createdJob);
            return res.status(201).redirect('/');
        } catch(error) {
            return res.status(400).send(error);
        }

    },
    async get_all(req, res){
        const queryText = {};
        try {
            let foundJobs = await db.default.find(queryText);
            return res.status(200).send(foundJobs);;
        } catch(error){
            return res.status(400).send(error);
        }

    },
    async get_one(req, res){
        const queryText = {
            _id: req.params.job_id
        }
        try {
            let foundJob = await db.default.findOne(queryText);
            return res.status(200).json(foundJob);;
        } catch(error){
            return res.status(400).send(error);
        }

    },
    async edit(req, res){
        const queryText = {
            _id: req.params.job_id
        };
        try {
            let foundJob = await db.default.findOne(queryText);
            console.log(foundParcel);
            return res.status(200).json(foundJob);
        } catch(error){
            return res.status(400).send(error);
        }
    },
    async update_job(req, res){
        const queryText = {
            _id: req.params.job_id
        };
        const updateText = {
            advert_header: req.body.advert_header,
            company_name: req.body.company_name,
            job_title: req.body.job_title,
            job_link: req.body.job_link,
            job_description: req.body.job_description,
            job_category: req.body.job_category,
            location: req.body.location,
        }
        try {
            let updatedJob = await db.default.findOneAndUpdate(queryText, updateText);
            return res.status(200).json(updatedJob);
        } catch(error){
            return res.status(400).send(error);
        }
    },
    async cancel_job(req, res){
        const queryText = {
            _id: req.params.job_id
        };
        try {
            let foundParcel = await db.default.findOneAndDelete(queryText);
            console.log(deletedParcel);
            return res.status(200).redirect("/");
        } catch(error){
            return res.status(400).send(error);
        }
    }
}

module.exports = Jobs;