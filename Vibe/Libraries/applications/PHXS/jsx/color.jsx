/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, unparam: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File, DocumentMode,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions, UTIL,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, PSKey, PSClass, PSString, PSType, PSEnum, PSEvent, PSUnit, descriptorToColorData, sTID, cTID */

var COLOR = {};

COLOR.dataToSolidColor = function dataToSolidColor(data) {
    //If passed an array of representations then first select
    //the best representation
    if (Array.isArray(data)) {
        data = COLOR.getBestColorRepresentation(data);
    }
    var finalColor = new SolidColor();
    if (data) {
        switch (data.mode) {
        case 'RGB':
            finalColor.rgb.red = data.value.r;
            finalColor.rgb.green = data.value.g;
            finalColor.rgb.blue = data.value.b;
            finalColor.model = ColorModel.RGB;
            break;
        case 'CMYK':
            finalColor.cmyk.cyan = data.value.c;
            finalColor.cmyk.magenta = data.value.m;
            finalColor.cmyk.yellow = data.value.y;
            finalColor.cmyk.black = data.value.k;
            finalColor.model = ColorModel.CMYK;
            break;
        case 'Lab':
            finalColor.lab.l = data.value.l;
            finalColor.lab.a = data.value.a;
            finalColor.lab.b = data.value.b;
            finalColor.model = ColorModel.LAB;
            break;
        case 'Gray':
            finalColor.gray.gray = data.value;
            finalColor.model = ColorModel.GRAYSCALE;
            break;
        case 'HSB':
            finalColor.hsb.hue = data.value.h;
            finalColor.hsb.saturation = data.value.s;
            finalColor.hsb.brightness = data.value.b;
            finalColor.model = ColorModel.HSB;
            break;
        }
    }

    return finalColor;
};

COLOR.isModeSupported = function (colorData) {
    return colorData && (colorData.mode === 'RGB' || colorData.mode === 'CMYK' || colorData.mode === 'Gray' || colorData.mode === 'Lab' || colorData.mode === 'HSB');
};



COLOR.findRepWithMode = function (reps, mode) {
    var filteredReps = reps.filter(function (item) {
        return item.mode === mode;
    });
    if (filteredReps.length > 0) {
        return filteredReps[0];
    }
};


COLOR.getBestColorRepresentation = function (data) {
    var color = data[0];

    if (COLOR.isModeSupported(color)) {
        return color;
    }
    //Default to RGB if the primary color is not supported
    return COLOR.findRepWithMode(data, 'RGB');
};

COLOR.solidColorToData = function solidColorToData(color) {
    var representations = [];
    var profileName;

    function addProfileName(obj) {
        if (profileName) {
            obj.profileName = profileName;
        }
        return obj;
    }
    // If we don't have a color profile we have to use a try catch
    // Photoshop reports hasOwnProperty and the in operator as true
    // regardless
    try {
        profileName = app.activeDocument.colorProfileName;
    } catch (ignore) {}

    //Always add RGB representation
    representations.push(addProfileName({
        mode: 'RGB',
        value: {
            r: color.rgb.red,
            g: color.rgb.green,
            b: color.rgb.blue
        },
        type: 'process'
    }));
    switch (color.model) {
    case ColorModel.CMYK:
        representations.unshift(addProfileName({
            mode: 'CMYK',
            value: {
                c: color.cmyk.cyan,
                m: color.cmyk.magenta,
                y: color.cmyk.yellow,
                k: color.cmyk.black
            },
            type: 'process'
        }));
        break;
    case ColorModel.LAB:
        representations.unshift(addProfileName({
            mode: 'Lab',
            value: {
                l: color.lab.l,
                a: color.lab.a,
                b: color.lab.b
            },
            type: 'process'
        }));
        break;
    case ColorModel.GRAYSCALE:
        representations.unshift(addProfileName({
            mode: 'Gray',
            value: color.gray.gray,
            type: 'process'
        }));
        break;
    case ColorModel.HSB:
        representations.unshift(addProfileName({
            mode: 'HSB',
            value: {
                h: color.hsb.hue,
                s: color.hsb.saturation,
                b: color.hsb.brightness
            },
            type: 'process'
        }));
        break;
    }
    return representations;
};

