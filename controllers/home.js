class Home {
  // Render homepage
  static index(req, res, next) {
    res.render("index", { title: "DevAlert | Home", user: (typeof req.session.user == 'undefined') ? null : req.session.user,});
  }

  // Render about us page
  static aboutUs(req, res, next) {
    res.render("about", { title: "DevAlert | About Us", user: (typeof req.session.user == 'undefined') ? null : req.session.user,});
  }

  // Dashboard
  // Render dashboard page
  static dashboard(req, res, next) {
    res.render("");
  }

  // Render manage agents page
  static manageagents(req, res, next) {
    res.render("manage_agents", { title: "Manage Agents", user: (typeof req.session.user == 'undefined') ? null : req.session.user,});
  }

  // Render manage subscribers page
  static managesubscribers(req, res, next) {
    res.render("manage_subscribers", { title: "Manage Subscribers", user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }

  // Render Privacy policy page
  static privacy(req, res, next) {
    res.render("privacy", { user: (typeof req.session.user == 'undefined') ? null : req.session.user});
  }

  // Render manage payment page
  static manage_payments(req, res, next) {
    res.render("manage_payments", { title: "Manage Payment", user: (typeof req.session.user == 'undefined') ? null : req.session.user});
  }

  //User Pages
  // Render user-login page
  static userLogin(req, res, next) {
    res.render("user-login");
  }

  // Render user-signup page
  static register(req, res, next) {
    res.render("register");
  }

  //Render contact details page
  static contactUs(req, res, next) {
    res.render("contact", { user: (typeof req.session.user == 'undefined') ? null : req.session.user });
  }

  //Render contact details page
  static terms(req, res, next) {
    res.render("terms", { user: (typeof req.session.user == 'undefined') ? null : req.session.user });
  }
  //Render FAQs page
  static faqs(req, res, next) {
    res.render("faqs", { user: (typeof req.session.user == 'undefined') ? null : req.session.user});
  }
  //Render Admin page
  static admin(req, res, next) {
    res.render("admin", { user: (typeof req.session.user == 'undefined') ? null : req.session.user});
  }
  //Render Job listing
  static get_job_page(req, res, next) {
    res.render("jobPage", { title: "Job Listing", user: (typeof req.session.user == 'undefined') ? null : req.session.user });
  }
  // Render job details page
  static job_details(req, res, next) {
    res.render("job_details", { title: "Job Details", user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }

  // Render choose agent page
  static chooseAgent(req, res, next) {
    res.render("choose_agent", { title: "Choose an Agent", user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }

  static managejobs(req, res, next) {
    res.render("manage_jobs", { title: "Manage Jobs", user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }

  static get_summary(req, res, next) {
    res.render("get-summary", {
      title: "Payment Summary",
      reference: req.query.reference,
      user: (typeof req.session.user == 'undefined') ? null : req.session.user,
    });
  }
  static get_applicant(req, res, next) {
    res.render("applicant", { title: "Applicant Details", user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }
  static unsubscribe(req, res, next) {
    const email = req.query.email || "nomail";
    res.render("unsubscribe", { title: "unsubscribe", email, user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }
  static unsubscribe_success(req, res, next) {
    res.render("unsubscribe_success", { title: "unsubscribe success", user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }
  static category(req, res, next) {
    res.render("jobCategory", { title: "Full time", user: (typeof req.session.user == 'undefined') ? null : req.session.user, });
  }
}

module.exports = Home;
