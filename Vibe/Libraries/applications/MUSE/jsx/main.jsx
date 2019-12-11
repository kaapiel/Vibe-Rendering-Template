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
/*globals $, app, ToolTipOptions, COLOR, ColorSpace, JSXGlobals, File, Folder */

var extensionPath = $.fileName.split('/').slice(0, -1).join('/') + '/';
$.evalFile(extensionPath + 'color.jsx');

$._ADBE_LIBS_MUSE = {
    getLayerColor: COLOR.getLayerColor,
    replaceColor: COLOR.replaceColor,
    setColor: COLOR.setColor,
    setStrokeColor: COLOR.setStrokeColor,
    setBrowserFillColor: COLOR.setBrowserFillColor,
    addSwatch: COLOR.addSwatch,
    dragColor: COLOR.dragColor,

    getTooltipState: function () {
        return 'true';
    },
    getIMSUserID: function () {
        return app.userGUID;
    },
    isAnalyticsEnabled: function () {
        if (app.isUserSharingAppUsageData()) {
            return 'true';
        }

        return 'false';
    },
    getCurrentState: function () {
        if (app.documents.length > 0) {
            var docPath = '';
            try {
                if (app.activeDocument.saved) {
                    docPath = app.activeDocument.fullName;
                } else {
                    docPath = app.activeDocument.name;
                }
            } catch (ignore) {}
            if (docPath !== '') {
                return JSON.stringify({
                    'path': docPath,
                    'layerID': 1
                });
            }
        } else {
            return JSON.stringify({
                'name': '',
                'layerID': -1
            });
        }
    },
    getLayerInfo: function () {
        try {
            var layerObject = {};
            var layerColors = [];

            layerObject.isDesignMode = app.activeDocument && app.activeDocument.viewMode === 2;
            if (layerObject.isDesignMode) {
                var selection = app.selection;
                if (selection && selection.length > 0) {
                    var fillColorArray;
                    fillColorArray = selection.fillColor(0);
                    var fillColorData = [];
                    if (fillColorArray.length >= 4) {
                        fillColorData.push({
                            mode: fillColorArray[0],
                            value: {
                                r: fillColorArray[1],
                                g: fillColorArray[2],
                                b: fillColorArray[3]
                            },
                            type: 'process'
                        });

                        if (fillColorArray.length === 5) {
                            layerColors.push({'colorType': JSXGlobals.FILL,
                                              'data': fillColorData,
                                              'name': fillColorArray[4]
                                });
                        } else {
                            layerColors.push({'colorType': JSXGlobals.FILL,
                                              'data': fillColorData
                                });
                        }
                    }
                    var strokeColorArray;
                    strokeColorArray = selection.strokeColor(0);
                    var strokeColorData = [];
                    if (strokeColorArray.length >= 4) {
                        strokeColorData.push({
                            mode: strokeColorArray[0],
                            value: {
                                r: strokeColorArray[1],
                                g: strokeColorArray[2],
                                b: strokeColorArray[3]
                            },
                            type: 'process'
                        });

                        if (strokeColorArray.length === 5) {
                            layerColors.push({'colorType': JSXGlobals.STROKE,
                                              'data': strokeColorData,
                                              'name': strokeColorArray[4]
                                });
                        } else {
                            layerColors.push({'colorType': JSXGlobals.STROKE,
                                              'data': strokeColorData
                                });
                        }
                    }

                    layerObject.colors = layerColors;
                    layerObject.kind = "";
                    layerObject.selectionExists = true;
                    layerObject.selectedLayer = 0;
                    layerObject.numberOfSelectedPageItems = selection.pageItemsSelectedLength;
                    if (selection.isLegalSelectionForAdd === false) {
                        layerObject.selectionExists = false; // disable 'Add Graphic'
                    }
                    layerObject.canApplyItemBackgroundFill = selection.canApplyPageItemBackgroundFill;
                    layerObject.canApplyColor = selection.canApplyColor;
                    layerObject.isTextSelection = selection.isTextSelection;
                }
            } else {
                layerObject.selectionExists = false;
                layerObject.selectedLayer = -1;
                layerObject.numberOfSelectedPageItems = 0;
                layerObject.canApplyItemBackgroundFill = false;
                layerObject.canApplyColor = false;
                layerObject.isTextSelection = false;
            }

            return JSON.stringify(layerObject);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-getLayerInfo()', ex);
        }
    },
    placeAsset: function (filePath, itemName, elementRef, isLinked, typePlace) {
        try {
            var doc;
            if (app.documents.length === 0 || !app.activeDocument) {
                doc = app.documents.add();
            } else {
                doc = app.activeDocument;
            }
            if (doc && doc.viewMode === 2) {
                if (typePlace === 'usePlaceGun') {
                    doc.importFile(filePath, itemName, elementRef, isLinked);
                } else if (typePlace === 'setImageItemFill') {
                    doc.setImageItemFill(filePath, itemName, elementRef, isLinked);
                } else if (typePlace === 'setImagePageFill') {
                    doc.setImagePageFill(filePath, itemName, elementRef, isLinked);
                } else if (typePlace === 'setImageBrowserFill') {
                    doc.setImageBrowserFill(filePath, itemName, elementRef, isLinked);
                }
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-placeAsset()', ex);
        }
    },
    dragAsset: function (filePath, itemName, x, y, timeStamp, elementRef) {
        try {
            var doc;
            if (app.documents.length === 0 || !app.activeDocument) {
                doc = app.documents.add();
            } else {
                doc = app.activeDocument;
            }
            if (doc && doc.viewMode === 2) {
                app.dragAsset(filePath, itemName, x, y, timeStamp, elementRef);
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-dragAsset()', ex);
        }
    },
    saveAssets: function (info, generateSecondaryFormat, dragAssetId) {
        try {
            var fileData = {};
            fileData.files = [];

            app.log("save assets");

            var basePath = Folder.temp.fsName + '/' + info.name;

            var musePath = basePath + '.muse';
            var museFile = new File(musePath);
            app.exportSelectionToCC(museFile, dragAssetId);

            if (!museFile.exists) {
                throw 'Could not extract selection.';
            }

            //Add muse file as primary rendition
            fileData.files.push({
                path: musePath,
                relationship: 'primary'
            });

            //Add the DL rendition
            var pngPath = basePath + '.png';
            var pngFile = new File(pngPath);
            if (pngFile.exists) {
                fileData.rendition = pngPath;
            }

            fileData.layerName = ''; // Make sure layer name is empty or the item will not be assigned a default name.

            return JSON.stringify(fileData);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-saveAssets()', ex);
        }
    },
    startDragHandler: function (type, assets, x, y, timeStamp) {
        try {
            if (type === 'color') {
                COLOR.dragColor(assets, x, y, timeStamp);
            } else if (type === 'image' || type === 'animation') {
                var assetPath = assets[0].path;
                var assetName = assets[0].displayName;
                var elementRef = assets[0].elementRef;
                this.dragAsset(assetPath, assetName, x, y, timeStamp, elementRef);
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-startDragHandler()', ex);
        }
    },
    museLog: function (logString) {
        try {
            app.log(logString);
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-log()', ex);
        }
    },
    getUserData: function () {
        try {
            return app.getCCXUserJSONData();
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('MUSE.jsx-getCCXUserJSONData()', ex);
        }
    }
};
