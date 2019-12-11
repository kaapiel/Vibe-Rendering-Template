/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2015 Adobe Systems Incorporated
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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true */
/*global $, app, BRUSH: true */

BRUSH = {};

BRUSH.loadAndSelectBrush = function (libraryName, brushName, filePath) {
    try {
        app.addBrush(libraryName, brushName, filePath);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-loadAndSelectBrush()', ex);
    }
};
