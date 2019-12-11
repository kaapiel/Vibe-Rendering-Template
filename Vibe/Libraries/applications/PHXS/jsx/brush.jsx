/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, todo: true, unparam: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, PSKey, PSClass, PSString, PSType, PSEnum, PSEvent, PSUnit, sTID, COLOR */

var BRUSH = {};
BRUSH.loadBrushFromFile = function (filePath) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(PSClass.Property, PSKey.Brush);
    ref1.putEnumerated(PSClass.Application, PSType.Ordinal, PSEnum.Target);
    desc1.putReference(PSString.Null, ref1);
    desc1.putPath(PSKey.To, new File(filePath));
    desc1.putBoolean(PSKey.Append, true);
    executeAction(PSEvent.Set, desc1, DialogModes.NO);
};
BRUSH.selectBrush = function (brushName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSKey.Brush, brushName);
    desc1.putReference(PSString.Null, ref1);
    executeAction(PSEvent.Select, desc1, DialogModes.NO);
};
BRUSH.activateTool = function () {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(PSClass.PaintbrushTool);
    desc1.putReference(PSString.Null, ref1);
    executeAction(PSEvent.Select, desc1, DialogModes.NO);
};
BRUSH.loadAndSelectBrush = function (filePath, brushName, brushSettings) {
    try {
        if (brushSettings && brushSettings.tool) {
            app.currentTool = brushSettings.tool;
        }

        var tool_name = app.currentTool;
        // if tool_name is not undefined that means that
        // current version of Photoshop supports new Brush API
        if (tool_name) {
            if (!app.toolSupportsBrushes(tool_name)) {
                app.currentTool = "paintbrushTool";
            }
            app.applyToolBrushFromFile(new File(filePath));
        } else {
            BRUSH.activateTool();
            BRUSH.loadBrushFromFile(filePath);
            // TODO: Brushes iOS app always exports ABR file with brush name as "SampledBrush"
            // So, change this once the issue gets fixed
            BRUSH.selectBrush("SampledBrush"); //brushName
        }

        BRUSH.applySettings(brushSettings);

    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-loadAndSelectBrush()', ex);
    }
};

BRUSH.saveBrushByIndex = function (brushIndex) {
    var result = {};
    try {
        var saveDesc = new ActionDescriptor();

        var refDesc = new ActionReference();
        refDesc.putIndex(PSKey.Brush, brushIndex);
        saveDesc.putReference(PSKey.Target, refDesc);

        var randomNum = $.hiresTimer;
        var abrPath = Folder.temp.fsName + "/Brush" + randomNum + ".abr";
        var pngPath = Folder.temp.fsName + "/Brush" + randomNum + ".png";
        var abrFile = new File(abrPath);
        var pngFile = new File(pngPath);

        saveDesc.putPath(PSKey.To, abrFile);
        saveDesc.putPath(PSKey.Thumbnail, pngFile);

        executeAction(PSKey.Save, saveDesc, DialogModes.ERROR);

        result.abrPath = abrPath;
        result.previewPath = pngPath;
    } catch (ignore) {}

    return JSON.stringify(result);
};

BRUSH.applySettings = function (brushSettings) {
    if (brushSettings) {

        if (brushSettings.blendMode || brushSettings.opacity || brushSettings.flow) {

            // Start with the current tool options because unspecified options may get reset to defaults.
            // Can't use UTIL.getAppProperty because PS returns result under different key.
            var ref = new ActionReference();
            ref.putProperty(PSClass.Property, PSKey.Tool);
            ref.putEnumerated(PSClass.Application, PSType.Ordinal, PSEnum.Target);

            var argsDesc = new ActionDescriptor();
            argsDesc.putReference(PSKey.Target, ref);

            var appDesc = executeAction(PSKey.Get, argsDesc, DialogModes.NO);

            var settingsDesc = appDesc.getObjectValue(PSKey.CurrentToolOptions);

            // Override the provided settings
            if (brushSettings.blendMode) {
                settingsDesc.putEnumerated(PSKey.Mode, PSType.BlendMode, sTID(brushSettings.blendMode));
            }

            if (brushSettings.opacity) {
                settingsDesc.putUnitDouble(PSKey.Opacity, PSUnit.Percent, brushSettings.opacity * 100);
            }

            if (brushSettings.flow) {
                settingsDesc.putUnitDouble(PSKey.Flow, PSUnit.Percent, brushSettings.flow * 100);
            }

            var targetRef = new ActionReference();
            targetRef.putClass(sTID(app.currentTool));

            var setDesc = new ActionDescriptor();
            setDesc.putReference(PSKey.Target, targetRef);
            setDesc.putObject(PSKey.To, PSKey.Target, settingsDesc);

            executeAction(PSEvent.Set, setDesc, DialogModes.NO);
        }

        // Set foreground color used by brush
        if (brushSettings.color) {
            var newColor = COLOR.dataToSolidColor(brushSettings.color);
            app.foregroundColor = newColor;
        }
    }
};
