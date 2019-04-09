class Jobs {
    // Fetch all the available jobs and send to page
    static index(req, res, next) {
        res.send("List all available jobs");
    }

    //Retrieve email address and add to subscription list
    static jobAlertSubscription(req, res, next) {
        const { email } = req.body;

        // Add to mailing list

        res.redirect('/');
    }

    //Pay agent to apply for you

}

module.exports = Jobs;