COLOR.solidColorToDescriptor = function solidColorToDescriptor(color) {
    var colorType;

    var colorDesc = new ActionDescriptor();
    if (color.model === ColorModel.RGB) {
        colorDesc.putDouble(PSKey.Red, color.rgb.red);
        colorDesc.putDouble(PSKey.Green, color.rgb.green);
        colorDesc.putDouble(PSKey.Blue, color.rgb.blue);
        colorType = PSClass.RGBColor;
    }
    if (color.model === ColorModel.CMYK) {
        colorDesc.putDouble(PSKey.Cyan, color.cmyk.cyan);
        colorDesc.putDouble(PSKey.Magenta, color.cmyk.magenta);
        colorDesc.putDouble(PSKey.Yellow, color.cmyk.yellow);
        colorDesc.putDouble(PSKey.Black, color.cmyk.black);
        colorType = PSClass.CMYKColor;
    }
    if (color.model === ColorModel.LAB) {
        colorDesc.putDouble(PSKey.Luminance, color.lab.l);
        colorDesc.putDouble(PSKey.A, color.lab.a);
        colorDesc.putDouble(PSKey.B, color.lab.b);
        colorType = PSClass.LabColor;
    }
    if (color.model === ColorModel.HSB) {
        colorDesc.putUnitDouble(PSKey.Hue, PSUnit.Angle, color.hsb.hue);
        colorDesc.putDouble(PSKey.Start, color.hsb.saturation);
        colorDesc.putDouble(PSKey.Brightness, color.hsb.brightness);
        colorType = PSClass.HSBColor;
    }
    if (color.model === ColorModel.GRAYSCALE) {
        colorDesc.putDouble(PSKey.Gray, color.gray.gray);
        colorType = PSClass.Grayscale;
    }
    return {
        'type': colorType,
        'descriptor': colorDesc
    };
};

COLOR.descriptorToColorData = function descriptorToColorData(descriptor) {

    if (!descriptor) {
        return "";
    }
    var fillcolor = new SolidColor();

    // RGB color mode
    if (descriptor && descriptor.hasKey(PSKey.Red)) {
        fillcolor.rgb.red = descriptor.getDouble(PSKey.Red);
        fillcolor.rgb.green = descriptor.getDouble(PSKey.Green);
        fillcolor.rgb.blue = descriptor.getDouble(PSKey.Blue);
    }

    // CMYK color mode
    if (descriptor && descriptor.hasKey(PSKey.Cyan)) {
        fillcolor.cmyk.cyan = descriptor.getDouble(PSKey.Cyan);
        fillcolor.cmyk.magenta = descriptor.getDouble(PSKey.Magenta);
        fillcolor.cmyk.yellow = descriptor.getDouble(PSKey.Yellow);
        fillcolor.cmyk.black = descriptor.getDouble(PSKey.Black);
    }

    // HSB color mode
    if (descriptor && descriptor.hasKey(PSKey.Hue)) {
        fillcolor.hsb.hue = descriptor.getUnitDouble(PSKey.Cyan, PSUnit.Angle);
        fillcolor.hsb.saturation = descriptor.getDouble(PSKey.Start);
        fillcolor.hsb.brightness = descriptor.getDouble(PSKey.Brightness);
    }

    // LAB color mode
    if (descriptor && descriptor.hasKey(PSKey.Luminance)) {
        fillcolor.lab.l = descriptor.getDouble(PSKey.Luminance);
        fillcolor.lab.a = descriptor.getDouble(PSKey.A);
        fillcolor.lab.b = descriptor.getDouble(PSKey.B);
    }

    // Grayscale color mode
    if (descriptor && descriptor.hasKey(PSKey.Gray)) {
        fillcolor.gray.gray = descriptor.getDouble(PSKey.Gray);
    }

    return COLOR.solidColorToData(fillcolor);
};

