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
/*global $, Folder, DocumentColorSpace, app, File, SaveOptions, ImageColorSpace, ColorConvertPurpose, ExportOptionsSVG,
         SVGFontSubsetting, SVGFontType, ExportType, JSXGlobals, CMYKColor, GrayColor, LabColor, TEXT, UTIL, COLOR, ExportOptionsPNG24, Dimensions, OpenOptions, ColorModel */


var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';
$.evalFile(extensionPath + 'util.jsx');
$.evalFile(extensionPath + 'color.jsx');
$.evalFile(extensionPath + 'text.jsx');


function padZero(str) {
    return "000000".substr(str.length) + str;
}

function getThumbnailOptions() {
    var options = new ExportOptionsPNG24();
    options.antiAliasing = true;
    options.transparency = true;
    var dimn = new Dimensions();
    dimn.width = JSXGlobals.previewMaxWidth;
    dimn.height = JSXGlobals.previewMaxHeight;
    options.dimensions = dimn;

    return options;
}

$._ADBE_LIBS_ILST = {
    loadAndSelectBrush: function (filePath, brushName) {
        try {
            app.activeDocument.brushes.add(new File(filePath), brushName);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-loadAndSelectBrush()', ex);
        }
    },
    replaceColor: function (colorData) {
        try {
            var originalColor = COLOR.dataToSolidColor(colorData);
            var modifiedColor = app.showColorPicker(originalColor);
            JSXGlobals.colorModifiedByUser = modifiedColor;
            return (originalColor !== modifiedColor);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-replaceColor()', ex);
        }
    },
    replaceTextStyle: TEXT.replaceTextStyle,
    isFontAvailable: TEXT.isFontAvailable,
    getSelectedSwatchList: function () {
        try {
            var activeDoc = app.activeDocument;
            var result = [];
            var i;
            if (activeDoc) {
                var swatches = activeDoc.swatches;
                if (swatches) {
                    var swatchList = swatches.getSelected(false);
                    if (swatchList && swatchList.length) {
                        for (i = 0; i < swatchList.length; i++) {
                            result.push({
                                'name': swatchList[i].name,
                                'data': COLOR.solidColorToData(swatchList[i].color)
                            });
                        }
                    }
                }
            }
            return JSON.stringify(result);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getSelectedSwatchList()', ex);
        }
    },
    getSelectedSwatchGroupList: function () {
        try {
            var activeDoc = app.activeDocument;
            var result = [];
            var i;
            var j;
            var swatchMoodKey = "mood";
            var swatchCollectionkey = "swatches";
            var swatchGroupList;
            var allSwatchesInColorTheme;

            var colorThemeObj;
            var swatchCollection;
            var swatchObj;
            if (activeDoc) {
                var swatchGroups = activeDoc.swatchGroups;
                if (swatchGroups) {
                    swatchGroupList = swatchGroups.getSelected();
                    if (swatchGroupList && swatchGroupList.length) {
                        for (i = 0; i < swatchGroupList.length; i++) {
                            colorThemeObj = {};
                            swatchCollection = [];
                            colorThemeObj[swatchMoodKey] = swatchGroupList[i].name;
                            allSwatchesInColorTheme = swatchGroupList[i].getAllSwatches();
                            for (j = 0; j < allSwatchesInColorTheme.length; j++) {
                                swatchObj = allSwatchesInColorTheme[j];
                                swatchCollection.push(COLOR.solidColorToData(swatchObj.color));
                            }
                            colorThemeObj[swatchCollectionkey] = swatchCollection;
                            result.push(colorThemeObj);
                        }
                    }
                }
            }
            return JSON.stringify(result);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getSelectedSwatchList()', ex);
        }
    },
    placeAsset: function (filePath, libraryName, itemName, elementRef, modifiedTime, creationTime, adobeStockId, adobeStockLicense, isLinked, isOpenIn) {
        // https://forums.adobe.com/message/4896032
        // Place doesn't necessarily give you the exact artwork that is in the file,
        // copy/paste is the only way to get this.
        try {
            var assetFile = new File(filePath);
            if (!app || app.documents.length === 0 || !app.activeDocument) {
                if (isOpenIn === true) {
                    app.documents.add();
                } else {
                    // Need to make a copy of the file to avoid overwrite
                    var fileExtension = filePath.substr(filePath.lastIndexOf(".") + 1).toLowerCase();
                    var destPath = Folder.temp.fsName + '/' + new Date().valueOf() + '.' + fileExtension;

                    assetFile.copy(destPath);
                    $._ADBE_LIBS_ILST.openAsset(destPath);
                    return;
                }
            }
            var shouldLoadToPlaceGun = !isOpenIn;
            app.activeDocument.importFile(assetFile, isLinked, libraryName, itemName, elementRef,
                modifiedTime, creationTime, adobeStockId, adobeStockLicense, shouldLoadToPlaceGun);

        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-placeAsset()', ex);
        }
    },
    openAsset: function (filePath) {
        try {
            var newDoc = app.open(new File(filePath));
            return newDoc.name;
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-openAsset()', ex);
        }
    },
    openAssetForEdit: function (filePath, thumbnailPath, assetType) {
        if (thumbnailPath) {
            try {
                var options = new OpenOptions();
                options.addToRecentFiles = false;
                var newDoc = app.openCloudLibraryAssetForEditing(new File(filePath), new File(thumbnailPath), assetType, options);
                return newDoc.name;
            } catch (ex) {
                $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-openAssetForEdit()', ex);
            }
        } else {
            return $._ADBE_LIBS_ILST.openAsset(filePath);
        }
    },
    getUpdatedTextInfo: function (path) {
        try {
            var textObj = TEXT.getUpdatedTextInfo(path);
            return JSON.stringify(textObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getUpdatedTextInfo()', ex);
        }
    },
    openDocumentFromTemplate: function (templatePath, templateName) {
        try {
            app.open(new File(templatePath));
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-openDocumentFromTemplate()', ex);
        }
    },
    addSwatchGroup: function (colorTheme, groupName) {
        if (colorTheme) {
            try {
                var activeDoc = app.activeDocument;
                var j;
                var swatchMoodKey = "mood";
                var swatchCollectionkey = "swatches";
                var swatchObj;
                var swatchGroupObj;
                var colorObj;
                var colorCollection;
                var colorRep;

                if (activeDoc) {
                    var swatchGroups = activeDoc.swatchGroups;
                    if (swatchGroups) {
                        swatchGroupObj = swatchGroups.add();
                        swatchGroupObj.name = groupName || colorTheme[swatchMoodKey];

                        colorCollection = colorTheme[swatchCollectionkey];
                        for (j = 0; j < colorCollection.length; j++) {
                            colorObj = COLOR.getBestColorRepresentation(colorCollection[j]);
                            colorRep = COLOR.dataToSolidColor(colorObj);
                            if (colorObj.type === "spot") {
                                swatchGroupObj.addSpot(colorRep.spot);
                            } else {
                                swatchObj = activeDoc.swatches.add();
                                swatchObj.color = colorRep;
                                swatchObj.name = COLOR.getDisplayName(colorObj);
                                swatchGroupObj.addSwatch(swatchObj);
                            }
                        }
                    }
                }
            } catch (ex) {
                $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-addSwatchGroup()', ex);
                return 'err';
            }
        }
    },
    openSwatchPanel: function () {
        try {
            app.sendScriptMessage("AdobeSwatch_", "Open Swatches Panel", "");
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-openSwatchPanelopen()', ex);
        }
    },
    setColor: COLOR.setColor,
    addColor: COLOR.addColor,
    setFillColor: COLOR.setFillColor,
    setStrokeColor: COLOR.setStrokeColor,
    setFont: TEXT.setFont,
    createTextLayer: TEXT.createTextLayer,
    getCurrentState: function () {
        try {
            if (app.documents.length > 0) {
                //if (app.selection && app.selection.length > 0) {
                //var selectedLayer = app.activeDocument.activeLayer;

                var docPath = app.activeDocument.name;
                if (app.activeDocument.fullName) {
                    docPath = app.activeDocument.fullName.fsName;
                }
                /*var pageItems = selectedLayer.pageItems;
                var fullSelection = "";
                var i;
                for (i = 0; i < pageItems.length; i++) {
                    if (pageItems[i].selected === true) {
                        fullSelection += $._ADBE_LIBS_ILST.getItemID(pageItems[i]) + pageItems[i].typename + ", ";
                    }
                }
                var layerID = $._ADBE_LIBS_ILST.getItemID(app.selection[0]) + "_" + $._ADBE_LIBS_ILST.getItemID(selectedLayer) + "===" + fullSelection;*/

                //We are not using the LayerID anymore. Hence hardcode it.
                // TODO: Safely get rid of layerID after MAX
                return JSON.stringify({
                    'path': docPath,
                    'layerID': 2
                });
                //}
            }
            return JSON.stringify({
                'path': '',
                'layerID': -1
            });
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getCurrentState()', ex);
        }
    },
    getItemID: function (layer) {
        try {
            var layerID = layer.name;
            if (layer.hasOwnProperty("zOrderPosition")) {
                try {
                    layerID += "_" + layer.zOrderPosition;
                } catch (ignore) {}
            }
            return layerID;
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getItemID()', ex);
        }
    },
    getLayerName: function () {
        try {
            var finalName = '';
            // If the selection has exactly one item, and that item has a name, then return that.
            // Otherwise, return the empty string.
            var appSelection = app.selection;
            if (appSelection.length === 1 && appSelection[0] && appSelection[0].name !== "") {
                finalName = appSelection[0].name;
            }
            return finalName;
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getLayerName()', ex);
            return '';
        }
    },
    getLayerInfo: function () {
        try {
            var layerObject = {};
            var layerColors = [];
            var fillTooltip = JSXGlobals.FILL;
            var strokeTooltip = JSXGlobals.STROKE;
            var isFontAvailableinAI = true;
            var areEqual = function (colorData1, colorData2) {
                return colorData1 && colorData2 && JSON.stringify(colorData1[0].value) === JSON.stringify(colorData2[0].value);
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
            var populateTextOptionsInLayerObject = function (layerObject, selection) {
                layerObject.kind = "LayerKind.TEXT"; /// kind need to be Layerkind.Text to enable the button
                layerObject.text = selection.contents;
                if (layerObject.text === "") {
                    layerObject.text = "Random Text"; ///For enabling 'Add Text Style'
                }
                fillTooltip = JSXGlobals.AI_TEXT_FILL;
                strokeTooltip = JSXGlobals.AI_TEXT_STROKE;
                try {
                    layerObject.canAddTextAsset = true;
                    if (selection && selection.length > 0 && selection.characterAttributes && selection.characterAttributes.textFont) {
                        isFontAvailableinAI = app.textFonts.isFontAvailable(selection.characterAttributes.textFont.name);
                    } else if (selection && selection.length === 0) {
                        var currentFont = app.textFonts.getCurrentFont();
                        isFontAvailableinAI = app.textFonts.isFontAvailable(currentFont);
                        layerObject.canAddTextAsset = true;
                        layerObject.insertionPointExists = true;
                    }
                } catch (ignore) {

                }

                /*if (selection.contents !== "") {
                    var responce = app.sendScriptMessage("Design Library", "Is Style Supported", "null");
                    if (responce) {
                        layerObject.isStylesSupported = {};
                        layerObject.isStylesSupported = JSON.parse(responce);
                        if (selection && selection.characterAttributes && selection.characterAttributes.textFont) {
                            layerObject.isStylesSupported.fontAvailable = app.textFonts.isFontAvailable(selection.characterAttributes.textFont.name);
                        }
                    }
                }*/
            };

            var appSelection = app.selection;
            if (appSelection) {
                var selection = appSelection;

                layerObject.kind = "";
                if (selection) {
                    if (selection.length === 1 && selection[0] && selection[0].__class__ === "TextFrame") {
                        selection = selection[0].textRange;
                        populateTextOptionsInLayerObject(layerObject, selection);
                    } else if (selection.__class__ === "TextRange") {
                        populateTextOptionsInLayerObject(layerObject, selection);
                    }
                }

                try {
                    var fillColor = app.activeDocument.defaultFillColor;
                    pushUnique(COLOR.solidColorToData(fillColor), fillTooltip);
                } catch (ignore) {}

                try {
                    var strokeColor = app.activeDocument.defaultStrokeColor;
                    pushUnique(COLOR.solidColorToData(strokeColor), strokeTooltip);
                } catch (ignore) {}

                layerObject.colors = layerColors;

                // Looping through the pageItems is taking too long. Hence commenting it out
                /*var selectedLayer = app.activeDocument.activeLayer;
                var pageItems = selectedLayer.pageItems;
                var numItemsSelected = 0;
                var i;
                for (i = 0; i < pageItems.length; i++) {
                    if (pageItems[i].selected === true) {
                        numItemsSelected++;
                    }
                }*/

                layerObject.name = "None";

                // && pageItems.length !== numItemsSelected
                if (selection[0] && selection[0].name !== "") {
                    layerObject.name = selection[0].name;
                    layerObject.fullName = selection[0].name;
                } else {
                    if (app.activeDocument.activeLayer) {
                        layerObject.name = app.activeDocument.activeLayer.name;
                        layerObject.fullName = app.activeDocument.activeLayer.name;
                    }
                }
                layerObject.name = $._ADBE_LIBS_CORE.shortenString(layerObject.name, false, JSXGlobals.maxNameLength);
                layerObject.selectionExists = (appSelection && appSelection.length > 0);

                layerObject.isAppliedCharStyleSupported = false;
                layerObject.isAppliedParaStyleSupported = false;
                if (layerObject.kind === "LayerKind.TEXT" && isFontAvailableinAI) {
                    layerObject.isAppliedCharStyleSupported = true;
                    layerObject.isAppliedParaStyleSupported = true;
                }
                //If we happen to have a selection that is not an array but a TextRange object
                //then we are in text edit mode and should report no selection to disable adding it as a graphic
                //but we still wish to allow applying colors to textRange
                if (appSelection && appSelection.typename === 'TextRange') {
                    layerObject.selectionExists = false;
                    // Ensure text selection and not just insertion point
                    if (appSelection.length > 0) {
                        layerObject.textSelectionExists = true;
                    }
                }
            }
            return JSON.stringify(layerObject);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getLayerInfo()', ex);
        }
    },
    getLayerColor: function () {
        try {
            var colorObject = COLOR.solidColorToData(JSXGlobals.colorModifiedByUser);
            return JSON.stringify(colorObject);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getLayerColor()', ex);
        }
    },
    getLayerFontStyle: function (docName) {
        try {
            var docRef = $._ADBE_LIBS_CORE.getDocument(docName);
            if (docRef) {
                docRef.layers[0].textFrames[0].selected = true;
                var layerObject = {};
                var selection = app.selection;
                var selectionFont = selection[0].textRange.characterAttributes.textFont;

                layerObject.text = $._ADBE_LIBS_CORE.shortenString(selection[0].contents);
                layerObject.fontInfo = selectionFont.family + ";" + selectionFont.style + ";" + selection[0].textRange.characterAttributes.size;
                layerObject.textColor = COLOR.solidColorToData(app.activeDocument.defaultFillColor).color;
                return JSON.stringify(layerObject);
            }
            return undefined;
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getLayerFontStyle()', ex);
        }
    },
    getLayerBounds: function () {
        try {
            var selection = app.activeDocument.selection;
            var artboardRect = app.activeDocument.artboards[0].artboardRect;
            var firstItem = UTIL.getRealPosition(artboardRect, selection[0].position);
            var bounds;
            var i;
            var itemBounds, controlBounds;
            for (i = 0; i < selection.length; i++) {
                itemBounds = UTIL.getRealPosition(artboardRect, selection[i].position);
                controlBounds = selection[i].controlBounds;

                itemBounds.width = Math.abs(controlBounds[0] - controlBounds[2]);
                itemBounds.height = Math.abs(controlBounds[1] - controlBounds[3]);
                itemBounds.right = itemBounds.left + itemBounds.width;
                itemBounds.bottom = itemBounds.top + itemBounds.height;

                if (i === 0) {
                    bounds = itemBounds;
                    continue;
                }

                if (itemBounds.top < bounds.top) {
                    bounds.top = itemBounds.top;
                }
                if (itemBounds.left < bounds.left) {
                    bounds.left = itemBounds.left;
                }
                if (itemBounds.right > bounds.right) {
                    bounds.right = itemBounds.right;
                }
                if (itemBounds.bottom > bounds.bottom) {
                    bounds.bottom = itemBounds.bottom;
                }
            }

            if (bounds) {
                bounds.width = bounds.right - bounds.left;
                bounds.height = bounds.bottom - bounds.top;
            }

            var info = {};
            info.name = $._ADBE_LIBS_CORE.shortenString(selection[0].name, false, JSXGlobals.maxNameLength);
            info.bounds = bounds;
            info.artboard = artboardRect;
            info.firstItem = firstItem;

            return JSON.stringify(info);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getLayerBounds()', ex);
        }
    },
    saveAsSVG: function (filePath) {
        try {
            var svgFile = new File(filePath);
            var exportOptions = new ExportOptionsSVG();
            exportOptions.embedRasterImages = true;
            exportOptions.embedAllFonts = true;
            exportOptions.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
            exportOptions.fontType = SVGFontType.SVGFONT;
            app.activeDocument.exportFile(svgFile, ExportType.SVG, exportOptions);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-saveAsSVG()', ex);
        }
    },
    saveAsPNG: function (filePath, exportFullFile) {
        try {
            var pngFile = new File(filePath);

            var options = getThumbnailOptions();
            if (exportFullFile) {
                app.activeDocument.exportFile(pngFile, ExportType.PNG24, options);
            } else {
                app.activeDocument.exportSelectionAsPNG(pngFile, options);
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-saveAsPNG()', ex);
        }
    },
    setThumbnailExportOptions: function () {
        return undefined;
        //try {
        // TODO: Enable this when exportCloudLibraryAsset() API bugs are fixed
        //app.setThumbnailOptionsForCloudLibrary(getThumbnailOptions());
        //} catch (ex) {}
    },
    saveAssets: function (info, generateSecondaryFormat, dragAssetId) {
        try {
            var fileData = {};
            fileData.files = [];
            /*var svgPath;
            if (generateSecondaryFormat) {
                // ** Save as SVG file **
                svgPath = Folder.temp.fsName + "/" + info.name + ".svg";
                $._ADBE_LIBS_ILST.saveAsSVG(svgPath);
            }*/

            var pngPath = Folder.temp.fsName + "/" + info.name + ".png";
            $._ADBE_LIBS_ILST.saveAsPNG(pngPath);
            fileData.rendition = pngPath;

            //If we couldn't create the PNG file correctly then there is no rendition
            var checkFile = new File(pngPath);
            if (!checkFile.exists) {
                delete fileData.rendition;
            }

            // ** Save as AI file **
            var aiPath = Folder.temp.fsName + "/" + info.name + ".ai";
            var aiFile = new File(aiPath);
            //app.activeDocument.saveAs(aiFile);
            app.activeDocument.exportSelectionAsAi(aiFile);

            checkFile = new File(aiPath);
            if (!checkFile.exists) {
                throw "Could note extract selection.";
            }

            // TODO: Enable this when exportCloudLibraryAsset() API bugs are fixed
            //app.exportCloudLibraryAsset(aiFile, new File(pngPath), dragAssetId);

            fileData.files.push({
                path: aiPath,
                relationship: 'primary'
            });

            /*if (svgPath) {
                fileData.files.push({path: svgPath, relationship: 'alternate'});
            }*/

            fileData.layerName = $._ADBE_LIBS_ILST.getLayerName();

            // TODO: Set layerIds and documentId on fileData if you want it to be returned with the
            // "com.adobe.DesignLibraries.events.ElementCreated" CSEvent that is sent
            // after element creation.

            return JSON.stringify(fileData);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-saveAssets()', ex);
        }
    },
    getTooltipState: function () {
        return app.preferences.getBooleanPreference('showToolTips');
    },
    getIMSUserID: function () {
        return app.userGUID;
    },
    isAnalyticsEnabled: function () {
        return app.isUserSharingAppUsageData();
    },
    closeDocument: function () {
        return app.activeDocument.close();
    },
    getParaStyleInfo: function () {
        try {
            var styleObj = TEXT.getParagraphStyle();
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getParaStyleInfo()', ex);
        }
    },
    getCharStyleInfo: function () {
        try {
            var styleObj = TEXT.getCharacterStyle();
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getCharStyleInfo()', ex);
        }
    },
    addCharStyleById: function (id) {
        try {
            var styleObj = TEXT.getCharacterStyleById(id);
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getCharStyleInfo()', ex);
        }

    },
    addParaStyleById: function (id) {
        try {
            var styleObj = TEXT.getParagraphStyleById(id);
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getCharStyleInfo()', ex);
        }

    },
    getTextInfo: function () {
        try {
            var textObj = TEXT.getTextInfo();
            return JSON.stringify(textObj);
        } catch (ex) {
            alert(ex);
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getText()', ex);
        }
    },
    getAiFileForText: TEXT.getAiFileForText,
    getUserData: function (mode) {
        try {
            return app.getCCXUserJSONData(mode);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getCCXUserJSONData()', ex);
        }
    }
};

$._ADBE_LIBS_CORE.isDocumentOpen = function (path) {
    if ($.os.indexOf('Windows') > -1) {
        path = path.split('/').join('\\');
    }
    var hasMatch = false;
    try {
        hasMatch = app.getIsFileOpen(path);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-isDocumentOpen()', ex);
    }
    return JSON.stringify(hasMatch);
};
