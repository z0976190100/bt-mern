const proxy = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        proxy(
            [
                "/api/users/current",
                "/api/users/login",
                "/api/profiles",
                "/auth/google"
            ],
            {
                target: "http://localhost:5000/"
            }
        )
    );
};


// "proxy": [{"target":"http://localhost:5000/"},{"target":"http://localhost:5000/auth"}],