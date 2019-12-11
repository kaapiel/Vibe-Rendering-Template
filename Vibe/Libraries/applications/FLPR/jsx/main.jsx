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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, todo: true, unparam: true */
/*globals $, app, BRUSH, FLfile, COLOR, JSXGlobals, Folder, File */

// Load other helper functions
// Get the root folder name from the scriptURI of current script
var jsxROOT = FLfile.uriToPlatformPath(app.scriptURI.split('/').slice(0, -1).join('/') + '/');
$.evalFile(jsxROOT + "brush.jsx");
$.evalFile(jsxROOT + "color.jsx");

// Layer types
var LayerType = {
    'NORMAL': 'normal',
    'GUIDE': 'guide',
    'GUIDED': 'guided',
    'MASK': 'mask',
    'MASKED': 'masked',
    'FOLDER': 'folder'
};

var AssetMetaData = {
    'VERSION' : '1.0',
    'NAMESPACE' : 'FLPR',
    'KEY' : 'assetInfo'
};

var ElementType = {
    'TEXT': 'text',
    'SHAPE': 'shape',
    'INSTANCE': 'instance',
    'MOVIECLIP': 'movie clip',
    'GRAPHIC': 'graphic',
    'BUTTON': 'button',
    'BITMAP': 'bitmap',
    'SYMBOL': 'symbol',
    'DOCUMENT': 'animation'
};

var FillStyle = {
    'SOLID': 'solid',
    'LIN_GRAD': 'linearGradient',
    'RAD_GRAD': 'radialGradient'
};

var FileExtension = {
    'FLA': 'fla',
    'SYM': 'sym'
};

var getFileNameWithoutExtension = function (fileName) {
    var indexOfPeriod = fileName.lastIndexOf('.');
    if (fileName && indexOfPeriod !== -1) {
        fileName = fileName.substr(0, indexOfPeriod);
    }
    return fileName;
};

// Core overrides
$._ADBE_LIBS_CORE.isDocumentOpen = function (path) {
    var docs = app.documents || [];
    var i;

    for (i = 0; i < docs.length; ++i) {
        if (docs[i].path === path) {
            return true;
        }
    }

    return false;
};