COLOR.getLayerEffectColor = function (forEffect) {
    try {
        var layerEffects = UTIL.getLayerProperty(PSClass.LayerEffects);
        var colorFill = layerEffects.getObjectValue(forEffect);
        var color = colorFill.getObjectValue(PSKey.Color);

        return COLOR.descriptorToColorData(color);
    } catch (ignore) {}
};

COLOR.getSolidFillColor = function () {
    try {
        var adjList = UTIL.getLayerProperty(PSKey.Adjustment); // sTID('adjustment')
        var color = adjList.getObjectValue(0).getObjectValue(PSKey.Color);
        return COLOR.descriptorToColorData(color);
    } catch (ignore) {}
};

COLOR.getSolidStrokeColor = function () {
    try {
        var strokeObj = UTIL.getLayerProperty(sTID('AGMStrokeStyleInfo'));
        var strokeStyle = strokeObj.getObjectValue(sTID('strokeStyleContent'));
        var strokeColor = strokeStyle.getObjectValue(PSKey.Color);

        return COLOR.descriptorToColorData(strokeColor);
    } catch (ignore) {}
};

COLOR.addSolidFillFilter = function (newColor) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(PSClass.Property, PSClass.LayerEffects);
    ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
    desc1.putReference(PSString.Null, ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(PSKey.Scale, PSUnit.Percent, 100);
    var desc3 = new ActionDescriptor();
    desc3.putBoolean(PSKey.Enabled, true);
    desc3.putEnumerated(PSKey.Mode, PSType.BlendMode, PSEnum.Normal);
    desc3.putUnitDouble(PSKey.Opacity, PSUnit.Percent, 100);

    var colorObject = COLOR.solidColorToDescriptor(newColor);
    desc3.putObject(PSKey.Color, colorObject.type, colorObject.descriptor);
    desc2.putObject(PSKey.SolidFill, PSKey.SolidFill, desc3);
    desc1.putObject(PSKey.To, PSClass.LayerEffects, desc2);
    desc1.putBoolean(PSKey.Merge, true);
    executeAction(PSEvent.Set, desc1, DialogModes.NO);
};

COLOR.setCurrentSolidFillOrShapeLayerColor = function (newColor) {
    var layerDesc = new ActionDescriptor();
    var refDesc = new ActionReference();
    refDesc.putEnumerated(PSString.contentLayer, PSType.Ordinal, PSEnum.Target);
    layerDesc.putReference(PSString.Null, refDesc);
    var colorDesc = new ActionDescriptor();

    var colorObject = COLOR.solidColorToDescriptor(newColor);
    colorDesc.putObject(PSKey.Color, colorObject.type, colorObject.descriptor);

    layerDesc.putObject(PSKey.To, PSString.solidColorLayer, colorDesc);
    executeAction(PSEvent.Set, layerDesc, DialogModes.NO);
};

COLOR.setCurrentShapeStrokeColor = function (newColor) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(PSString.contentLayer, PSType.Ordinal, PSEnum.Target);
    desc1.putReference(PSString.Null, ref1);
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    var desc4 = new ActionDescriptor();

    var colorObject = COLOR.solidColorToDescriptor(newColor);
    desc4.putObject(PSKey.Color, colorObject.type, colorObject.descriptor);

    desc3.putObject(PSString.strokeStyleContent, PSString.solidColorLayer, desc4);
    desc3.putInteger(PSString.strokeStyleVersion, 2);
    desc3.putBoolean(PSString.strokeEnabled, true);

    desc2.putObject(PSString.strokeStyle, PSString.strokeStyle, desc3);
    desc1.putObject(PSKey.To, PSString.shapeStyle, desc2);
    executeAction(PSEvent.Set, desc1, DialogModes.NO);
};

COLOR.replaceColor = function (colorData) {
    try {
        var newColor = COLOR.dataToSolidColor(colorData);
        app.foregroundColor = newColor;
        var colorWasChanged = app.showColorPicker();
        return colorWasChanged;
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-replaceColor()', ex);
    }
};

