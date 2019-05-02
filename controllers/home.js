class Home {
  // Render homepage
  static index(req, res, next) {
    res.render('index', { title: 'Remote Job Alert' });
  }

  // Render about us page
  static aboutUs(req, res, next) {
    res.render('about');
  }

  // Dashboard
  // Render dashboard page
  static dashboard(req, res, next) {
    res.render('');
  }

 // Render manage agents page
 static manageagents(req, res, next) {
    res.render('manage_agents');
  }

 // Render manage subscribers page
 static managesubscribers(req, res, next) {
    res.render('manage_subscribers');
  }

  //User Pages
  // Render user-login page
  static userLogin(req, res, next) {
    res.render('user-login');
  }

  // Render user-signup page
  static userSignup(req, res, next) {
    res.render('user-signup');
  }

  //Render contact details page
  static contactUs(req, res, next) {
    res.render('contact');
  }

  //Render FAQs page
  static faqs(req, res, next) {
    res.render('faqs');
  }
  //Render Admin page
  static admin(req, res, next) {
    res.render('admin');
  }
  //Render Job listing
  static get_job_page(req, res, next){
      res.render('jobPage' , { title : 'Job Listing' })
  }
  // Render job details page
  // TODO?
  static job_details(req, res, next) {
    res.render('job_details', { title: 'Job Details' });
  }

  static managejobs(req, res, next) {
    res.render('manage_jobs', { title: 'Manage Jobs' });
  }

  static get_summary(req, res, next) {
    res.render('get-summary', {
      title: 'Payment Summary',
      reference: req.query.reference
    });
  }
  static get_applicant(req, res, next) {
    res.render('applicant', { title: 'Applicant Details' });
  }
  static unsubscribe(req, res, next) {
    const email = req.query.email || 'nomail';
    res.render('unsubscribe', { title: 'unsubscribe', email });
  }
  static unsubscribe_success(req, res, next) {
    res.render('unsubscribe_success', { title: 'unsubscribe success' });
  }
}

module.exports = Home;
