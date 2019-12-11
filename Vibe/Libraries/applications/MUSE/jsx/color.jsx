/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, unparam: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File, DocumentMode,
         TypeUnits, ActionList, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, PSKey, PSClass, PSString, PSType, PSEnum, PSEvent, PSUnit, descriptorToColorData, sTID, cTID */

var COLOR = {};

COLOR.isModeSupported = function (colorData) {
    return colorData && (colorData.mode === 'RGB' || colorData.mode === 'HSB');
};

COLOR.findRepWithMode = function (reps, mode) {
    var filteredReps = reps.filter(function (item) {
        return item.mode === mode;
    });
    if (filteredReps.length > 0) {
        return filteredReps[0];
    }
};

//input is DL color representations, converts to intermediate color value
COLOR.dataToColorValue = function (data) {
    var colorValue = {};
    if (data) {
        switch (data.mode) {
        case 'RGB':
            colorValue.space = 'RGB';
            colorValue.vals = [data.value.r, data.value.g, data.value.b];
            colorValue.profileName = data.profileName;
            app.log("rgb initialized");
            break;
        case 'HSB':
            colorValue.space = 'HSB';
            colorValue.vals = [data.value.h, data.value.s, data.value.b];
            colorValue.profileName = data.profileName;
            app.log("hsb initialized");
            break;
        case 'CMYK':
            colorValue.space = 'CMYK';
            colorValue.vals = [data.value.c, data.value.m, data.value.y, data.value.k];
            colorValue.profileName = data.profileName;
            break;
        }

        if (data.name) {
            colorValue.name = data.name;
        }
    }

    return colorValue;
};

COLOR.dataToSolidColor = function dataToSolidColor(data) {
    //If passed an array of representations then first select the best representation
    var bestRepresentation = data;
    if (Array.isArray(data)) {
        bestRepresentation = COLOR.getBestColorRepresentation(data);
    }
    var color = COLOR.dataToColorValue(bestRepresentation);
    //$._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-dataToSolidColor()', color);
    return color;
};

COLOR.getBestColorRepresentation = function (data) {
    if (COLOR.isModeSupported(data)) {
        return data;
    }
    //Default to RGB if the primary color is not supported
    return COLOR.findRepWithMode(data, 'RGB');
};

COLOR.getLayerColor = function () {
    try {
        return JSON.stringify(JSXGlobals.colorModifiedByUser);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-getLayerColor()', ex);
    }
};

COLOR.replaceColor = function (colorData) {
    try {
        var color = COLOR.dataToSolidColor(colorData);
        if (color !== undefined) {
            var modifiedColor;
            if (color.space === 'RGB' || color.space === 'HSB') {
                modifiedColor = app.showColorPicker(color.space, color.vals[0], color.vals[1], color.vals[2], color.profileName);
            }
            var representations = [];
            if (modifiedColor[0] === 'RGB') {
                representations.push({
                    mode: modifiedColor[0],
                    value: {
                        r: modifiedColor[1],
                        g: modifiedColor[2],
                        b: modifiedColor[3]
                    },
                    profileName: modifiedColor[4],
                    type: 'process'
                });
                JSXGlobals.colorModifiedByUser = representations;
                return 'true';
            }
            if (modifiedColor[5] === 'HSB') {
                representations.push({
                    mode: modifiedColor[5],
                    value: {
                        h: modifiedColor[6],
                        s: modifiedColor[7],
                        b: modifiedColor[8]
                    },
                    profileName: modifiedColor[9],
                    type: 'process'
                });
                JSXGlobals.colorModifiedByUser = representations;
                return 'true';
            }
        } else {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-color show color picker() color undefined');
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-replaceColor()', ex);
    }
    return 'false';
};

//input is DL color representations
COLOR.addSwatch = function (colorData) {
    try {
        if (app.documents.length > 0) {
            app.log("called addSwatch");
            var selection = app.selection;
            if (selection) {
                var color = COLOR.dataToSolidColor(colorData);
                if (color.space === 'RGB') {
                    selection.setStrokeOrFill(color.space, color.vals[0], color.vals[1], color.vals[2], color.profileName, color.name, 'ADDSWATCH');
                }
            }
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-addSwatch()', ex);
    }
};

COLOR.setColor = function (colorData) {
    try {
        if (app.documents.length > 0) {
            app.log("called setColor");
            var selection = app.selection;
            if (selection) {
                var color = COLOR.dataToSolidColor(colorData);
                if (color.space === 'RGB') {
                    selection.setStrokeOrFill(color.space, color.vals[0], color.vals[1], color.vals[2], color.profileName, color.name, 'FILL');
                }
            }
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-setColor()', ex);
    }
};

COLOR.setStrokeColor = function (colorData) {
    try {
        if (app.documents.length > 0) {
            app.log("called setStrokeColor");
            var selection = app.selection;
            if (selection) {
                var color = COLOR.dataToSolidColor(colorData);
                if (color.space === 'RGB') {
                    selection.setStrokeOrFill(color.space, color.vals[0], color.vals[1], color.vals[2], color.profileName, color.name, 'STROKE');
                }
            }
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-setStrokeColor()', ex);
    }
};

COLOR.setBrowserFillColor = function (colorData) {
    try {
        if (app.documents.length > 0) {
            app.log("called setBrowserFillColor");
            var selection = app.selection;
            if (selection) {
                var color = COLOR.dataToSolidColor(colorData);
                if (color.space === 'RGB') {
                    selection.setStrokeOrFill(color.space, color.vals[0], color.vals[1], color.vals[2], color.profileName, color.name, 'BROWSER');
                }
            }
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-setBrowserFillColor()', ex);
    }
};

COLOR.dragColor = function (colorData, x, y, timeStamp) {
    try {
        var color = COLOR.dataToColorValue(colorData[0]);
        app.dragColor(color.vals[0], color.vals[1], color.vals[2], color.profileName, x, y, timeStamp);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-dragColor()', ex);
    }
};
