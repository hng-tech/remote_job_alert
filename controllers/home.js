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
}

module.exports = Home;