$._ADBE_LIBS_FLPR = {
    loadAndSelectBrush: BRUSH.loadAndSelectBrush,
    setColor: COLOR.setColor,
    getTooltipState: function () {
        // Flash Pro has tooltips enabled always
        return 'true';
    },
    isAnalyticsEnabled: function () {
        return app.isAnalyticsEnabled();
    },
    getCurrentState: function () {
        try {
            var activeDoc = app.getDocumentDOM();
            if (activeDoc && activeDoc.timelines && activeDoc.currentTimeline >= 0 && activeDoc.currentTimeline < activeDoc.timelines.length) {
                var activeTimeline = activeDoc.timelines[activeDoc.currentTimeline];
                var selectedLayerId = activeTimeline.currentLayer;
                var docPath = activeDoc.path;
                if (!docPath) {
                    // If document is not saved, return just the name
                    docPath = activeDoc.name;
                }

                return JSON.stringify({
                    'path': docPath,
                    'layerID': selectedLayerId
                });
            }
        } catch (ignore) {}
        return JSON.stringify({
            'path': '',
            'layerID': -1
        });
    },
    isFontAvailable: function (style) {
        // TODO: Implement a function that returns true or false, depending on whether the given font is available
        // in your application.
        return 'false';
    },
    getLayerInfo: function () {
        // We return the information based on the current selection in this callback, which is what is needed to enable/disable
        // certain UI options. Its not returning the information for the entire layer
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
        try {
            var currentDocIsFlDocument = app.currentDocIsFlDocument();
            var activeDoc = app.getDocumentDOM();
            //just to ensure that focus document is fla document, any upload should not start from scripting kind of documents.
            if (currentDocIsFlDocument && activeDoc) {
                //currently limiting uploading of documents to native docs only.
                //so custom docs are not able to upload to CCLibrary
                layerObject.enableDocumentUpload = activeDoc.validDocForCCLibrary();
                var mergeForSelectionFlag = activeDoc.mergeForSelection;
                activeDoc.mergeForSelection = true;
                layerObject.enableBrushUpload = false;
                var selections = activeDoc.selection;
                var itr, selection, fill, stroke, strokeFill, libItem, instanceType;
                if (selections && selections.length > 0) {
                    //enable the brush upload option if needed
                    layerObject.enableBrushUpload = app.hasPaintBrushesInSelection();

                    for (itr = 0; itr < selections.length; itr++) {
                        selection = selections[itr];
                        layerObject.enableApplyText = false;

                        if (!layerObject.colors || layerObject.colors === undefined) {
                            // Disable text temporarily
                            // if (selection.elementType === ElementType.TEXT) {
                            //    layerObject.enableApplyText = true;
                            //    layerObject.text = $._ADBE_LIBS_CORE.shortenString(selection.getTextString());
                            // TODO: populate the font info
                            // layerObject.fontInfo = getFontInfo();
                            // pushUnique(layerObject.fontInfo.color, JSXGlobals.PS_TEXT);
                            //}
                            // Get the fill and stroke color from selection, not from the global app settings
                            try {
                                fill = selection.getCustomFill(false);
                                // TODO: Handle other fill types
                                if (fill && fill.style === FillStyle.SOLID && fill.color) {
                                    pushUnique(COLOR.colorStringToData(fill.color), JSXGlobals.FILL);
                                }
                            } catch (ignore) {}
                            try {
                                // Get the fill style of stroke and extract the color from that
                                stroke = selection.getCustomStroke(false);
                                if (stroke) {
                                    strokeFill = stroke.shapeFill;
                                    // TODO: Handle other fill types
                                    if (strokeFill && strokeFill.style === FillStyle.SOLID && strokeFill.color) {
                                        pushUnique(COLOR.colorStringToData(strokeFill.color), JSXGlobals.STROKE);
                                    }
                                }
                            } catch (ignore) {}
                            if (layerColors.length > 0) {
                                layerObject.colors = layerColors;
                            }
                        }
                        //check for any selection on stage is kind of symbol
                        if (!layerObject.enableAnimationUpload || layerObject.enableAnimationUpload === false) {
                            if (selection.elementType === ElementType.INSTANCE) {
                                libItem = selection.libraryItem;
                                instanceType = libItem.itemType;
                                if (instanceType === ElementType.MOVIECLIP || instanceType === ElementType.GRAPHIC || instanceType === ElementType.BUTTON) {
                                    layerObject.enableAnimationUpload = true;
                                }
                            }
                        }
                    }
                }
                // Currently we are giving priority to stage over library symbols.
                // if there is any selection on stage then this loop will not run
                // else we will check is there any selection in library panel.
                // This is a temporary behavior which will change soon
                /*if (!layerObject.enableAnimationUpload || layerObject.enableAnimationUpload === false) {
                    var selItems = activeDoc.library.getSelectedItems();
                    var index, type;
                    if (selItems && selItems.length > 0) {
                        for (index = 0; index < selItems.length; index++) {
                            type = selItems[index].itemType;
                            if (type === ElementType.MOVIECLIP || type === ElementType.GRAPHIC || type === ElementType.BUTTON) {
                                layerObject.enableAnimationUpload = true;
                                break;
                            }
                        }
                    }
                }*/
                layerObject.selectionExists = selections !== null;
                activeDoc.mergeForSelection = mergeForSelectionFlag;
                layerObject.kind = "";
                layerObject.enableApplyStyle = false;
                layerObject.enableShapeLayerApplyOperations = false;
                layerObject.libraryLinked = false;
                return JSON.stringify(layerObject);
            }
            return "";
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-getLayerInfo()', ex);
        }
        return JSON.stringify(layerObject);
    },
    placeAsset: function (filePath, libraryName, itemName, elementRef, modifiedTime, creationTime, isLinked, assetMetaData) {
        try {
            var activeDoc = app.getDocumentDOM();
            if (activeDoc && filePath) {
                // Need to make a copy of the file to avoid overwrite
                var fileExtension = filePath.substr(filePath.lastIndexOf(".") + 1).toLowerCase();
                var destPath = File.createTemporaryFile(itemName, fileExtension);
                var sourceURI = FLfile.platformPathToURI(filePath);
                var destURI = FLfile.platformPathToURI(destPath);

                FLfile.copy(sourceURI, destURI);
                if (fileExtension === FileExtension.FLA) {
                    app.openDocument(destURI);
                } else {// removing additional check as app has common api to import asset from CCLibrary
                    activeDoc.importCCLibAsset(destURI, elementRef, modifiedTime, itemName, isLinked);
                }
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-placeAsset()', ex);
        }
    },
    uploadBrushes: function (libraryName) {
        try {
            var index;
            var brushPath;
            var pngPath;
            var brushPathURI;
            var pngPathURI;
            var asset = {};
            var brushes = app.exportPaintBrushesInSelection(libraryName);
            var brushBasePath = Folder.temp.fsName + "/" + new Date().valueOf();
            var pngBasePath = Folder.temp.fsName + "/" + new Date().valueOf();
            asset.files = [];
            for (index = 0; index < brushes.length; ++index) {
                brushPath = brushBasePath + index.toString() + ".brush";
                pngPath = pngBasePath + index.toString() + ".png";
                brushPathURI = FLfile.platformPathToURI(brushPath);
                pngPathURI = FLfile.platformPathToURI(pngPath);
                FLfile.copy(FLfile.platformPathToURI(brushes[index].brushPath), brushPathURI);
                FLfile.copy(FLfile.platformPathToURI(brushes[index].pngPath), pngPathURI);
                if (FLfile.exists(brushPathURI) && FLfile.exists(pngPathURI)) {
                    asset.files.push({
                        'name': brushes[index].name,
                        'primary': {path: brushPath, type: 'application/vnd.adobe.vector.brush+zip'},
                        'rendition': pngPath
                    });
                }
            }
            return JSON.stringify(asset);

        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-uploadBrushes()', ex);
        }
    },
    saveCurrentDoc: function () {
        try {
            app.getDocumentDOM().save(true, true);
            return !(app.getDocumentDOM().isModified());
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-saveCurrentDoc()', ex);
        }
    },
    uploadCurrentDoc: function () {
        try {
            var flaURI = FLfile.platformPathToURI(Folder.temp.fsName + "/" + new Date().valueOf() + ".fla");
            var pngURI = FLfile.platformPathToURI(Folder.temp.fsName + "/" + new Date().valueOf() + ".png");
            var docAsset = app.exportCurrentDocument(flaURI, pngURI);
            var asset = {};
            asset.layerName = docAsset.name;
            asset.files = [];
            if (docAsset.primaryPath && FLfile.exists(FLfile.platformPathToURI(docAsset.primaryPath))) {
                asset.files.push({
                    'path': docAsset.primaryPath,
                    'relationship': 'primary'
                });
                if (docAsset.renditionPath && FLfile.exists(FLfile.platformPathToURI(docAsset.renditionPath))) {
                    asset.files.push({
                        'path': docAsset.renditionPath,
                        'relationship': 'rendition'
                    });
                }
                return JSON.stringify(asset);
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-uploadCurrentDoc()', ex);
        }
    },
    saveAssets: function (info, generateSecondaryFormat, dragAssetId) {
        try {
            var uploadData = [];
            var activeDoc = app.getDocumentDOM();
            if (activeDoc) {
                var baseFlaPath = FLfile.platformPathToURI(Folder.temp.fsName + "/" + info.name + ".fla");
                var basePngPath = FLfile.platformPathToURI(Folder.temp.fsName + "/" + info.name + ".png");
                var selections = activeDoc.selection;
                // We are currently enabling this for single selection of symbol instances
                // This will change in future when XD defines the other workflows
                //var libraryUpload = true;
                var assets = [];
                if (selections && selections.length >= 1) {
                    var itr;
                    for (itr = 0; itr < selections.length; itr++) {
                        if (selections[itr].elementType === ElementType.INSTANCE) {
                            //libraryUpload = false;
                            assets = activeDoc.exportSelectionToSymbol(baseFlaPath, basePngPath, {
                                'fromStage': true
                            });
                        }
                    }
                }
                // Current behavior is we are uploading symbols either from stag or library.
                /*if (libraryUpload) {
                    var selItems = activeDoc.library.getSelectedItems();
                    if (selItems.length > 0) {
                        assets = activeDoc.exportSelectionToSymbol(baseFlaPath, basePngPath, {
                            'fromLibrary': true
                        });
                    }
                }*/
                var asset, index;
                var length = assets.length;
                for (index = 0; index < length; index++) {
                    if (assets[index]) {
                        asset = {};
                        asset.layerName = assets[index].name;
                        asset.files = [];
                        if (assets[index].primaryPath) {
                            asset.files.push({
                                'path': assets[index].primaryPath,
                                'relationship': 'primary'
                            });
                            //we will add only png as a secondary rendition here 
                            //will update this element with other Secondary renditions 
                            // later on the basis of cep elementCreated event.
                            if (assets[index].assetType !== ElementType.BITMAP) {
                                if (assets[index].renditionPath) {
                                    if (FLfile.exists(FLfile.platformPathToURI(assets[index].renditionPath))) {
                                        asset.files.push({
                                            'path': assets[index].renditionPath,
                                            'relationship': 'rendition'
                                        });
                                    }
                                }
                            }
                        }
                        uploadData.push(asset);
                    }
                }
            }
            return JSON.stringify(uploadData);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-saveAssets()', ex);
        }
    },
    openAssetForEdit: function (filePath, renditionPath) {
        try {
            var sourceURI = FLfile.platformPathToURI(filePath);
            var newDoc = app.openDocument(sourceURI, {'addToRecent': false, 'renditionPath': renditionPath, 'ccLibAsset': true});
            return newDoc.name;
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-openAssetForEdit()', ex);
        }
    },
    reportEvent: function (eventName, properties) {
        try {
            if (eventName === "createElement" || eventName === "useElement" || eventName === "createLink") {
                // Log events to Highbeam so Design Library usage can be compared
                // to usage of other Flash features.
                var highbeamDataGroupName = "Design Library";

                // Helper to handle null and undefined properties
                var safeGetStringProperty = function (property) {
                    return property || "N/A";
                };

                var data = {
                    'eventName': safeGetStringProperty(eventName),
                    'libraryID': safeGetStringProperty(properties.libraryID),
                    'elementType': safeGetStringProperty(properties.elementType),
                    'opType': safeGetStringProperty(properties.opType)
                };

                app.logPIPEvent(highbeamDataGroupName, JSON.stringify(data));

                return true;
            }

        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-reportEvent()', ex);
        }

        return false;
    },
    getUserData: function (mode) {
        try {
            return app.getCCXUserJSONData(mode);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('FLPR.jsx-getCCXUserJSONData()', ex);
        }
    }
};
