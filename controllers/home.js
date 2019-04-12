class Home {
    // Render homepage
    static index(req, res, next) {
        res.render('index', { title: 'Remote Job Alert' });
    }

    // Render about us page
    static aboutUs(req, res, next) {
        res.render("about");
    }

    //Render contact details page
    static contactUs(req, res, next) {
        res.render("contact");
    }

    //Render FAQs page
    static faqs(req, res, next) {
        res.render("faqs");
    }

    // Render job details page
    // TODO?
    static job_details(req, res, next){
        res.render('job_details', {title : 'Job Details'});
    }

    static managejobs(req, res, next){
        res.render('manage-job', {title : 'Manage Jobs'});
    }
}

module.exports = Home;