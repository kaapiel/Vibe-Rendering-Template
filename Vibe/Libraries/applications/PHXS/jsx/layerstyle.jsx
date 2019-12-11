/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File, UTIL,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, PSKey, PSClass, PSString, PSType, PSEnum, PSEvent */

var LAYERSTYLE = {};

LAYERSTYLE.hasLayerStyles = function () {
    return (UTIL.getLayerProperty(PSClass.LayerEffects) !== undefined);
};

LAYERSTYLE.saveLayerStyle = function () {
    var strLayerName = $._ADBE_LIBS_PHXS.getLayerName();
    var fileData = {
        'layerName': strLayerName,
        files: []
    };

    if (LAYERSTYLE.hasLayerStyles()) {
        try {
            var randomNum = $.hiresTimer;
            var aslPath = Folder.temp.fsName + "/LayerStyle" + randomNum + ".asl";
            var aslFile = new File(aslPath);
            app.activeDocument.activeLayer.saveStyleFile(aslFile);
            fileData.files.push(aslPath);

            var pngPath = Folder.temp.fsName + "/LayerStyle" + randomNum + ".png";
            app.thumbnailStyleFile(aslFile, new File(pngPath));
            fileData.rendition = pngPath;
        } catch (ignore) {}
    }

    return JSON.stringify(fileData);
};

LAYERSTYLE.saveLayerStyleByIndex = function (styleIndex) {
    var result = {};
    try {
        var saveDesc = new ActionDescriptor();

        var refDesc = new ActionReference();
        refDesc.putIndex(PSKey.Style, styleIndex);
        saveDesc.putReference(PSKey.Target, refDesc);

        var randomNum = $.hiresTimer;
        var aslPath = Folder.temp.fsName + "/LayerStyle" + randomNum + ".asl";
        var aslFile = new File(aslPath);
        saveDesc.putPath(PSKey.To, aslFile);

        executeAction(PSKey.Save, saveDesc, DialogModes.ERROR);

        result.aslPath = aslPath;

        // The preview can be saved as part of the save action, but the size and
        // bg color params are ignored, so just use the separate thumbnailStyleFile()
        // API like we do elsewhere.
        var pngPath = Folder.temp.fsName + "/LayerStyle" + randomNum + ".png";
        app.thumbnailStyleFile(aslFile, new File(pngPath));
        result.previewPath = pngPath;
    } catch (ignore) {}

    return JSON.stringify(result);
};

LAYERSTYLE.applyLayerStyle = function (filePath) {
    app.activeDocument.activeLayer.applyStyleFile(new File(filePath));
};
