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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, todo: true, unparam: true */
/*global $, app, ColorSpace, ColorModel, StrokeFillProxyOptions, UndoModes, StrokeFillTargetOptions, TEXT */

var COLOR = {};

var ColorPanelActionID = {
    Swatches: 16385
};

//Holds color data for apply colors operation
COLOR.ColorDataArray = [];

//Holds color theme data for apply color themes operation
COLOR.ColorGroupDataArray = [];

COLOR.isRestrictedColor = function (color) {
    if (color.name === 'None' || color.name === 'Registration') {
        return true;
    }
    return false;
};

//input is native color
COLOR.isColorSupported = function (color) {
    // TODO: revisit if we can handle tints (using alpha)
    if (COLOR.isRestrictedColor(color) === true) {
        return false;
    }
    var colorClass = color.__class__;
    return colorClass !== 'Gradient' &&
        colorClass !== 'Tint' &&
        colorClass !== 'MixedInk';
};

//input is a single DL color representation
COLOR.isModeSupported = function (colorData) {
    // InDesign does not support grayscale and HSB. Will use alternative representation.
    return colorData && (colorData.mode === 'RGB' || colorData.mode === 'CMYK' || colorData.mode === 'Lab');
};

//input is intermediate color value
COLOR.colorToRGB = function (srcColorValue) {
    var rgbColorValue = {};

    if (srcColorValue.space === ColorSpace.RGB) {
        rgbColorValue = srcColorValue;
    } else {
        var srcVals = [];
        if (srcColorValue.space === ColorSpace.CMYK) {
            srcVals[0] = srcColorValue.vals[0] / 100.0;
            srcVals[1] = srcColorValue.vals[1] / 100.0;
            srcVals[2] = srcColorValue.vals[2] / 100.0;
            srcVals[3] = srcColorValue.vals[3] / 100.0;
        } else if (srcColorValue.space === ColorSpace.LAB) {
            srcVals[0] = srcColorValue.vals[0];
            srcVals[1] = srcColorValue.vals[1];
            srcVals[2] = srcColorValue.vals[2];
        }

        var colorsOwner = app;
        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                colorsOwner = app.activeDocument;
            }
        } catch (ignore) {}

        var dstVals = [];
        dstVals = colorsOwner.colorTransform(srcVals, srcColorValue.space, ColorSpace.RGB);
        if (dstVals.length === 3) {
            dstVals[0] = dstVals[0] * 255.0;
            dstVals[1] = dstVals[1] * 255.0;
            dstVals[2] = dstVals[2] * 255.0;
        }

        rgbColorValue = {
            name: srcColorValue.name,
            space: ColorSpace.RGB,
            model: srcColorValue.model,
            vals: dstVals
        };
    }

    return rgbColorValue;
};

//input is intermediate color value
COLOR.colorToCMYK = function (srcColorValue) {
    var cmykColorValue = {};

    if (srcColorValue.space === ColorSpace.CMYK) {
        cmykColorValue = srcColorValue;
    } else {
        var srcVals = [];
        if (srcColorValue.space === ColorSpace.RGB) {
            srcVals[0] = srcColorValue.vals[0] / 255.0;
            srcVals[1] = srcColorValue.vals[1] / 255.0;
            srcVals[2] = srcColorValue.vals[2] / 255.0;
        } else if (srcColorValue.space === ColorSpace.LAB) {
            srcVals[0] = srcColorValue.vals[0];
            srcVals[1] = srcColorValue.vals[1];
            srcVals[2] = srcColorValue.vals[2];
        }

        var colorsOwner = app;
        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                colorsOwner = app.activeDocument;
            }
        } catch (ignore) {}

        var dstVals = [];
        dstVals = colorsOwner.colorTransform(srcVals, srcColorValue.space, ColorSpace.CMYK);
        if (dstVals.length === 4) {
            dstVals[0] = dstVals[0] * 100.0;
            dstVals[1] = dstVals[1] * 100.0;
            dstVals[2] = dstVals[2] * 100.0;
            dstVals[3] = dstVals[3] * 100.0;
        }

        cmykColorValue = {
            name: srcColorValue.name,
            space: ColorSpace.CMYK,
            model: srcColorValue.model,
            vals: dstVals
        };
    }

    return cmykColorValue;
};