COLOR.getLayerColor = function () {
    try {
        var docColor = COLOR.solidColorToData(app.foregroundColor);
        return JSON.stringify(docColor);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getLayerColor()', ex);
    }
};

COLOR.setColorForSinglySelectedLayer = function (color) {
    var selectedLayer = app.activeDocument.activeLayer;

    if (selectedLayer && selectedLayer.kind === LayerKind.SOLIDFILL) {
        // This handles both Shape layers and Solid Color Fill layers
        COLOR.setCurrentSolidFillOrShapeLayerColor(color);
    } else if (selectedLayer && selectedLayer.kind === LayerKind.TEXT) {
        COLOR.setTextColor(color);
    }
};

COLOR.setColor = function (color, historyName) {
    try {
        var newColor = COLOR.dataToSolidColor(color);

        app.foregroundColor = newColor;

        if (app.documents.length === 0) {
            return;
        }

        var doSetColorFunc = function () {
            COLOR.setColorForSinglySelectedLayer(newColor);
        };

        // Placate JSLint ('not used' error)
        if (!doSetColorFunc) {
            return;
        }

        // The only way to successfully change Shape layer fill color, Solid Color Fill
        // layer color, and Text layer color in a multi-layer selection seems to be to
        // change the color of each layer one at a time.
        app.activeDocument.suspendHistory(historyName, "UTIL.forEachSelectedLayer(doSetColorFunc);");

    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-setColor()', ex);
    }
};
COLOR.setFillColor = COLOR.setColor;

COLOR.setStrokeColor = function (color, historyName) {
    try {
        if (app.documents.length === 0) {
            return;
        }

        var newColor = COLOR.dataToSolidColor(color);
        app.foregroundColor = newColor;

        COLOR.setCurrentShapeStrokeColor(newColor);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-setStrokeColor()', ex);
    }
};

COLOR.setTextColor = function (color) {
    // Accept either a SolidColor object or our color data representation
    color = color && color.typename ? color : COLOR.dataToSolidColor(color);
    var colorDesc = COLOR.solidColorToDescriptor(color);
    var selectedLayer = app.activeDocument.activeLayer;
    if (selectedLayer && selectedLayer.kind === LayerKind.TEXT) {
        var idset = sTID("set");
        var desc12 = new ActionDescriptor();
        var idnull = sTID("null");
        var ref4 = new ActionReference();
        var idproperty = sTID("property");
        var idtextStyle = sTID("textStyle");
        ref4.putProperty(idproperty, idtextStyle);
        var idtextLayer = sTID("textLayer");
        var idordinal = sTID("ordinal");
        var idtargetEnum = sTID("targetEnum");
        ref4.putEnumerated(idtextLayer, idordinal, idtargetEnum);
        desc12.putReference(idnull, ref4);
        var idto = sTID("to");
        var desc13 = new ActionDescriptor();
        var idtextOverrideFeatureName = sTID("textOverrideFeatureName");
        desc13.putInteger(idtextOverrideFeatureName, 808466226);
        var idtypeStyleOperationType = sTID("typeStyleOperationType");
        desc13.putInteger(idtypeStyleOperationType, 3);
        desc13.putObject(sTID('color'), colorDesc.type, colorDesc.descriptor);
        desc12.putObject(idto, idtextStyle, desc13);
        executeAction(idset, desc12, DialogModes.NO);
    }
};

COLOR.setColorOverlay = function (color, historyName) {
    try {
        if (app.documents.length === 0) {
            return;
        }

        var newColor = COLOR.dataToSolidColor(color);
        app.foregroundColor = newColor;

        var doSetColorOverlayFunc = function () {
            COLOR.addSolidFillFilter(newColor);
        };

        // Placate JSLint ('not used' error)
        if (!doSetColorOverlayFunc) {
            return;
        }

        app.activeDocument.suspendHistory(historyName, "UTIL.forEachSelectedLayer(doSetColorOverlayFunc);");

    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-setColorOverlay()', ex);
    }
};
