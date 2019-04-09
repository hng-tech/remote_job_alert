class Home {
    // Render homepage
    static index(req, res, next) {
        res.render('index', { title: 'Remote Job Alert' });
    }

    // Render about us page
    static aboutUs(req, res, next) {
        res.send("About us page");
    }

    //Render contact details page
    static contactUs(req, res, next) {
        res.send("Contact us page");
    }

    // Render job details page
    static job_details(req, res, next){
        res.render('job_details', {title : 'Job Details'});
    }
}

module.exports = Home;