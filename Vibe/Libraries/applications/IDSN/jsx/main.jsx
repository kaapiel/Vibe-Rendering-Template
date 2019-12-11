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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, unparam: true, todo: true */
/*globals $, app, ToolTipOptions, COLOR, ColorSpace, JSXGlobals, File, Folder, ExportFormat, StrokeFillTargetOptions, TEXT, UndoModes, ColorModel, MeasurementUnits, FitOptions, NothingEnum */

var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';
$.evalFile(extensionPath + 'color.jsx');
$.evalFile(extensionPath + 'text.jsx');

$._ADBE_LIBS_IDSN = {
    setThumbnailExportOptions: function () {
        //Set options on application
        app.setCloudLibraryOptions(JSXGlobals.previewMaxWidth, JSXGlobals.previewMaxHeight);
    },
    setLibraryCollection: function (data) {
        app.setCloudLibraryCollection(data);
    },
    isAppInTouchMode: function () {
        if (app.isAppInTouchMode()) {
            return 'true';
        }
        return 'false';
    },
    getTooltipState: function () {
        if (app.generalPreferences.toolTips !== ToolTipOptions.NONE) {
            return 'true';
        }
        return 'false';
    },
    getIMSUserID: function () {
        return app.userGuid;
    },
    isAnalyticsEnabled: function () {
        if (app.isUserSharingAppUsageData()) {
            return 'true';
        }
        return 'false';
    },
    openAssetForEdit: function (filePath, type, elementRef, fontInfo) {
        try {
            var tempObj = {
                filePath: filePath,
                assetType: type,
                elementRef: elementRef
            };

            if (fontInfo) {
                tempObj.fonts = fontInfo;
            }

            var result = app.openCloudAssetForEdit(JSON.stringify(tempObj));
            if (result) {
                return app.activeDocument.name;
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-openAssetForEdit()', ex);
        }
    },
    openDocumentFromTemplate: function (templatePath, templateName) {
        try {
            app.open(new File(templatePath));
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-openDocumentFromTemplate()', ex);
        }
    },
    placeAsset: function (filePath, libraryName, itemName, elementRef, modifiedTime, creationTime, adobeStockId, adobeStockLicense, isLinked, forceInPlaceGun, isOpenInWorkflow) {
        try {
            var doc;
            try {
                if (app.documents.length !== 0) {
                    //app.activeDocument throws if the only documents that are open, are opened in background.
                    doc = app.activeDocument;
                }
            } catch (ignore) {}

            if (!doc) {
                doc = app.documents.add();
            }

            var currentPage;
            if (doc.layoutWindows.length !== 0) {
                currentPage = doc.layoutWindows[0].activePage;
            }
            if (!currentPage) {
                currentPage = doc.pages[0];
            }

            var measurementUnit = app.scriptPreferences.measurementUnit;
            app.scriptPreferences.measurementUnit = MeasurementUnits.POINTS;

            var size = [200, 300];
            var pageBounds;
            if (currentPage) {
                pageBounds = currentPage.bounds;
            }
            var position;
            if (pageBounds !== undefined && Array.isArray(pageBounds)) {
                position = [(pageBounds[2] - pageBounds[0] - size[0]) / 2, (pageBounds[3] - pageBounds[1] - size[1]) / 2];
            } else {
                position = [0, 0];
            }

            var appIsInTouchMode = app.isAppInTouchMode();

            if (appIsInTouchMode || isOpenInWorkflow) {
                var isIDMSFile = filePath.indexOf('.idms') === filePath.length - 5;
                if (isIDMSFile) {
                    //place and return
                    currentPage.place(filePath, [position[1], position[0]], undefined, false, true);
                    app.scriptPreferences.measurementUnit = measurementUnit;
                    doc.select(NothingEnum.NOTHING);
                    return;
                }
            }

            var obj = {};
            obj.elementRef = elementRef;
            if (adobeStockId) {
                obj.adobeStock = {};
                obj.adobeStock.id = adobeStockId;
                obj.adobeStock.license = adobeStockLicense;
            }

            obj.isLinkedAsset = isLinked;
            if (forceInPlaceGun !== undefined) {
                obj.forceInPlaceGun = forceInPlaceGun;
            }
            var args = JSON.stringify(obj);

            if (appIsInTouchMode || isOpenInWorkflow) {
                //Check if user is in text editing mode.
                var selection = app.selection;
                var selectionClass;
                if (selection.length > 0) {
                    selectionClass = selection[0].__class__;
                }

                if (selection.length === 1 && selection[0] && selection[0].hasOwnProperty('characters')) {
                    if (selectionClass !== 'TextFrame' && selectionClass !== 'Cell') {
                        doc.placeCloudAsset(args);
                        return;
                    }
                }

                var createFrame = false;
                if (selection.length !== 1) {
                    createFrame = true;
                }
                if (createFrame === false) {
                    if (selectionClass === 'XMLElement' || selectionClass === 'XMLAttribute' ||
                            selectionClass === 'XMLComment' || selectionClass === 'XMLInstruction' ||
                            selectionClass === 'Page' || selectionClass === 'Guide' ||
                            selectionClass === 'Cell' || selectionClass === 'Group') {
                        createFrame = true;
                    }
                }
                var placeCloudAsset = function () {
                    var pageItem = selection[0];
                    if (createFrame) {
                        if (pageBounds === undefined || !Array.isArray(pageBounds)) {
                            pageBounds = [0, 0, 0, 0];
                        }
                        var bounds = [];

                        bounds[0] = pageBounds[0] + position[0];
                        bounds[1] = pageBounds[1] + position[1];
                        bounds[2] = pageBounds[0] + position[0] + size[0];
                        bounds[3] = pageBounds[1] + position[1] + size[1];
                        pageItem = currentPage.rectangles.add({
                            geometricBounds: bounds,
                            strokeWeight: 0
                        });
                        doc.select(pageItem);
                    }

                    doc.placeCloudAsset(args);
                    //if image is larger than the page item then fit the image in the frame.
                    var pageItemBounds = pageItem.geometricBounds;
                    var pageItemWidth = pageItemBounds[3] - pageItemBounds[1];
                    var pageItemHeight = pageItemBounds[2] - pageItemBounds[0];

                    var imageBounds = pageItem.allGraphics[0].geometricBounds;
                    var imageWidth = imageBounds[3] - imageBounds[1];
                    var imageHeight = imageBounds[2] - imageBounds[0];
                    if (imageHeight > pageItemHeight || imageWidth > pageItemWidth) {
                        pageItem.fit(FitOptions.PROPORTIONALLY);
                    }
                    if (createFrame) {
                        pageItem.fit(FitOptions.FRAME_TO_CONTENT);
                        doc.select(NothingEnum.NOTHING);
                    }
                    app.scriptPreferences.measurementUnit = measurementUnit;
                };

                //Jsut to placate JSLint error for unused placeCloudAsset
                if (app.doScript === undefined) {
                    placeCloudAsset();
                }

                app.doScript(
                    'placeCloudAsset();',
                    undefined,
                    undefined,
                    UndoModes.entireScript,
                    '$ID/Place'
                );
            } else {
                doc.placeCloudAsset(args);
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-placeAsset()', ex);
        }
    },
    setColor: COLOR.setColor,
    addColor: COLOR.addColor,
    createColorGroup: COLOR.createColorGroup,
    setFillColor: COLOR.setFillColor,
    setStrokeColor: COLOR.setStrokeColor,
    getLayerColor: function () {
        try {
            return JSON.stringify(JSXGlobals.colorModifiedByUser);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getLayerColor()', ex);
        }
    },
    replaceColor: function (colorData) {
        try {
            var colorPickerData,
                originalColorValue = {};
            var colorChanged = false;

            originalColorValue = COLOR.dataToColorValue(colorData);
            colorPickerData = app.invokeColorPicker(originalColorValue.space, originalColorValue.vals);

            if (colorPickerData && colorPickerData !== 'undefined') {
                var modifiedColor = JSON.parse(colorPickerData);
                var modifiedColorSpace;
                if (modifiedColor.colorSpace === 'RGB') {
                    modifiedColorSpace = ColorSpace.RGB;
                } else if (modifiedColor.colorSpace === 'CMYK') {
                    modifiedColorSpace = ColorSpace.CMYK;
                } else if (modifiedColor.colorSpace === 'Lab') {
                    modifiedColorSpace = ColorSpace.LAB;
                }

                colorChanged = (modifiedColorSpace !== originalColorValue.space);
                if (!colorChanged) {
                    colorChanged = !COLOR.areColorValsEqual(modifiedColor.colorVals, originalColorValue.vals);
                }

                originalColorValue.space = modifiedColorSpace;
                originalColorValue.vals = modifiedColor.colorVals;
            }

            JSXGlobals.colorModifiedByUser = COLOR.colorValueToData(originalColorValue);
            return colorChanged ? 'true' : 'false';
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-replaceColor()', ex);
        }
    },
    isFontAvailable: TEXT.isFontAvailable,
    setFont: TEXT.setFont,
    addTextStyle: TEXT.addTextStyle,
    saveTextStylePreview: TEXT.saveTextStylePreview,
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
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getLayerName()', ex);
            return '';
        }
    },
    getLayerInfo: function () {
        try {
            var layerObject = {};
            var layerColors = [];

            var areEqual = function (colorData1, colorData2) {
                return colorData1 && colorData2 && JSON.stringify(colorData1[0].value) === JSON.stringify(colorData2[0].value);
            };

            var pushUnique = function (colorData, colorType, colorName) {
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
                    'data': colorData,
                    'name': colorName
                });
            };

            var doc;
            try {
                if (app.documents.length !== 0) {
                    //app.activeDocument throws if the only documents that are open, are opened in background.
                    doc = app.activeDocument;
                }
            } catch (ignore) {}
            if (!doc) {
                layerObject.noDocState = true;
            }

            var selection = app.selection;
            var selectionClass;
            if (selection.length > 0) {
                selectionClass = selection[0].__class__;
            }

            try {
                //With selection as document structure node, or a page, the stroke/fill proxy gets
                //disabled, and asserts when accessed. We report no color or selection in such cases.
                if (selectionClass === 'XMLElement' || selectionClass === 'XMLAttribute' ||
                        selectionClass === 'XMLComment' || selectionClass === 'XMLInstruction' ||
                        selectionClass === 'Page') {
                    return; //undefined
                }
            } catch (ignore) {
                //Possibly no-doc state,  move on.
            }

            var fillTooltip = JSXGlobals.FILL;
            var strokeTooltip = JSXGlobals.STROKE;

            var selectionTarget = app.strokeFillProxySettings.target;
            if (selectionTarget === 'undefined') {
                return;
            }

            if (selectionTarget === StrokeFillTargetOptions.formattingAffectsText) {
                // We are targeting text color when 'Formatting affects text' is ON, either explicitly,
                // or implicitly by virtue of text selection.
                fillTooltip = JSXGlobals.ID_TEXT_FILL;
                strokeTooltip = JSXGlobals.ID_TEXT_STROKE;
            }

            var colorValue;
            try {
                var fillColor = app.strokeFillProxySettings.fillColor;
                colorValue = COLOR.colorToColorValue(fillColor);
                if (colorValue) {
                    pushUnique(COLOR.colorValueToData(colorValue), fillTooltip, colorValue.name);
                }
            } catch (ignore) {}

            try {
                var strokeColor = app.strokeFillProxySettings.strokeColor;
                colorValue = COLOR.colorToColorValue(strokeColor);
                if (colorValue) {
                    pushUnique(COLOR.colorValueToData(colorValue), strokeTooltip, colorValue.name);
                }
            } catch (ignore) {}

            layerObject.colors = layerColors;

            //Starting with selectionExists as false. For no doc state, app.selection below
            //throws, and would otherwise result in 'Add Graphic' being enabled.
            layerObject.selectionExists = false;

            try {
                layerObject.selectionExists = (selection && selection.length > 0);
                layerObject.textSelectionExists = false;

                if (selection.length > 0) {
                    if (selectionClass === 'Guide') {
                        //If the selection is only guides, we disable 'Add Graphic'.
                        //Checking just the first item is good enough as guides can't be
                        //selected along with other page items.
                        layerObject.selectionExists = false;
                    } else if (selectionClass === 'Cell') {
                        //If the selection is only table cells, we disable 'Add Graphic'.
                        //Checking just the first item is good enough as table cells can't be
                        //selected along with other page items.
                        layerObject.selectionExists = false;
                    }
                }

                layerObject.kind = '';
                var maxLength = 100;
                if (selection.length === 1 && selection[0] && selection[0].hasOwnProperty('characters')) {
                    var contents = '';
                    if (selectionClass !== 'TextFrame' && selectionClass !== 'Cell') {
                        contents = selection[0].contents;
                    } else {
                        var textObj = selection[0].parentStory;
                        var paraItr = 0, paragraph;
                        var numParagraphs  = textObj.paragraphs.length;
                        for (paraItr = 0; paraItr < numParagraphs; ++paraItr) {
                            paragraph = textObj.paragraphs[paraItr];
                            if (paragraph) {
                                contents += paragraph.texts[0].contents + ' ';
                                if (contents.length > maxLength) {
                                    break;
                                }
                            } else {
                                break;
                            }
                        }
                    }

                    if (contents.__class__ === 'String') {
                        contents = $._ADBE_LIBS_CORE.shortenString(contents, false, maxLength);
                    }

                    if (selectionClass !== 'TextFrame' && selectionClass !== 'Cell') {
                        // If we have text selection, turn off selectionExists to avoid enabling of 'Add Graphic'
                        // in the DL panel. Add a new flag textSelectionExists in that case to still allow application
                        // of color to text.
                        layerObject.selectionExists = false;
                        layerObject.insertionPointExists = false;

                        if (selectionClass === 'InsertionPoint') {
                            layerObject.insertionPointExists = true;
                        } else {
                            layerObject.textSelectionExists = true;
                        }
                        layerObject.text = (contents !== '') ? contents : ' '; // For enabling 'Add Text Style' for InsertionPoint selection
                    } else {
                        layerObject.text = contents;
                    }

                    //We no longer need to collect text attributes for IDSN.
                    //layerObject.fontInfo = TEXT.getTextAttributesObject(selection[0].texts[0]);
                    layerObject.kind = 'LayerKind.TEXT';

                    var text = selection[0].texts[0];
                    layerObject.isAppliedCharStyleSupported = TEXT.canAddTypeStyle(text, true);
                    layerObject.isAppliedParaStyleSupported = TEXT.canAddTypeStyle(text, false);

                    if (selectionClass === 'Text' || selectionClass === 'TextColumn' || selectionClass === 'TextStyleRange' || selectionClass === 'InsertionPoint'
                            || selectionClass === 'Word' || selectionClass === 'Line' || selectionClass === 'Paragraph') {
                        layerObject.canAddTextAsset = true;
                        layerObject.canBringTextInline = true;
                    } else {
                        layerObject.canAddTextAsset = true;
                    }
                }

                layerObject.name = 'None';
                if (layerObject.selectionExists) {
                    if (selection[0] && selection[0].name !== '') {
                        layerObject.name = selection[0].name;
                        layerObject.fullName = selection[0].name;
                    } else {
                        if (app.activeDocument.activeLayer) {
                            layerObject.name = app.activeDocument.activeLayer.name;
                            layerObject.fullName = app.activeDocument.activeLayer.name;
                        }
                    }
                    layerObject.name = $._ADBE_LIBS_CORE.shortenString(layerObject.name, false, JSXGlobals.maxNameLength);
                }
            } catch (ignore) {}
            return JSON.stringify(layerObject);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getLayerInfo()', ex);
        }
    },
    getCurrentStates: function () {
        if (app.documents.length > 0) {
            var docPath = '';
            try {
                if (app.activeDocument.saved) {
                    docPath = app.activeDocument.fullName;
                } else {
                    // Not saved even once
                    docPath = app.activeDocument.name;
                }
            } catch (ignore) {}

            if (docPath !== '') {
                //We are not using the LayerID anymore. Hence hardcode it.
                // TODO: Safely get rid of layerID after MAX
                return JSON.stringify({
                    'path': docPath,
                    'layerID': 2
                });
            }
        }
        return JSON.stringify({
            'path': '',
            'layerID': -1
        });
    },
    saveAssets: function (info, generateSecondaryFormat, dragAssetId) {
        try {
            var fileData = {};
            fileData.files = [];

            //Generate renditions for DL
            //IDMS (InDesign snippet) as primary, PDF as alternate, and PNG for DL local rendition.
            var basePath = Folder.temp.fsName + '/' + info.name;

            var idmsPath = basePath + '.idms';
            var idmsFile = new File(idmsPath);
            app.exportSelectionForCloudLibrary(idmsFile);

            if (!idmsFile.exists) {
                throw 'Could not extract selection.';
            }

            //Add snippet as primary rendition
            fileData.files.push({
                path: idmsPath,
                relationship: 'primary'
            });

            //Add PDF as alternate rendition
            var pdfPath = basePath + '.pdf';
            var pdfFile = new File(pdfPath);
            if (!pdfFile.exists) {
                throw 'Could not extract selection.';
            }

            fileData.files.push({
                path: pdfPath,
                relationship: 'rendition'
            });

            //Add the DL rendition
            var pngPath = basePath + '.png';
            var pngFile = new File(pngPath);
            if (pngFile.exists) {
                fileData.rendition = pngPath;
            }

            fileData.layerName = $._ADBE_LIBS_IDSN.getLayerName();

            // TODO: Set layerIds and documentId on fileData if you want it to be returned with the
            // "com.adobe.DesignLibraries.events.ElementCreated" CSEvent that is sent
            // after element creation.

            return JSON.stringify(fileData);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-saveAssets()', ex);
        }
    },
    getColorDataFromJSON: function (data) {
        //convert a colorValue represented as JSON data to colorData
        //sent by host in drag/drop data, color related events etc.
        var colorObj = JSON.parse(data);

        var colorValue = {};
        colorValue.name = '';

        var colorSpace = colorObj.colorSpace;
        if (colorSpace === 'CMYK') {
            colorValue.space = ColorSpace.CMYK;
        } else if (colorSpace === 'RGB') {
            colorValue.space = ColorSpace.RGB;
        } else if (colorSpace === 'LAB') {
            colorValue.space = ColorSpace.LAB;
        } else {
            return; //undefined
        }

        colorValue.vals = colorObj.colorValues;

        var colorModel = colorObj.colorModel;
        if (colorModel === 'spot') {
            colorValue.model = ColorModel.SPOT;
            colorValue.name = colorObj.colorName;
        } else if (colorModel === 'process') {
            colorValue.model = ColorModel.PROCESS;
        } else {
            return; //undefined
        }

        var colorData = COLOR.colorValueToData(colorValue);
        return JSON.stringify(colorData);
    },
    getCharStyleInfo: function () {
        try {
            var styleObj = TEXT.getTypeStyleInfo(true);
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getCharStyleInfo()', ex);
        }
    },
    getParaStyleInfo: function () {
        try {
            var styleObj = TEXT.getTypeStyleInfo(false);
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getParaStyleInfo()', ex);
        }
    },
    getCharStyleInfoByID: function (documentID, styleID) {
        try {
            var styleObj = TEXT.getTypeStyleInfoByID(documentID, styleID, true);
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getCharStyleInfoByID()', ex);
        }

    },
    getParaStyleInfoByID: function (documentID, styleID) {
        try {
            var styleObj = TEXT.getTypeStyleInfoByID(documentID, styleID, false);
            return JSON.stringify(styleObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getParaStyleInfoByID()', ex);
        }
    },
    getTextInfo: function () {
        try {
            var textObj = TEXT.getTextInfo();
            return JSON.stringify(textObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getText()', ex);
        }
    },
    getTextInfoFromSnippet: function (path) {
        try {
            var textObj = TEXT.getTextInfoFromSnippet(path);
            return JSON.stringify(textObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getTextInfoFromSnippet()', ex);
        }
    },
    getTextInfoFromDocument: function (path) {
        try {
            var textObj = TEXT.getTextInfoFromDocument(path);
            return JSON.stringify(textObj);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getTextInfoFromDocument()', ex);
        }
    },
    placeText: TEXT.placeText,
    getSnippetForText: TEXT.getSnippetForText,
    getUserData: function (mode) {
        try {
            return app.getCCXUserJSONData(mode);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getCCXUserJSONData()', ex);
        }
    }
};