//input is DL color representations, and the mode we are looking for
COLOR.findRepWithMode = function (reps, mode) {
    var filteredReps = reps.filter(function (item) {
        return item.mode === mode;
    });
    if (filteredReps.length > 0) {
        return filteredReps[0];
    }
};

//input is DL color representations
COLOR.getBestColorRepresentation = function (data) {
    var colorData = data[0];

    if (COLOR.isModeSupported(colorData)) {
        return colorData;
    }
    //Default to RGB if the primary color is not supported
    return COLOR.findRepWithMode(data, 'RGB');
};

//input is DL color representations, converts to native color
COLOR.dataToSolidColor = function (data, colorGroup, colorsOwner) {
    if (data.__class__ === 'Array') {
        data = COLOR.getBestColorRepresentation(data);
    }

    return COLOR._getDocumentColorFromData(data, colorGroup, colorsOwner);
};

//input is a single DL color representation
COLOR._getDocumentColorFromData = function (colorData, colorGroup, colorsOwner) {
    var newColorValue = COLOR.dataToColorValue(colorData);
    var origSwatchName = newColorValue.name;

    if (!origSwatchName) {
        if (newColorValue.space === ColorSpace.RGB) {
            origSwatchName = 'R=' + Math.floor(newColorValue.vals[0] + 0.5) +
                ' G=' + Math.floor(newColorValue.vals[1] + 0.5) +
                ' B=' + Math.floor(newColorValue.vals[2] + 0.5);
        } else if (newColorValue.space === ColorSpace.CMYK) {
            origSwatchName = 'C=' + Math.floor(newColorValue.vals[0] + 0.5) +
                ' M=' + Math.floor(newColorValue.vals[1] + 0.5) +
                ' Y=' + Math.floor(newColorValue.vals[2] + 0.5) +
                ' K=' + Math.floor(newColorValue.vals[3] + 0.5);
        } else if (newColorValue.space === ColorSpace.LAB) {
            origSwatchName = 'L=' + Math.floor(newColorValue.vals[0] + 0.5) +
                ' a=' + Math.floor(newColorValue.vals[1] + 0.5) +
                ' b=' + Math.floor(newColorValue.vals[2] + 0.5);
        }
    }

    if (!colorsOwner) {
        colorsOwner = app;
        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                colorsOwner = app.activeDocument;
            }
        } catch (ignore) {}
    } else {
        while (colorsOwner.__class__ !== 'Document' && colorsOwner.__class__ !== 'Application') {
            colorsOwner = colorsOwner.parent;
        }
    }

    var colorToAdd = colorsOwner.colors.item(origSwatchName);

    var swatchName = origSwatchName;
    var iCount = 0;
    var found = false,
        diffColors;
    while (!found && (undefined !== colorToAdd) && (null !== colorToAdd)) {

        diffColors = (newColorValue.space !== colorToAdd.space || newColorValue.model !== colorToAdd.model);
        if (!diffColors) {
            diffColors = !COLOR.areColorValsEqual(newColorValue.vals, colorToAdd.colorValue);
        }

        if (!diffColors) {
            found = true;
        }

        if (!found || (found && colorGroup && colorToAdd.parentColorGroup !== colorGroup)) {
            ++iCount;
            swatchName = origSwatchName + ' ' + iCount;
            colorToAdd = colorsOwner.colors.item(swatchName);
            found = false;
        }
    }

    if (found) {
        return colorToAdd;
    }

    if (colorGroup) {
        return colorsOwner.colors.add({
            name: swatchName,
            model: newColorValue.model,
            space: newColorValue.space,
            colorValue: newColorValue.vals,
            parentColorGroup: colorGroup
        });
    }

    return colorsOwner.colors.add({
        name: swatchName,
        model: newColorValue.model,
        space: newColorValue.space,
        colorValue: newColorValue.vals
    });
};

