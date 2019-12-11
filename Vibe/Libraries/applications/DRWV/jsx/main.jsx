/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2013 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, unparam: true, todo: true */
/*globals $, app, COLOR, dw */

$._ADBE_LIBS_DRWV = {
    getTooltipState: function () {
        // TODO: Implement this based on the settings in your app (whether tooltips are enabled).
        return 'true';
    },

    getIMSUserID: function () {
        //return dw.getIMSUserID();
        return undefined;
    },

    isAnalyticsEnabled: function () {
        return dw.isAnalyticsEnabled();
    },

    getCurrentState: function () {
        // TODO: Implement this to return an object describing the state of the application - e.g. the
        // currently selected layer or object, and anything else
        return;
    },

    isFontAvailable: function (style) {
        // TODO: Implement a function that returns true or false, depending on whether the given font is available
        // in your application.
        return 'true';
    },

    copyRGB: function (rgbColorData) {
        dw.ccLib.copyRGB(rgbColorData);
    },

    copyHex: function (hexColorData, isLeftClick) {
        dw.ccLib.copyHex(hexColorData, isLeftClick);
    },

    placeAsset: function (filePath, isPSD, libraryName, itemName, elementRef, modifiedTime, creationTime, adobeStockId, adobeStockLicense, isLinked, onlyDownload) {
        try {
            dw.ccLib.placeAsset(filePath, libraryName, itemName, elementRef, modifiedTime, isLinked, onlyDownload);
        } catch (ignore) {

        }
    },
    setLibraryCollection: function (data) {
        dw.ccLib.setCloudLibrariesData(data);
    },
    notifyFetchSVGRenditionComplete: function (data) {
        dw.ccLib.onSVGRequestComplete(data);
    },
    getUserData: function () {
        try {
            if (dw && dw.ccx) {
                return dw.ccx.getCCXUserJSONData();
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('DRWV.jsx-getCCXUserJSONData()', ex);
        }
    }
};
