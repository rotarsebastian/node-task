module.exports = {
    sendErrorMessage: function (res, sErrorMessage) {
        res.send(`{"status": 0, "message": "${sErrorMessage}"}`);
    },
    sendSuccessMessage: function (res, sSuccessMessage, dataType, data) {
        res.send(`{"status": 1, "message": "${sSuccessMessage}", "${dataType}": ${data}}`);
    }
};