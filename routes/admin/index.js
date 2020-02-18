module.exports = function (params) {
    var app = params.app;
    const trackSevices = require("./admin.service");

    app.post("/adminuserdashboard", async (req, res) => {
        "use strict";
        try {
            var admin_details = await trackSevices.adminuserdashboard(req.body);
            if (admin_details != false) {
                app.http.customResponse(res, { success: true, message: admin_details }, 200);
            }
            else {
                app.http.customResponse(res, { success: false, message: "Error in getting Details" }, 200);
            }
        } catch (err) {
            var errorCode = 402;
            app.http.customResponse(res, err, errorCode);
        }
    });
};
