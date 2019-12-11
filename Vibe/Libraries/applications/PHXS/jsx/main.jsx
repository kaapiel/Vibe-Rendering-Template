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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, unparam: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File, UnitValue,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions,
         LayerKind, DescValueType, cssToClip, svg, ColorModel, JSXGlobals, TEXT, COLOR, BRUSH, LAYERSTYLE, UTIL, PSClass, PSEnum, PSType,
         PSForm, PSUnit, PSString, PSKey, PSEvent, PurgeTarget, DocumentMode */
var params = {};


var cTID = function (s) {
    if (app.charIDToTypeID) {
        return app.charIDToTypeID(s);
    }
};
var sTID = function (s) {
    if (app.stringIDToTypeID) {
        return app.stringIDToTypeID(s);
    }
};

var tTSID = function (tid) {
    if (app.typeIDToStringID) {
        return app.typeIDToStringID(tid);
    }
};


//Include our other scripts order is important
var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';
$.evalFile(extensionPath + 'constants.jsx');
$.evalFile(extensionPath + 'util.jsx');
$.evalFile(extensionPath + 'color.jsx');
$.evalFile(extensionPath + 'brush.jsx');
$.evalFile(extensionPath + 'text.jsx');
$.evalFile(extensionPath + 'layerstyle.jsx');

// Works only in Photoshop 15.1 & above
function getSelectedLayerIndicesOrIDs(wantIDs) {
    // Work-around for screwy layer indexing.
    var backgroundIndexOffset = 1;
    try {
        // This throws an error if there's no background
        if (app.activeDocument.backgroundLayer) {
            backgroundIndexOffset = 0;
        }
    } catch (ignore) {}

    var ktargetLayers = wantIDs ? sTID('targetLayersIDs') : sTID('targetLayers');

    var resultLayerIndices = [];
    var ref = new ActionReference();
    var args = new ActionDescriptor();
    ref.putProperty(PSClass.Property, ktargetLayers);
    ref.putEnumerated(PSClass.Document, PSType.Ordinal, PSEnum.Target);
    args.putReference(PSString.Null, ref);
    var resultDesc = executeAction(cTID('getd'), args, DialogModes.NO);

    if (!resultDesc.hasKey(ktargetLayers)) {
        return [];
    }

    var selIndexList = resultDesc.getList(ktargetLayers);
    var i;
    for (i = 0; i < selIndexList.count; ++i) {
        if (wantIDs) {
            resultLayerIndices.push(selIndexList.getReference(i).getIdentifier(PSClass.Layer));
        } else {
            resultLayerIndices.push(selIndexList.getReference(i).getIndex(PSClass.Layer) + backgroundIndexOffset);
        }
    }

    return resultLayerIndices;
}

function getSelectedLayerIndices() {
    return getSelectedLayerIndicesOrIDs(false);
}

function getSelectedLayerIDs() {
    return getSelectedLayerIndicesOrIDs(true);
}

function getNumSelectedLayers() {
    var indices = [];
    try {
        indices = getSelectedLayerIndices();
    } catch (e) {
        return false;
    }

    return indices.length;
}


function importLayers(filePath, libraryName, itemName, elementRef, modifiedTime, adobeStockId, adobeStockLicense, isLinked) {
    var placeDesc = new ActionDescriptor();
    placeDesc.putPath(PSKey.Target, new File(filePath));

    if (itemName) {
        placeDesc.putString(PSKey.LAYER_NAME, itemName);
    }

    var elementDesc = new ActionDescriptor();

    if (elementRef) {
        elementDesc.putString(PSKey.ELEMENT_REF, elementRef);
    }

    if (modifiedTime) {
        elementDesc.putDouble(PSKey.DATE_MODIFIED, modifiedTime);
    }

    if (itemName) {
        elementDesc.putString(PSKey.Name, itemName);
    }

    if (libraryName) {
        elementDesc.putString(PSKey.LIBRARY_NAME, libraryName);
    }

    if (adobeStockId) {
        elementDesc.putString(PSKey.ADOBE_STOCK_ID, adobeStockId);
        elementDesc.putEnumerated(PSKey.ADOBE_STOCK_LICENSE_STATE, PSKey.ADOBE_STOCK_LICENSE_STATE, adobeStockLicense ? PSKey.Licensed : PSKey.Unlicensed);
    }

    placeDesc.putObject(PSKey.LIB_ELEMENT, PSKey.LIB_ELEMENT, elementDesc);

    if (isLinked) {
        placeDesc.putBoolean(PSKey.LINKED, isLinked);
    } else {
        placeDesc.putBoolean(PSKey.UNWRAP_LAYERS, true);
    }

    executeAction(PSKey.PLACE_EVENT, placeDesc, DialogModes.ERROR);
}



