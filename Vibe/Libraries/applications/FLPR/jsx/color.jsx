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

/*jslint vars: true, plusplus: true, bitwise: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, todo: true */
/*global $, app, RGBColor, ImageColorSpace, ColorConvertPurpose, CMYKColor, GrayColor, LabColor, COLOR: true */

// Global utility functions
// Picked up from Kuler extension
function toHex(val) {
    try {
        var hex = parseInt(val, 10).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    } catch (ex) {
        return "00";
    }
}

function getColorStringFromRGB(r, g, b) {
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function newRGB(r, g, b) {
    return {
        'typename': 'RGBColor',
        'mode': 'RGB',
        'red': r,
        'green': g,
        'blue': b
    };
}

function getRGBFromColorString(colorString) {
    var r = 0,
        g = 0,
        b = 0;
    try {
        colorString = colorString.substr(colorString.indexOf("#") + 1); // Strip off '#'
        // Ignore alpha
        if (colorString.length > 6) {
            colorString = colorString.substr(0, 6);
        }
        var val = parseInt(colorString, 16);
        r = (val >> 16) & 255;
        g = (val >> 8) & 255;
        b = val & 255;
    } catch (ignore) {}
    return newRGB(r, g, b);
}

COLOR = {};
COLOR.isColorSupported = function (colorObject) {
    // TODO: Check if there are any other color types that we do not support
    return colorObject.typename !== 'NoColor' &&
        colorObject.typename !== 'GradientColor' &&
        colorObject.typename !== 'PatternColor' &&
        colorObject.typename !== 'SpotColor';
};

COLOR.colorStringToData = function (colorString) {
    //If it is an unsupported color type then simply return undefined
    var color = getRGBFromColorString(colorString);
    if (!COLOR.isColorSupported(color)) {
        return;
    }

    // TODO: support for other color types
    if (color.mode !== 'RGB') {
        return;
    }

    // color is in RGB form alreadycolorStringToData
    var representations = [];
    representations.push({
        mode: 'RGB',
        value: {
            r: color.red,
            g: color.green,
            b: color.blue
        },
        type: 'process',
        profileName: 'RGB'
    });

    return representations;
};

COLOR.setColor = function (hexValue) {
    try {
        app.setActiveColor(hexValue);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-setColor()', ex);
    }
};