//input is DL color representations, converts to intermediate color value
COLOR.dataToColorValue = function (data) {

    if (data.__class__ === 'Array') {
        data = COLOR.getBestColorRepresentation(data);
    }

    var colorValue = {};
    if (data) {
        switch (data.mode) {
        case 'RGB':
            colorValue.space = ColorSpace.RGB;
            colorValue.vals = [
                Number(data.value.r),
                Number(data.value.g),
                Number(data.value.b)
            ];
            break;
        case 'CMYK':
            colorValue.space = ColorSpace.CMYK;
            colorValue.vals = [
                Number(data.value.c),
                Number(data.value.m),
                Number(data.value.y),
                Number(data.value.k)
            ];
            break;
        case 'Lab':
            colorValue.space = ColorSpace.LAB;
            colorValue.vals = [
                Number(data.value.l),
                Number(data.value.a),
                Number(data.value.b)
            ];
            break;
        }

        colorValue.model = ColorModel.PROCESS;
        if (data.hasOwnProperty('type')) {
            if (data.type === 'spot') {
                colorValue.model = ColorModel.SPOT;
                colorValue.name = data.spotColorName;
            }
        }

        //Get the color name from the asset, if specified.
        //For spot colors, this overrides the spotColorName value.
        if (data.name) {
            colorValue.name = data.name;
        }
    }

    return colorValue;
};

//input is native color, converts to intermediate color value
COLOR.colorToColorValue = function (color) {
    try {
        if (color && COLOR.isColorSupported(color)) {
            var colorValue = {};
            colorValue.space = color.space;
            colorValue.vals = color.colorValue;
            colorValue.name = color.name;
            colorValue.model = color.model;
            return colorValue;
        }
    } catch (ignore) {
        //alert(ex);
    }
};

//input is intermediate color value, converts to DL color representations
COLOR.colorValueToData = function (colorValue) {
    var rgbProfileName = '',
        cmykProfileName = '',
        representations = [];

    try {
        rgbProfileName = app.activeDocument.rgbProfile;
        cmykProfileName = app.activeDocument.cmykProfile;
    } catch (ignore) {}

    var rgbColorValue = {};

    rgbColorValue = COLOR.colorToRGB(colorValue);
    representations.push({
        mode: 'RGB',
        value: {
            r: rgbColorValue.vals[0],
            g: rgbColorValue.vals[1],
            b: rgbColorValue.vals[2]
        },
        type: 'process',
        profileName: rgbProfileName
    });

    if (colorValue.space === ColorSpace.CMYK) {
        representations.unshift({
            mode: 'CMYK',
            value: {
                c: colorValue.vals[0],
                m: colorValue.vals[1],
                y: colorValue.vals[2],
                k: colorValue.vals[3]
            },
            type: 'process',
            profileName: cmykProfileName
        });
    }

    if (colorValue.space === ColorSpace.LAB) {
        representations.unshift({
            mode: 'Lab',
            value: {
                l: colorValue.vals[0],
                a: colorValue.vals[1],
                b: colorValue.vals[2]
            },
            type: 'process'
        });
    }

    // Handle spot color case
    if (colorValue.model === ColorModel.SPOT) {
        return representations.map(function (colorItem) {
            colorItem.type = 'spot';
            colorItem.spotColorName = colorValue.name;
            return colorItem;
        });
    }

    return representations;
};

COLOR.solidColorToData = function (color) {
    try {
        return COLOR.colorValueToData(COLOR.colorToColorValue(color));
    } catch (e) {
        var representations = [];
        return representations;
    }
};

//compares intermediate color vals arrays
COLOR.areColorValsEqual = function (colorVals1, colorVals2) {
    var len1 = colorVals1.length;
    var len2 = colorVals2.length;
    if (len1 !== len2) {
        return false;
    }

    var i;
    for (i = 0; i < len1; ++i) {
        if (Math.abs(colorVals1[i] - colorVals2[i]) > 0.005) {
            return false;
        }
    }

    return true;
};