// Makes an action list containing a reference to selected sheets
function makeSelectedSheetsTargetSheetReferenceList() {
    //Create an action refernece containing all of the sheets we want to export
    var targetSheetsRef = new ActionReference();
    targetSheetsRef.putEnumerated(PSKey.LayerKey, PSKey.OrdinalKey, PSKey.TargetEnum);

    // Put the reference containing the sheets into a list, cause that's how it's done
    var refList = new ActionList();
    refList.putReference(targetSheetsRef);

    return refList;
}

// Makes a save descriptor that describes the location, name, format, options, etc
// for the file that the layers will be saved to
// saveFile: a File object indicating where the file shoudl be saved to
function makePSDSaveDescriptor(fileObject) {
    var saveDesc = new ActionDescriptor();

    // Format options
    var formatOptDesc = new ActionDescriptor();
    formatOptDesc.putBoolean(PSKey.MaximizeCompatibility, true);

    saveDesc.putObject(PSKey.As, PSKey.Photoshop35Format, formatOptDesc);
    saveDesc.putPath(PSKey.IN, fileObject);
    saveDesc.putBoolean(PSKey.LowerCase, true);

    return saveDesc;
}

function makeRepresentationDescriptor(saveFolder, saveFileNameNoExt) {
    var representationDesc = new ActionDescriptor();
    representationDesc.putPath(PSString.IN, saveFolder);
    representationDesc.putString(PSKey.Name, saveFileNameNoExt);

    return representationDesc;
}

function makeExternalPreviewDescriptor(saveFile, maxWidth, maxHeight) {
    var externalPreviewDesc = new ActionDescriptor();
    externalPreviewDesc.putPath(PSString.IN, saveFile);
    externalPreviewDesc.putInteger(PSString.PixelWidth, maxWidth);
    externalPreviewDesc.putInteger(PSString.PixelHeight, maxHeight);

    return externalPreviewDesc;
}

// Core override. Ensures we correctly determine open status for files
// inside a Windows user folder that has more than 8 characters (path
// comparison on the JS side fails us due to 8.3 vs long filename paths).
$._ADBE_LIBS_CORE.isDocumentOpen = function (path) {
    var hasMatch = false;
    try {
        var argDesc = new ActionDescriptor();
        argDesc.putPath(PSKey.File, new File(path));
        hasMatch = UTIL.getAppProperty(PSKey.HasMatchingOpenDoc, argDesc);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-isDocumentOpen()', ex);
    }
    return JSON.stringify(hasMatch);
};

