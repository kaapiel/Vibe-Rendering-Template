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
/*globals $:true, Folder:true, FLfile, app, File:true */

$ = {};

Folder = function (path) {
    this._path = path;
    this._uri = FLfile.platformPathToURI(this._path);
    this.exists = FLfile.exists(this._uri);
};

// TODO: Initialize with desktop path
Folder.desktop = {
    'selectDlg': function (promptStr) {
        return FLfile.uriToPlatformPath(app.browseForFolderURL(promptStr));
    }
};

// TODO: Return system temp directory
Folder.temp = {
    'fsName': app.configDirectory + "Extensions/CCLibrary/Temp"
};

// Create the temporary directory if it doesn't exist
var tempURI = FLfile.platformPathToURI(Folder.temp.fsName);
if (!FLfile.exists(tempURI)) {
    FLfile.createFolder(tempURI);
}

Folder.prototype.getFiles = function (filter) {
    var files = FLfile.listFolder(this._uri + "/" + filter, "files");
    var i;
    for (i = 0; i < files.length; ++i) {
        files[i] = this._path + "/" + files[i];
    }
    return files;
};

File = function (path) {
    // TODO
    return this;
};

File.prototype.open = function () {
    // TODO
    return this;
};

File.createTemporaryFile = function (assetName, extension) {
    var tempFolder = app.configDirectory + "Extensions/CCLibrary/Temp/";
    var tempPath = tempFolder + assetName + "." + extension;
    var conflicts = 1;
    while (FLfile.exists(FLfile.platformPathToURI(tempPath))) {
        tempPath = tempFolder + assetName + "(" + conflicts++ + ")." + extension;
    }
    return tempPath;
};

File.prototype.writeln = function () {
    // TODO
    return this;
};

$.evalFile = function (path) {
    try {
        var uri = FLfile.platformPathToURI(path);
        app.runScript(uri);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog("FLPR.jsx-evalFile()", ex);
    }
};