COLOR.addColors = function () {
    try {
        var i;
        for (i = 0; i < COLOR.ColorDataArray.length; i++) {
            COLOR.dataToSolidColor(COLOR.ColorDataArray[i]);
        }
        app.openPanel(ColorPanelActionID.Swatches);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-addColors()', ex);
    }
    COLOR.ColorDataArray = [];
};

//input is DL color representations
COLOR.addColor = function (colorData, firstElement, lastElement) {
    if (firstElement !== false) {
        COLOR.ColorDataArray = [];
    }

    COLOR.ColorDataArray.push(colorData);

    if (lastElement !== false) {
        try {
            app.doScript(
                'COLOR.addColors();',
                undefined,
                undefined,
                UndoModes.entireScript,
                '$ID/New Swatch'
            );
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-addColor()', ex);
        }
    }
};

COLOR.createColorGroups = function () {
    try {
        var colorsOwner;
        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                colorsOwner = app.activeDocument;
            }
        } catch (ignore) {}

        if (!colorsOwner) {
            colorsOwner = app;
        }

        var i, j, colorGroupData, colorGroupName, colorGroupToAdd;
        for (j = 0; j < COLOR.ColorGroupDataArray.length; j++) {
            colorGroupData = COLOR.ColorGroupDataArray[j];
            colorGroupName = colorGroupData.name;

            colorGroupToAdd = colorsOwner.colorGroups.item(colorGroupName);
            if (null === colorGroupToAdd) {
                colorGroupToAdd = colorsOwner.colorGroups.add(colorGroupName);
            }

            for (i = 0; i < colorGroupData.swatches.length; i++) {
                COLOR.dataToSolidColor(colorGroupData.swatches[i], colorGroupToAdd);
            }
        }
        app.openPanel(ColorPanelActionID.Swatches);
    } catch (ex) {
        //alert(ex);
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-createColorGroups()', ex);
    }
};

//input is DL color theme representations
COLOR.createColorGroup = function (colorGroupData, firstElement, lastElement) {
    if (firstElement !== false) {
        COLOR.ColorGroupDataArray = [];
    }

    COLOR.ColorGroupDataArray.push(colorGroupData);

    if (lastElement !== false) {
        try {
            app.doScript(
                'COLOR.createColorGroups();',
                undefined,
                undefined,
                UndoModes.entireScript,
                '$ID/Create Color Group'
            );
        } catch (ex) {
            //alert(ex);
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-createColorGroup()', ex);
        }
    }
};

//input is DL color representations
COLOR.setColor = function (colorData) {
    try {
        if (app.documents.length === 0) {
            return;
        }

        var selection = app.selection;
        var i, text;
        for (i = 0; i < selection.length; ++i) {
            if (selection[i].hasOwnProperty('characters')) {
                if (selection[i].__class__ === 'TextFrame') {
                    if (app.strokeFillProxySettings.target === StrokeFillTargetOptions.formattingAffectsText) {
                        text = selection[i].texts[0];
                    }
                } else {
                    text = selection[i].texts[0];
                }

                if (text && TEXT.isLockedStory(text)) {
                    return;
                }
            }
        }

        if (app.strokeFillProxySettings.active === StrokeFillProxyOptions.FILL) {
            COLOR.setFillColor(colorData);
        }

        if (app.strokeFillProxySettings.active === StrokeFillProxyOptions.STROKE) {
            COLOR.setStrokeColor(colorData);
        }

        return colorData + ";Fill Color-setFillColor;Stroke Color-setStrokeColor";

    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-setColor()', ex);
    }
};

//input is DL color representations
COLOR.setFillColor = function (colorData) {
    try {
        app.doScript(
            'app.strokeFillProxySettings.fillColor = COLOR.dataToSolidColor(colorData);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Swatch'
        );
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-setFillColor()', ex);
    }
};

//input is DL color representations
COLOR.setStrokeColor = function (colorData) {
    try {
        app.doScript(
            'app.strokeFillProxySettings.strokeColor = COLOR.dataToSolidColor(colorData);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Swatch'
        );
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-setStrokeColor()', ex);
    }
};