$._ADBE_LIBS_PHXS = {
    replaceColor: COLOR.replaceColor,
    setFont: TEXT.setFont,
    createFontLayer: TEXT.createFontLayer,
    isFontAvailable: TEXT.isFontAvailable,
    saveTextStylePreview: TEXT.saveTextStylePreview,
    makeTextItemObjectJSONFromPushDescID: TEXT.makeTextItemObjectJSONFromPushDescID,
    loadAndSelectBrush: BRUSH.loadAndSelectBrush,
    saveCurrentBrush: BRUSH.saveCurrentBrush,
    saveBrushByIndex: BRUSH.saveBrushByIndex,
    saveLayerStyle: LAYERSTYLE.saveLayerStyle,
    saveLayerStyleByIndex: LAYERSTYLE.saveLayerStyleByIndex,
    applyLayerStyle: LAYERSTYLE.applyLayerStyle,

    makeColorLookupLayerFromFile: function (filePath, lookName) {

        var selectedLayer = null;

        // Check that a layer is actually selected, app.aciveDocument.activeLayer can be
        // set even if you deselect all layers.
        if (getNumSelectedLayers() === 1) {
            selectedLayer = app.activeDocument.activeLayer;
        }

        if (selectedLayer && selectedLayer.kind === LayerKind.COLORLOOKUP) {

            // Modify the existing Color Lookup adjustment layer
            var setDesc = new ActionDescriptor();

            var targetRef = new ActionReference();
            targetRef.putEnumerated(PSKey.AdjustmentLayer, PSKey.OrdinalKey, PSKey.TargetEnum);
            setDesc.putReference(PSString.Null, targetRef);

            var lookDesc = new ActionDescriptor();
            lookDesc.putString(PSKey.Name, lookName);
            lookDesc.putPath(PSString.FROM, new File(filePath));

            setDesc.putObject(PSKey.To, PSKey.ColorLookup, lookDesc);
            executeAction(PSEvent.Set, setDesc, DialogModes.NO);

        } else {
            // Add a new Color Lookup adjustment layer
            var mainDesc = new ActionDescriptor();
            mainDesc.putPath(PSString.FROM, new File(filePath));
            mainDesc.putString(PSKey.Name, lookName);
            executeAction(PSString.makeColorLookupLayerFromFile, mainDesc, DialogModes.ERROR);
        }
    },
    makePatternLayerFromFile: function (filePath, patternName, historyName) {

        function makePatternFromFile(filePath, patternName) {
            var mainDesc = new ActionDescriptor();
            mainDesc.putPath(PSString.FROM, new File(filePath));
            mainDesc.putString(PSKey.Name, patternName);
            executeAction(PSString.definePatternFile, mainDesc, DialogModes.ERROR);
        }

        function makePatternLayerByName(patternName, scalePercent) {
            // This relies on the fact that a just-addded pattern is the first one that
            // will be found by name even if there are other patterns with the same name
            // (sufficient for this release but not an implementation detail we should rely on).
            var makeDesc = new ActionDescriptor();

            var targetRef = new ActionReference();
            targetRef.putClass(PSString.contentLayer);
            makeDesc.putReference(PSKey.Target, targetRef);

            var patternDesc = new ActionDescriptor();
            patternDesc.putString(PSKey.Name, patternName);
            patternDesc.putString(PSKey.ID, "bogus zuid value"); // To get PS to search by name, we have to provide a bogus zuid

            var patternLyrDesc = new ActionDescriptor();
            patternLyrDesc.putUnitDouble(PSKey.Scale, PSUnit.Percent, scalePercent);
            patternLyrDesc.putObject(PSKey.Pattern, PSKey.Pattern, patternDesc);

            var contentLayerDesc = new ActionDescriptor();
            contentLayerDesc.putObject(PSKey.Type, PSKey.PatternLayer, patternLyrDesc);

            makeDesc.putObject(PSKey.Using, PSString.contentLayer, contentLayerDesc);

            var resultDesc = executeAction(PSEvent.Make, makeDesc, DialogModes.ERROR);

            // This test is a hack because Photoshop isn't throwing user canceled
            // on the Mac. Don't blindly replicate elsewhere.
            if (resultDesc.count === 0) {
                return false;
            }

            return true;
        }

        function deleteJustAddedPattern(patternName) {
            // Get 0-based index of the just-added pattern, double-checking name to be safe.
            var addedPatternIndex = -1;
            var presetTypesList = UTIL.getAppProperty(sTID('presetManager'));

            if (presetTypesList.count >= 5) {
                var patternsDesc = presetTypesList.getObjectValue(4);
                var patternNamesList = patternsDesc.getList(PSKey.Name);

                if (patternNamesList.count > 0) {
                    var lastPatternIndex = patternNamesList.count - 1;
                    if (patternNamesList.getString(lastPatternIndex) === patternName) {
                        addedPatternIndex = lastPatternIndex;
                    }
                }
            }

            if (addedPatternIndex > 0) {
                var deleteDesc = new ActionDescriptor();
                var targetRef = new ActionReference();
                targetRef.putIndex(PSKey.Pattern, addedPatternIndex + 1); // delete by 1-based index
                deleteDesc.putReference(PSKey.Target, targetRef);
                executeAction(PSEvent.Delete, deleteDesc, DialogModes.NO);
            }
        }

        function doMakePatternLayerFromFile(filePath, patternName) {
            var doCancel = false;
            try {
                // makePatternLayerFromFile hangs when pattern mode or depth
                // have to be converted for target doc, so do it manually.
                makePatternFromFile(filePath, patternName);

                try {
                    if (!makePatternLayerByName(patternName, 25)) {
                        doCancel = true; // handle cancel on Mac
                    }
                } catch (ex) {
                    doCancel = true; // handle cancel on Win
                }

                deleteJustAddedPattern(patternName);

                // In order to skip showing the New Layer dialog but show the Pattern Fill dialog,
                // we drive the initial layer creation without dialogs and then run a second
                // action here to modify the pattern fill layer.

                // Get the ID for the pattern from the new layer
                var adjList = UTIL.getLayerProperty(PSKey.Adjustment);
                var patternID = adjList.getObjectValue(0).getObjectValue(PSKey.Pattern).getString(PSKey.ID);

                // Show the Pattern Fill dialog with the scale automatically set down to 25%
                var setDesc = new ActionDescriptor();

                var targetRef = new ActionReference();
                targetRef.putEnumerated(PSString.contentLayer, PSType.Ordinal, PSKey.TargetEnum);
                setDesc.putReference(PSString.Null, targetRef);

                var patternLyrDesc = new ActionDescriptor();
                patternLyrDesc.putUnitDouble(PSKey.Scale, PSUnit.Percent, 25.000000);
                var patternDesc = new ActionDescriptor();
                patternDesc.putString(PSKey.ID, patternID);
                patternLyrDesc.putObject(PSKey.Pattern, PSKey.Pattern, patternDesc);
                setDesc.putObject(PSKey.To, PSKey.PatternLayer, patternLyrDesc);

                var result = executeAction(PSEvent.Set, setDesc, DialogModes.ALL);

                // This test is a hack because Photoshop isn't throwing user canceled
                // on the Mac. Don't blindly replicate elsewhere.
                if (result.count === 0) {
                    return 'cancel';
                }
            } catch (ex) {
                // Handles user cancel on Win and any other unexpected exception
                doCancel = true;
            }

            if (doCancel) {
                return 'cancel';
            }
        }

        // Placate JSLint ('not used' error)
        if (!doMakePatternLayerFromFile) {
            return;
        }

        app.activeDocument.suspendHistory(historyName, 'doMakePatternLayerFromFile(filePath, patternName);');
    },
    definePatternFile: function (filePath, patternName) {
        var mainDesc = new ActionDescriptor();
        mainDesc.putPath(PSString.FROM, new File(filePath));
        mainDesc.putString(PSKey.Name, patternName);
        executeAction(PSString.definePatternFile, mainDesc, DialogModes.ERROR);
    },
    refreshFonts: function () {
        app.refreshFonts();
    },
    showFileSelectionDialog: function () {
        var selectedFiles = app.openDialog();
        var filePaths = [];
        var f;
        for (f = 0; f < selectedFiles.length; f++) {
            filePaths.push({
                'name': selectedFiles[f].name,
                'path': selectedFiles[f].fsName
            });
        }
        return JSON.stringify(filePaths);
    },
    placeAsset: function (filePath, libraryName, itemName, elementRef, modifiedTime, creationTime, adobeStockId, adobeStockLicense, isLinked) {
        try {
            importLayers(filePath, libraryName, itemName, elementRef, modifiedTime, adobeStockId, adobeStockLicense, isLinked);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-placeAsset()', ex);
        }
    },
    openAssetForEdit: function (filePath, previewPath, elementRef) {
        try {
            var openDesc = new ActionDescriptor();
            openDesc.putPath(PSString.Null, new File(filePath));

            // Tell PS to generate an updated preview whenever the file is saved
            var pngFile = new File(previewPath);
            var previewParams = makeExternalPreviewDescriptor(pngFile, JSXGlobals.previewMaxWidth, JSXGlobals.previewMaxHeight);
            openDesc.putObject(PSString.ExternalPreview, PSString.ExternalPreview, previewParams);
            openDesc.putEnumerated(PSKey.FileOpenContext, PSType.Ordinal, PSEnum.FileOpenContextCCLibraries);

            // Suppresses file choosing dialog while allowing format options
            openDesc.putBoolean(PSKey.OverrideOpen, true);

            // Provide element ref so PS can track recent
            if (elementRef) {
                var elementDesc = new ActionDescriptor();
                elementDesc.putString(PSKey.ELEMENT_REF, elementRef);
                openDesc.putObject(PSKey.LIB_ELEMENT, PSKey.LIB_ELEMENT, elementDesc);
            }

            // Tell PS to open the file
            executeAction(PSString.Open, openDesc, DialogModes.ALL);
            return app.activeDocument.name;
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-openAssetForEdit()', ex);
        }
    },
    openDocumentFromTemplate: function (templatePath, templateName, elementRef) {
        try {
            var openDesc = new ActionDescriptor();
            openDesc.putPath(PSString.Null, new File(templatePath));

            openDesc.putEnumerated(PSKey.FileOpenContext, PSType.Ordinal, PSEnum.FileOpenContextCCLibraries);

            // Suppresses file choosing dialog while allowing format options
            openDesc.putBoolean(PSKey.OverrideOpen, true);

            // Force open as template behavior even if we don't have a template file type
            openDesc.putBoolean(PSKey.Template, true);

            // Provide element ref so PS can track recent
            if (elementRef) {
                var elementDesc = new ActionDescriptor();
                elementDesc.putString(PSKey.ELEMENT_REF, elementRef);
                openDesc.putObject(PSKey.LIB_ELEMENT, PSKey.LIB_ELEMENT, elementDesc);
            }

            // Tell PS to open the file
            executeAction(PSString.Open, openDesc, DialogModes.ALL);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-openDocumentFromTemplate()', ex);
        }
    },
    generateRepresentationAndPreview: function (repFolderPath, repNameNoExt, previewPath) {
        var repFolder = new File(repFolderPath);
        var previewFile = new File(previewPath);

        var repDesc = makeRepresentationDescriptor(repFolder, repNameNoExt);
        var previewDesc = makeExternalPreviewDescriptor(previewFile, JSXGlobals.previewMaxWidth, JSXGlobals.previewMaxHeight);

        var exportDesc = new ActionDescriptor();
        exportDesc.putClass(PSKey.Using, PSKey.SaveForCCLibrariesElement);
        exportDesc.putObject(PSKey.Representation, PSKey.Representation, repDesc);
        exportDesc.putObject(PSString.ExternalPreview, PSString.ExternalPreview, previewDesc);

        var refList = null;
        refList = makeSelectedSheetsTargetSheetReferenceList();
        exportDesc.putList(PSKey.Target, refList);

        var dimensions = {
            'width': 0,
            'height': 0
        };
        var resultDesc = executeAction(PSKey.Export, exportDesc, DialogModes.ERROR);

        if (resultDesc && resultDesc.hasKey(PSString.PixelWidth)) {
            dimensions.width = resultDesc.getInteger(PSString.PixelWidth);
        }

        if (resultDesc && resultDesc.hasKey(PSString.PixelHeight)) {
            dimensions.height = resultDesc.getInteger(PSString.PixelHeight);
        }

        var repFile = resultDesc.getPath(PSString.IN);

        var result = {};
        result.dimensions = dimensions;
        result.repPath = repFile.fsName;

        return result;
    },
    saveAssets: function (info, generateSecondaryFormat) {
        try {
            // Add an extra 'p' to the end of the preview filename incase the
            // representation file turns out to also be a PNG.
            var pngPath = Folder.temp.fsName + "/" + info.name + "p" + ".png";
            var result = $._ADBE_LIBS_PHXS.generateRepresentationAndPreview(Folder.temp.fsName, info.name, pngPath);

            var filePath = result.repPath;

            var strLayerName = $._ADBE_LIBS_PHXS.getLayerName();
            var fileData = {
                layerName: strLayerName,
                files: [{
                    path: filePath,
                    relationship: 'primary',
                    dimensions: result.dimensions
                }],
                rendition: pngPath
            };

            var layerIds = getSelectedLayerIDs();
            if (layerIds) {
                fileData.layerIds = layerIds;
            }

            if (app.activeDocument) {
                fileData.documentId = app.activeDocument.id;
            }

            return JSON.stringify(fileData);
        } catch (ex1) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-saveAssets()', ex1);
        }
    },
    setColor: COLOR.setColor,
    setFillColor: COLOR.setFillColor,
    setStrokeColor: COLOR.setStrokeColor,
    setColorOverlay: COLOR.setColorOverlay,
    getCurrentState: function () {
        try {
            if (app.documents && app.documents.length > 0) {
                var selectedLayerId = -1;
                var selectedLayer = app.activeDocument.activeLayer;
                var docPath = app.activeDocument.name;

                if (selectedLayer) {
                    selectedLayerId = selectedLayer.id;
                }
                try {
                    if (app.activeDocument.fullName) {
                        docPath = app.activeDocument.fullName.fsName;
                    }
                } catch (ex2) {
                    JSON.stringify({
                        'path': docPath,
                        'layerID': selectedLayerId
                    });
                }

                return JSON.stringify({
                    'path': docPath,
                    'layerID': selectedLayerId
                });
            }
            return JSON.stringify({
                'name': '',
                'layerID': -1
            });
        } catch (ignore) {}
    },
    getLayerName: function () {
        try {
            return app.activeDocument.activeLayer.name;
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getLayerName()', ex);
            return '';
        }
    },
    frontDocIsRGB: function () { // for applyLookRGBHack
        return app.activeDocument && app.activeDocument.mode === DocumentMode.RGB;
    },
    getLayerInfo: function () {
        try {
            var layerObject = {
                'name': '',
                'fullName': ''
            };
            var layerColors = [];

            var areEqual = function (colorData1, colorData2) {
                var key;
                if (colorData1 && colorData2) {
                    for (key in colorData1[0].value) {
                        if (colorData1[0].value.hasOwnProperty(key)) {
                            if (!colorData2[0].value.hasOwnProperty(key) || Math.round(colorData1[0].value[key]) !== Math.round(colorData2[0].value[key])) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            };

            var pushUnique = function (colorData, colorType) {
                if (colorData === undefined) {
                    return;
                }
                var index;
                for (index = 0; index < layerColors.length; index++) {
                    if (areEqual(layerColors[index].data, colorData)) {
                        return;
                    }
                }
                layerColors.push({
                    'colorType': colorType,
                    'data': colorData
                });
            };

            layerObject.enableApplyText = false;

            var selectedLayer = false; // For multi-layer selections, this is the top layer
            var numSelectedLayers = getNumSelectedLayers();
            if (numSelectedLayers === 1) {
                selectedLayer = app.activeDocument.activeLayer;
                if (selectedLayer && selectedLayer.kind === LayerKind.TEXT && selectedLayer.textItem.contents.length > 0) {
                    layerObject.enableApplyText = true;
                    layerObject.text = $._ADBE_LIBS_CORE.shortenString(selectedLayer.textItem.contents);

                    layerObject.fontInfo = TEXT.getLayerFont();
                    pushUnique(layerObject.fontInfo.color, JSXGlobals.PS_TEXT);
                }

                pushUnique(COLOR.getSolidFillColor(), JSXGlobals.FILL);
                pushUnique(COLOR.getSolidStrokeColor(), JSXGlobals.STROKE);
                pushUnique(COLOR.getLayerEffectColor(PSKey.SolidFill), JSXGlobals.PS_EFFECT_FILL);
                pushUnique(COLOR.getLayerEffectColor(PSKey.FrameFX), JSXGlobals.PS_EFFECT_STROKE);

                layerObject.name = $._ADBE_LIBS_CORE.shortenString(selectedLayer.name, false, JSXGlobals.maxNameLength);
                layerObject.fullName = selectedLayer.name;
                layerObject.hasLayerStyles = LAYERSTYLE.hasLayerStyles();
            } else if (numSelectedLayers > 1) {
                selectedLayer = app.activeDocument.activeLayer;
                if (selectedLayer && selectedLayer.kind === LayerKind.TEXT) {
                    layerObject.enableApplyText = true;
                }
            }
            pushUnique(COLOR.solidColorToData(app.foregroundColor), JSXGlobals.PS_FOREGROUND);

            layerObject.colors = layerColors;
            layerObject.kind = "";
            layerObject.selectionExists = (numSelectedLayers > 0);
            layerObject.enableApplyStyle = (numSelectedLayers > 1 || (numSelectedLayers === 1 && !selectedLayer.isBackgroundLayer));
            layerObject.enableShapeLayerApplyOperations = false;
            layerObject.libraryLinked = false;

            if (numSelectedLayers === 1 && selectedLayer.kind) {
                layerObject.kind = selectedLayer.kind.toString();

                if (selectedLayer.kind === LayerKind.SMARTOBJECT) {
                    var soDesc = UTIL.getLayerProperty(PSKey.SmartObject);
                    if (soDesc && soDesc.hasKey(PSKey.LINK) && soDesc.getType(PSKey.LINK) === DescValueType.OBJECTTYPE && soDesc.getClass(PSKey.LINK) === PSKey.LIB_ELEMENT) {
                        layerObject.libraryLinked = true;
                    }
                }
            }

            if (numSelectedLayers > 0 && selectedLayer.kind) {
                // Only show apply fill/stroke color for Shape layers, not Solid Color Fill layers
                if (selectedLayer.kind === LayerKind.SOLIDFILL) {
                    var hasVectorMask = UTIL.getLayerProperty(PSKey.HasVectorMask);
                    layerObject.enableShapeLayerApplyOperations = hasVectorMask;
                }
            }
            layerObject.enableApplyLook = app.activeDocument.mode === DocumentMode.RGB;

            return JSON.stringify(layerObject);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getLayerInfo()', ex);
        }
    },
    getLayerColor: COLOR.getLayerColor,
    getIMSUserID: function () {
        var userId = "";
        try {
            var bhnc = cTID("bhnc");
            var ref = new ActionReference();
            ref.putProperty(cTID("Prpr"), bhnc);
            ref.putEnumerated(cTID("capp"), cTID("Ordn"), cTID("Trgt"));
            var appDesc = app.executeActionGet(ref);
            if (appDesc.hasKey(bhnc)) {
                userId = appDesc.getString(bhnc);
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getIMSUserID()', ex);
        }

        return userId;
    },
    getTooltipState: function () {
        var tooltipsEnabled = true;
        try {
            tooltipsEnabled = UTIL.getAppProperty(PSKey.ShowToolTips);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getTooltipState', ex);
        }
        return tooltipsEnabled;
    },
    getReadableFileExtensions: function () {
        var readableExtensions = [];
        try {
            var fileFormatsDesc = UTIL.getAppProperty(PSKey.FileFormats);
            if (fileFormatsDesc.hasKey(PSKey.ReadableFileExtensions)) {
                var listDesc = fileFormatsDesc.getList(PSKey.ReadableFileExtensions);
                var index = 0;
                for (index = 0; index < listDesc.count; ++index) {
                    readableExtensions.push(listDesc.getString(index));
                }
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getReadableFileExtensions', ex);
        }
        return JSON.stringify(readableExtensions);
    },
    isAnalyticsEnabled: function () {
        var userTrackingEnabled = false;
        try {
            var welcome = cTID('wlcm');
            var koptinStr = sTID("optin");
            var welcomeDesc = UTIL.getAppProperty(welcome);
            if (welcomeDesc && welcomeDesc.hasKey(koptinStr)) {
                userTrackingEnabled = welcomeDesc.getBoolean(koptinStr);
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-isAnalyticsEnabled', ex);
        }
        return userTrackingEnabled;
    },
    getConfigInfoFromPS: function () {
        // Comment out but keep code as an example when not in use; will need to re-use.
        var configInfo = {
            enablePatternDragging: false
        };
        try {
            var ccLibConfigDesc = UTIL.getAppProperty(PSKey.CCLibrariesConfig);
            if (ccLibConfigDesc && ccLibConfigDesc.hasKey(sTID("enablePatternDragging"))) {
                configInfo.enablePatternDragging = ccLibConfigDesc.getBoolean(sTID("enablePatternDragging"));
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getConfigInfoFromPS', ex);
        }
        return JSON.stringify(configInfo);
    },
    reportEvent: function (eventName, properties, force) {
        try {
            if (eventName === "createElement" || eventName === "useElement" || eventName === "createLink" || force) {
                // Log events to Highbeam so Design Library usage can be compared
                // to usage of other Photoshop features.

                // This is the data group name; it should be identical across all calls for a given
                // data group and self descriptive.
                // By not including eventName in the group name, we are recording a single data
                // group for Design Library (eventName gets added as a property).
                var highbeamDataGroupName = "Design Library";

                // Helper to handle null and undefined properties which can't be added to
                // an ActionDescriptor. When properties aren't set, log "N/A" rather than
                // letting Highbeam fill in a default value.
                var safeAddStringPropertyToDesc = function (descriptor, key, property) {
                    if (property) {
                        descriptor.putString(key, property);
                    } else {
                        descriptor.putString(key, "N/A");
                    }
                };

                var desc = new ActionDescriptor();

                // Required params:
                //   - eventRecord: Data group name
                safeAddStringPropertyToDesc(desc, PSEvent.Record, highbeamDataGroupName);

                // There should be a well defined and limited set of values for each property
                // which is what you want to make Highbeam data most usable. Library/element
                // IDs are an exception as we log them to look at aggregate per-library and
                // per-element data.
                safeAddStringPropertyToDesc(desc, PSKey.HighbeamEventName, eventName);
                safeAddStringPropertyToDesc(desc, PSKey.HighbeamLibraryID, properties.libraryID);
                safeAddStringPropertyToDesc(desc, PSKey.HighbeamLibraryElementCount, properties.libraryElementCount);
                safeAddStringPropertyToDesc(desc, PSKey.HighbeamElementID, properties.elementID);
                safeAddStringPropertyToDesc(desc, PSKey.HighbeamElementType, properties.elementType);

                // Add properties that we only want for specific event types
                if (eventName === "useElement") {
                    safeAddStringPropertyToDesc(desc, PSKey.HighbeamRepresentationType, properties.representationType);
                    safeAddStringPropertyToDesc(desc, PSKey.HighbeamOpType, properties.opType);
                    safeAddStringPropertyToDesc(desc, PSKey.HighbeamDetails, properties.details);
                }

                if (eventName === "createElement") {
                    safeAddStringPropertyToDesc(desc, PSKey.HighbeamOpType, properties.opType);
                }

                if (eventName === "createLink") {
                    safeAddStringPropertyToDesc(desc, PSKey.HighbeamOpType, properties.opType);
                }

                app.executeAction(PSEvent.HeadlightsInfo, desc, DialogModes.NO);

                return true;
            }

        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-reportEvent()', ex);
        }

        return false;
    },
    getStringID: function (strValue) {
        if (typeof strValue === 'string') {
            return sTID(strValue);
        }

        return strValue.map(sTID);
    },
    getUserData: function () {
        try {
            var result = {
                accountStatus: "paid",
                secondsLeftInTrial: 0
            };

            var kWelcomeStr           = cTID("wlcm");
            var kentryStatusStr       = sTID("entryStatus");
            var kleftStr              = sTID("left");

            var ref = new ActionReference();
            ref.putProperty(sTID('property'), kWelcomeStr);
            ref.putEnumerated(sTID('application'), sTID('ordinal'), sTID('targetEnum'));

            var argsDesc = new ActionDescriptor();
            argsDesc.putReference(sTID('target'), ref);
            var appDesc = executeAction(sTID('get'), argsDesc, DialogModes.NO);

            if (appDesc.hasKey(kWelcomeStr)) {
                var welcomeDesc = appDesc.getObjectValue(kWelcomeStr);

                result.accountStatus = (welcomeDesc.getInteger(kentryStatusStr) === 1) ? "trial" : "paid";
                result.secondsLeftInTrial = (result.subscription === "paid") ? 0 : welcomeDesc.getLargeInteger(kleftStr);
            }

            return JSON.stringify(result);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('PHXS.jsx-getUserData()', ex);
        }
    }
};
