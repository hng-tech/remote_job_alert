class Home {
    // Render homepage
    static index(req, res, next) {
        res.render('index', { title: 'Remote Job Alert' });
    }

    // Render about us page
    static aboutUs(req, res, next) {
        res.render("about");
    }

    

    //User Pages
     // Render user-login page
     static userLogin(req, res, next) {
        res.render("user-login");
    }

    // Render user-signup page
    static userSignup(req, res, next) {
        res.render("user-signup");
    }



    //Render contact details page
    static contactUs(req, res, next) {
        res.render("contact");
    }

    //Render FAQs page
    static faqs(req, res, next) {
        res.render("faqs");
    }

    // Render Job Listing page
    static get_job_listing(req, res) {
        res.render('job-listing', {title: 'Job Listing'});
    }
    //Render Admin page
    static admin(req, res, next) {
        res.render("admin");
    }

    // Render job details page
    // TODO?
    static job_details(req, res, next){
        res.render('job_details', { title : 'Job Details' });
    }

    static managejobs(req, res, next){
        res.render('manage-job', { title : 'Manage Jobs' });
    }

    static get_summary(req, res, next){
        res.render('get-summary', { title : 'Payment Summary', reference: req.query.reference });
    }
    static get_applicant(req, res, next){
        res.render('applicant', {title: 'Applicant Details'});
    }
}

module.exports = Home;