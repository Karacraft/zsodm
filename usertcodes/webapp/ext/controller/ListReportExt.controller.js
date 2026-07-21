sap.ui.define([
    "sap/m/MessageToast",
    "sap/base/Log"
], function(MessageToast, Log) {
    "use strict";

    return {
        sendEmail: function(oEvent) {
            
            var oExtensionAPI = this.extensionAPI;

            oExtensionAPI.invokeActions("/send_email", [], {
                // optional parameters if needed
            })
            .then(function (aResponse) {
              
                var oResponse = aResponse[0]; // always array
                var oHeader = (oResponse && oResponse.response && oResponse.response.response && oResponse.response.response.headers) 
                    ? oResponse.response.response.headers["sap-message"] 
                    : null;
                
                if (oHeader) {
                    try {
                        var oMessage = JSON.parse(oHeader); // parse the header to get the message details
                        if (oMessage.severity === "success") {
                            MessageToast.show("Success: " + oMessage.message);
                        } else {
                            MessageToast.show("Error: " + oMessage.message);
                        }
                    } catch (oParseError) {
                        Log.error("Failed to parse sap-message header", oParseError);
                        MessageToast.show("Email action completed.");
                    }
                } else {
                    MessageToast.show("Email action completed.");
                }

            })
            .catch(function (oError) {
                MessageToast.show("Error while sending email.");
                Log.error(oError);
            });

        }
    };
});
