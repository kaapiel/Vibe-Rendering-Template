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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true, todo: true */
/*global $, app, ColorSpace, Folder, JSXGlobals, File, COLOR, CharacterAlignment, AlternateGlyphForms, OTFFigureStyle, Position, Capitalization, Leading, UnitValue, WarichuAlignment, NothingEnum, UndoModes, FitOptions, StrokeCornerAdjustement, TextStrokeAlign, EndCap, RubyKentenPosition, KentenAlignment, KentenCharacter, KentenCharacterSet, AdornmentOverprint, RubyTypes, RubyAlignments, RubyOverhang, RubyParentSpacing, EndJoin, PositionalForms, LockStateValues, MeasurementUnits, DigitsTypeOptions, KashidasOptions, CharacterDirectionOptions, DiacriticPositionOptions, FontStatus, Justification, KinsokuSet, KinsokuType, KinsokuHangTypes, SingleWordJustification, TabStopAlignment, SaveOptions, ImportFormat, GlobalClashResolutionStrategy, CcimportClashResolutionStrategy, StyleType, LocationOptions, UserInteractionLevels, ParagraphDirectionOptions, ParagraphJustificationOptions, MojikumiTableDefaults, ThreadedTextFrameTextOptions, OpenOptions*/
var TEXT = {};

TEXT.TypographyArray = [];
TEXT.GlobalConflictResolutionStrategy = {};

var TextPanelActionID = {
    CharacterStyle: 8449,
    ParagraphStyle: 8450
};
var PARASTYLE_REPRESENTATION_JSON_TYPE = 'application/vnd.adobe.paragraphstyle+json';
var CHARSTYLE_REPRESENTATION_JSON_TYPE = 'application/vnd.adobe.characterstyle+json';

//Holds application translated strings
var AppStrings = {
    //Kerning method strings
    Metrics: app.translateKeyString('$ID/Metrics'),
    MetricsRomanOnly: app.translateKeyString('$ID/Metrics - Roman Only'),
    Optical: app.translateKeyString('$ID/Optical'),

    //Special type styles
    NoneCharacterStyle: app.translateKeyString('$ID/[No character style]'),
    NoParagraphStyle: app.translateKeyString('$ID/[No paragraph style]'),

    //Composer
    AdobeComposer_SingleLine: app.translateKeyString('$ID/HL Single'),
    AdobeComposer_Paragraph: app.translateKeyString('$ID/HL Composer'),
    AdobeJapaneseComposer_SingleLine: app.translateKeyString('$ID/HL Single J'),
    AdobeJapaneseComposer_Paragraph: app.translateKeyString('$ID/HL Composer J'),
    AdobeWorldReadyComposer_SingleLine: app.translateKeyString('$ID/HL Single Optyca'),
    AdobeWorldReadyComposer_Paragraph: app.translateKeyString('$ID/HL Composer Optyca'),
    UntitledDocString: app.translateKeyString('Untitled-^1')
};

TEXT.createHeadlessDocument = function () {
    var previousPreference = app.scriptPreferences.userInteractionLevel;
    app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
    var count = app.getUntitledCount();
    var documents = app.documents;
    var docName, match = false, numDocuments = documents.length, documentNames = [], itr;
    for (itr = 0; itr < numDocuments; itr++) {
        documentNames.push(documents[itr].name);
    }
    do {
        match = false;
        docName = AppStrings.UntitledDocString;
        docName = docName.replace('^1', ' ' + count);
        for (itr = 0; itr < numDocuments; itr++) {
            if (documentNames[itr] === docName) {
                ++count;
                match = true;
                break;
            }
        }
    } while (match);
    var doc = app.documents.add(false);
    doc.name = docName;
    app.scriptPreferences.userInteractionLevel = previousPreference;
    return doc;
};

TEXT.closeHeadlessDocument = function (doc) {
    doc.close(SaveOptions.NO);
};

TEXT.saveTextStylePreview = function () {
    var appSelection = app.selection;
    if (appSelection.length === 0) {
        return;
    }

    var selection = appSelection[0];
    if (selection.__class__ === 'TextFrame' || selection.__class__ === 'Cell') {
        selection = selection.texts[0];
    }

    //Use RGB black for text color
    var textColorSpace = ColorSpace.RGB;
    var textColorValues = [0, 0, 0];

    var previewPath = Folder.temp.fsName + '/TextPreview' + $.hiresTimer + '.png';
    selection.createThumbnailWithProperties(JSXGlobals.textPreviewString, JSXGlobals.textPreviewFontSize, textColorSpace, textColorValues, new File(previewPath));

    return previewPath;
};

TEXT.isLockedStory = function (text) {
    var story = text.parentStory;
    if (story && (story.lockState === LockStateValues.LOCKED_STORY || story.lockState === LockStateValues.CHECKED_IN_STORY)) {
        return true;
    }
    return false;
};

TEXT.areArraysEqual = function (array1, array2) {
    var i;
    if (array1.length !== array2.length) {
        return false;
    }

    for (i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
};

TEXT.getFontPostscriptName = function (font, fontStyle) {
    var postscriptName;
    var fontFamily;

    if (font.__class__ === 'Font') {
        postscriptName = font.postscriptName;
        fontFamily = font.fontFamily;
    } else {
        //We are given the font family
        postscriptName = '';
        fontFamily = font;
    }

    if (postscriptName === '' && app.documents.length !== 0) {
        var fontName = fontFamily;
        if (fontStyle !== '') {
            fontName += '\t' + fontStyle;
        }

        var docFont;
        try {
            docFont = app.activeDocument.fonts.itemByName(fontName);
        } catch (ex) {
            docFont = app.fonts.itemByName(fontName);
        }
        if (docFont && docFont.isValid && docFont.postscriptName !== '') {
            postscriptName = docFont.postscriptName;
        }
    }

    return postscriptName;
};

TEXT.dataToFont = function (fontData, fontFamily, createFake) {
    var font, i;

    if (fontData) {
        try {
            //In scripting, InDesign names its fonts as 'familyName <TAB> faceName'.
            //While picking, we set adbeFont.name to the font's postscript name for it to work across apps.
            //When applying, we use the family name and face name.
            var fontName = fontData.family;
            if (fontData.style !== '') {
                fontName += '\t' + fontData.style;
            }

            if (app.documents.length !== 0) {
                font = app.activeDocument.fonts.itemByName(fontName);
            }

            if (!font || !font.isValid || font.postscriptName === '') {
                font = app.fonts.itemByName(fontName);
            }

        } catch (ignore) {
            //alert(ex);
        }
    } else if (fontFamily) {
        //If all we have is the font-family then try to use that
        for (i = 0; i < app.fonts.length; ++i) {
            font = app.fonts[i];
            if (font.fontFamily === fontFamily) {
                break;
            }
        }
    }

    if (font && font.isValid && font.postscriptName !== '') {
        return font;
    }

    if (createFake) {
        try {
            return app.activeDocument.createMissingFontObject(fontData.family, fontData.style, fontData.postScriptName);
        } catch (ignore) {}
    }

    return; //undefinded
};

TEXT.isFontAvailable = function (style) {
    var font = TEXT.dataToFont(style.adbeFont, style.fontFamily, false);
    if (font && font.status === FontStatus.INSTALLED) {
        return 'true';
    }
    return 'false';
};

TEXT.strokeStyleToData = function (strokeStyle) {
    var obj = {};

    var styleClass = strokeStyle.__class__;

    obj.type = styleClass;
    obj.name = strokeStyle.name;

    if (styleClass === 'StripedStrokeStyle') {
        obj.stripeArray = strokeStyle.stripeArray;
    } else if (styleClass === 'DottedStrokeStyle') {
        obj.dotArray = strokeStyle.dotArray;
        obj.cornerAdjustment = 'StrokeCornerAdjustement.' + strokeStyle.strokeCornerAdjustment.toString();
    } else if (styleClass === 'DashedStrokeStyle') {
        obj.dashArray = strokeStyle.dashArray;
        obj.cornerAdjustment = 'StrokeCornerAdjustement.' + strokeStyle.strokeCornerAdjustment.toString();
        obj.endCap = 'EndCap.' + strokeStyle.endCap.toString();
    }

    return obj;
};

TEXT.dataToStrokeStyle = function (styleData) {

    var stylesOwner = app;
    if (app.documents.length !== 0) {
        stylesOwner = app.activeDocument;
    }

    var stylesCollection = stylesOwner.strokeStyles;
    if (styleData.type === 'StripedStrokeStyle') {
        stylesCollection = stylesOwner.stripedStrokeStyles;
    } else if (styleData.type === 'DottedStrokeStyle') {
        stylesCollection = stylesOwner.dottedStrokeStyles;
    } else if (styleData.type === 'DashedStrokeStyle') {
        stylesCollection = stylesOwner.dashedStrokeStyles;
    }

    var styleName = styleData.name;
    var iCount = 0;
    var found = false;

    var styleToAdd = stylesCollection.itemByName(styleName),
        diffStyles = false;
    while (!found && styleToAdd !== 'undefined' && styleToAdd.isValid) {

        diffStyles = false;

        if (styleData.type === 'StripedStrokeStyle') {
            diffStyles = !TEXT.areArraysEqual(styleData.stripeArray, styleToAdd.stripeArray);
        } else if (styleData.type === 'DottedStrokeStyle') {
            diffStyles = styleData.cornerAdjustment !== ('StrokeCornerAdjustement.' + styleToAdd.strokeCornerAdjustment.toString());

            if (!diffStyles) {
                diffStyles = !TEXT.areArraysEqual(styleData.dotArray, styleToAdd.dotArray);
            }
        } else if (styleData.type === 'DashedStrokeStyle') {
            diffStyles = styleData.cornerAdjustment !== ('StrokeCornerAdjustement.' + styleToAdd.strokeCornerAdjustment.toString());

            if (!diffStyles) {
                diffStyles = styleData.endCap !== ('EndCap.' + styleToAdd.endCap.toString());
            }

            if (!diffStyles) {
                diffStyles = !TEXT.areArraysEqual(styleData.dotArray, styleToAdd.dotArray);
            }
        }

        if (!diffStyles) {
            found = true;
        }

        if (!found) {
            ++iCount;
            styleName = styleData.name + ' ' + iCount;
            styleToAdd = stylesCollection.itemByName(styleName);
        }
    }

    if (found) {
        return styleToAdd;
    }

    if (styleData.type === 'StrokeStyle') {
        //Didn't find the factory style
        return; //undefined
    }

    var strokeStyle = stylesCollection.add();
    strokeStyle.name = styleName;

    if (styleData.type === 'StripedStrokeStyle') {
        strokeStyle.stripeArray = styleData.stripeArray;
    } else if (styleData.type === 'DottedStrokeStyle') {
        strokeStyle.dotArray = styleData.dotArray;

        switch (styleData.cornerAdjustment) {
        case 'StrokeCornerAdjustement.NONE':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.NONE;
            break;
        case 'StrokeCornerAdjustement.GAPS':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.GAPS;
            break;
        }
    } else if (styleData.type === 'DashedStrokeStyle') {
        strokeStyle.dashArray = styleData.dashArray;

        switch (styleData.cornerAdjustment) {
        case 'StrokeCornerAdjustement.NONE':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.NONE;
            break;
        case 'StrokeCornerAdjustement.GAPS':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.GAPS;
            break;
        case 'StrokeCornerAdjustement.DASHES':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.DASHES;
            break;
        case 'StrokeCornerAdjustement.DASHES_AND_GAPS':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.DASHES_AND_GAPS;
            break;
        }

        switch (styleData.endCap) {
        case 'EndCap.BUTT_END_CAP':
            strokeStyle.endCap = EndCap.BUTT_END_CAP;
            break;
        case 'EndCap.PROJECTING_END_CAP':
            strokeStyle.endCap = EndCap.PROJECTING_END_CAP;
            break;
        case 'EndCap.ROUND_END_CAP':
            strokeStyle.endCap = EndCap.ROUND_END_CAP;
            break;
        }
    }

    return strokeStyle;
};

TEXT.isColorSupported = function (color) {
    return color === 'Text Color' || COLOR.isColorSupported(color);
};

TEXT.colorToData = function (color) {
    if (color === 'Text Color') {
        return color;
    }
    return COLOR.solidColorToData(color);
};

TEXT.dataToColor = function (colorData, target) {
    if (colorData === 'Text Color') {
        return colorData;
    }
    return COLOR.dataToSolidColor(colorData, undefined, target);
};

TEXT.convertUnitsToPoints = function (unitType, unitValue) {
    if (unitType === MeasurementUnits.POINTS) {
        return unitValue;
    }

    var pointsValue = unitValue;
    switch (unitType) {
    case MeasurementUnits.Q:
        pointsValue = pointsValue * 0.7086614173228346;
        break;
    case MeasurementUnits.AMERICAN_POINTS:
        pointsValue = pointsValue * (0.3514 / 25.4 * 72);
        break;
    case MeasurementUnits.MILLIMETERS:
        pointsValue = (pointsValue * 72.0) / 25.4;
        break;
    case MeasurementUnits.HA:
        pointsValue = pointsValue * 0.7086614173228346;
        break;
    case MeasurementUnits.BAI:
        pointsValue = pointsValue * 6.336;
        break;
    case MeasurementUnits.U:
        pointsValue = (pointsValue * 72.0 * 11.0) / 1000.0;
        break;
    case MeasurementUnits.MILS:
        pointsValue = pointsValue * 0.072;
        break;
    case MeasurementUnits.PICAS:
        pointsValue = pointsValue * 12.0;
        break;
    case MeasurementUnits.INCHES:
    case MeasurementUnits.INCHES_DECIMAL:
        pointsValue = pointsValue * 72.0;
        break;
    case MeasurementUnits.CENTIMETERS:
        pointsValue = (pointsValue * 72.0) / 2.54;
        break;
    case MeasurementUnits.CICEROS:
        pointsValue = pointsValue * 12.7878751998;
        break;
    case MeasurementUnits.AGATES:
        pointsValue = (pointsValue * 72.0) / 14.0;
        break;
    case MeasurementUnits.PIXELS:
        //No conversion required
        break;
    default:
        //alert('convertUnitsToPoints: Unknown unitType');
        break;
    }
    return pointsValue;
};

TEXT.isEmptyObject = function (obj) {
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            //has at-least one own property
            return false;
        }
    }
    return true;
};

// When we are exporting styles from No Document state, we use a headless document. In that case, documents.length is 1.
// But there is no active Document. So we use the try catch block to get the prefsOwner.
TEXT.getPrefsOwner = function () {
    var prefsOwner = app;
    try {
        prefsOwner = app.activeDocument;
    } catch (ex) {
        prefsOwner = app;
    }
    return prefsOwner;
};

//With move to character styles and paragraph styles, TEXT.setTextAttributes and
//TEXT.getTextAttributes are not used now.
TEXT.setTextAttributes = function (text, style) {

    TEXT.applyBasicProperties(text, style);
    TEXT.applyAdvancedProperties(text, style);
    TEXT.applyCharacterColorProperties(text, style);
    TEXT.applyOpenTypeProperties(text, style);
    TEXT.applyTCYProperties(text, style);
    TEXT.applyWarichuProperties(text, style);
    TEXT.applyMENAProperties(text, style);

    TEXT.applyKentenProperties(text, style);
    TEXT.applyRubyProperties(text, style);
    TEXT.applyShataiProperties(text, style);
    TEXT.applyStrikeThroughProperties(text, style);
    TEXT.applyUnderlineProperties(text, style);
};

TEXT.getTextAttributesObject = function (text) {

    var obj = {};
    obj.fontFeatureSettings = [];
    obj.fontFeatureSettingsObject = {};

    //Attributes common with Ai/Ps
    TEXT.collectBasicProperties(obj, text);
    TEXT.collectAdvancedProperties(obj, text);
    TEXT.collectCharacterColorProperties(obj, text);
    TEXT.collectOpenTypeProperties(obj, text);
    TEXT.collectTCYProperties(obj, text);
    TEXT.collectWarichuProperties(obj, text);
    TEXT.collectMENAProperties(obj, text);

    //Id only attributes
    TEXT.collectKentenProperties(obj, text);
    TEXT.collectRubyProperties(obj, text);
    TEXT.collectShataiProperties(obj, text);
    TEXT.collectStrikeThroughProperties(obj, text);
    TEXT.collectUnderlineProperties(obj, text);

    //If we have no open type settings delete the empty array
    if (obj.fontFeatureSettings.length === 0) {
        delete obj.fontFeatureSettings;
    }

    //Delete the settings object unconditionally
    delete obj.fontFeatureSettingsObject;

    return obj;
};

TEXT.applyCharacterStyleProperties = function (target, style) {
    try {
        //Apply character style attributes from libraries style
        TEXT.applyBasicProperties(target, style);
        TEXT.applyAdvancedProperties(target, style);
        TEXT.applyCharacterColorProperties(target, style);
        TEXT.applyOpenTypeProperties(target, style);
        TEXT.applyTCYProperties(target, style);
        TEXT.applyWarichuProperties(target, style);
        TEXT.applyMENAProperties(target, style);

        //Apply legacy InDesign only character attributes (for text styles created in older versions of Id)
        TEXT.applyKentenProperties(target, style);
        TEXT.applyRubyProperties(target, style);
        TEXT.applyShataiProperties(target, style);
        TEXT.applyStrikeThroughProperties(target, style);
        TEXT.applyUnderlineProperties(target, style);

    } catch (ignore) {
        //alert('applyCharacterStyleProperties : ' + err);
    }
};

TEXT.createCharacterStyle = function (style, owner) {

    var stylesOwner = app;
    if (owner) {
        stylesOwner = owner;
    } else if (app.documents.length !== 0) {
        stylesOwner = app.activeDocument;
    }

    var target = stylesOwner.characterStyles.add();
    TEXT.applyCharacterStyleProperties(target, style);

    return target;
};

TEXT.getCharacterStyleObject = function (source) {

    if (source.__class__ !== 'CharacterStyle') {
        source = source.appliedCharacterStyle;
    }

    var obj = TEXT.getCharacterStyleObjectInner(source);

    return obj;
};

TEXT.applyParagraphStyleProperties = function (target, style) {
    try {
        //Apply paragraph style attributes from libraries style
        TEXT.applyBasicProperties(target, style);
        TEXT.applyAdvancedProperties(target, style);
        TEXT.applyCharacterColorProperties(target, style);
        TEXT.applyOpenTypeProperties(target, style);
        TEXT.applyTCYProperties(target, style);
        TEXT.applyWarichuProperties(target, style);
        TEXT.applyMENAProperties(target, style);

        //And now the paragraph properties
        TEXT.applyIndentsSpacingAndDirection(target, style);
        TEXT.applyTabs(target, style);
        TEXT.applyHyphenationProperties(target, style);
        TEXT.applyJustificationProperties(target, style);
        TEXT.applyJCompositionSettings(target, style);
        TEXT.applyComposerSettings(target, style);

    } catch (ignore) {
        //alert('applyParagraphStyleProperties : ' + err);
    }
};

TEXT.createParagraphStyle = function (style, owner) {

    var stylesOwner = app;
    if (owner) {
        stylesOwner = owner;
    } else if (app.documents.length !== 0) {
        stylesOwner = app.activeDocument;
    }

    var target = stylesOwner.paragraphStyles.add();
    TEXT.applyParagraphStyleProperties(target, style);

    return target;
};

TEXT.getParagraphStyleObject = function (source) {

    if (source.__class__ !== 'ParagraphStyle') {
        source = source.appliedParagraphStyle;
    }

    var obj = TEXT.getParagraphStyleObjectInner(source, false);
    return obj;
};

TEXT.areValuesEqual = function (value1, value2) {
    var equal = true;
    if (value1.__class__ !== value2.__class__) {
        equal = false;
    } else if (value1.__class__ === 'Object') {
        var key;
        for (key in value1) {
            if (value1.hasOwnProperty(key)) {
                if (value2.hasOwnProperty(key)) {
                    if (!TEXT.areValuesEqual(value1[key], value2[key])) {
                        equal = false;
                        break;
                    }
                } else {
                    equal = false;
                    break;
                }
            }
        }
    } else if (value1.__class__ === 'Array') {
        if (value1.length === value2.length) {
            var i;
            for (i = 0; i < value1.length; ++i) {
                if (!TEXT.areValuesEqual(value1[i], value2[i])) {
                    equal = false;
                    break;
                }
            }
        } else {
            equal = false;
        }
    } else {
        if (value1 !== value2) {
            equal = false;
        }
    }
    return equal;
};

TEXT.removeCommonAttributes = function (obj1, obj2) {
    var key;
    for (key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            if (TEXT.areValuesEqual(obj1[key], obj2[key])) {
                delete obj1[key];
            }
        }
    }
};

TEXT.mergeCommonAttributes = function (obj1, obj2) {
    var key;
    for (key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            if (TEXT.areValuesEqual(obj1[key], obj2[key]) === false) {
                obj1[key] = obj2[key];
            }
        }
    }
};

TEXT.getCharacterStyleObjectInner = function (source) {
    //Attributes common with Ai/Ps

    var obj = {};
    obj.fontFeatureSettings = [];
    obj.fontFeatureSettingsObject = {};

    TEXT.collectBasicProperties(obj, source);
    TEXT.collectAdvancedProperties(obj, source);
    TEXT.collectCharacterColorProperties(obj, source);
    TEXT.collectOpenTypeProperties(obj, source);
    TEXT.collectTCYProperties(obj, source);
    TEXT.collectWarichuProperties(obj, source);
    TEXT.collectMENAProperties(obj, source);

    //If we have no open type settings delete the empty object and array
    if (obj.fontFeatureSettings.length === 0) {
        delete obj.fontFeatureSettings;
    }
    if (TEXT.isEmptyObject(obj.fontFeatureSettingsObject)) {
        delete obj.fontFeatureSettingsObject;
    }

    return obj;
};

TEXT.getParagraphStyleObjectInner = function (source, isRootStyle) {
    var obj = {};
    obj.fontFeatureSettings = [];
    obj.fontFeatureSettingsObject = {};

    //Attributes common with Ai/Ps
    TEXT.collectBasicProperties(obj, source);
    TEXT.collectAdvancedProperties(obj, source);
    TEXT.collectCharacterColorProperties(obj, source);
    TEXT.collectOpenTypeProperties(obj, source);
    TEXT.collectTCYProperties(obj, source);
    TEXT.collectWarichuProperties(obj, source);
    TEXT.collectMENAProperties(obj, source);

    TEXT.collectKashidaWidthProperties(obj, source);
    TEXT.collectIndentsSpacingAndDirection(obj, source);
    TEXT.collectTabs(obj, source);
    TEXT.collectHyphenationProperties(obj, source);
    TEXT.collectJustificationProperties(obj, source);
    TEXT.collectJCompositionSettings(obj, source);
    TEXT.collectComposerSettings(obj, source);

    //If we have no open type settings delete the empty object and array
    if (obj.fontFeatureSettings.length === 0) {
        delete obj.fontFeatureSettings;
    }
    if (TEXT.isEmptyObject(obj.fontFeatureSettingsObject)) {
        delete obj.fontFeatureSettingsObject;
    }

    if (!isRootStyle) {
        //Need to remove properties contributed by the root paragraph style [No Paragraph Style].
        var rootSource = app.paragraphStyles.itemByName(AppStrings.NoParagraphStyle);
        var rootObj = TEXT.getParagraphStyleObjectInner(rootSource, true);

        TEXT.removeCommonAttributes(obj, rootObj);
        //The hyphenation switch, if ON in the paragraph style would get removed as a common attribute, as
        //it is ON in the root 'No Paragraph Style'. If the style contains other hyphenation properties which
        //are different from the root style, we put back the hyphenation switch back here.
        //We do not have to do this for underline and strikethrough switches, as these are OFF in the root style.
        TEXT.fixupParagraphHyphenationSwitch(obj);
    }

    return obj;
};

//If the source is a character style, the text properties return a NothingEnum.NOTHING value for the ignore state
//of the property. For properties which are enumerations, we don't need an explicit check for NothingEnum.NOTHING, if the
//cases for which we pick up the property are all listed. For other types, we do need and explict check.
TEXT.collectBasicProperties = function (obj, source) {
    var prefsOwner = TEXT.getPrefsOwner();

    var typographicUnits = prefsOwner.viewPreferences.typographicMeasurementUnits;
    var textSizeUnits = prefsOwner.viewPreferences.textSizeMeasurementUnits;

    var appliedFont = source.appliedFont;
    var fontStyle = source.fontStyle;

    if (appliedFont !== NothingEnum.NOTHING && appliedFont !== '') {
        if (fontStyle === NothingEnum.NOTHING) {
            fontStyle = 'Regular';
        }
        var postscriptName = TEXT.getFontPostscriptName(appliedFont, fontStyle); //Need not check fontStyle. Each font has atleast one style.
        obj.adbeFont = {
            family: appliedFont.__class__ === 'Font' ? appliedFont.fontFamily : appliedFont,
            name: postscriptName,
            postScriptName: postscriptName,
            style: fontStyle
        };
        obj.fontFamily = obj.adbeFont.family;
    }

    var pointSize = source.pointSize;
    if (pointSize !== NothingEnum.NOTHING) {
        var fontSize = TEXT.convertUnitsToPoints(textSizeUnits, pointSize);
        obj.fontSize = {
            type: 'pt',
            value: fontSize
        };
    }

    //Approximate font-style and font-weight for CSS
    //TODO: Handle all the following styles. See Minion Pro, Myriad Pro has many more.
    //Condensed, Condensed Italic, Semibold Condensed, Semibold Condensed Italic, Bold Condensed, Bold Condensed Italic,
    //Regular, Medium, Medium Italic, Semibold, Semibold Italic, Bold, Bold Italic
    if (fontStyle !== NothingEnum.NOTHING) {
        var style = fontStyle.toLowerCase();
        if (style.indexOf('italic') !== -1) {
            obj.fontStyle = 'italic';
        } else if (style.indexOf('oblique') !== -1) {
            obj.fontStyle = 'oblique';
        }

        if (style.indexOf('bold') !== -1) {
            obj.fontWeight = 'bold';
        }

        if (style.indexOf('light') !== -1 || style.indexOf('thin') !== -1) {
            obj.fontWeight = 'lighter';
        }
    }

    var kerningMethod = source.kerningMethod;
    if (kerningMethod !== NothingEnum.NOTHING) {
        if (kerningMethod === AppStrings.Metrics) {
            obj.adbeIlstKerningMethod = 'AutoKernType.AUTO';
        } else if (kerningMethod === AppStrings.MetricsRomanOnly) {
            obj.adbeIlstKerningMethod = 'AutoKernType.METRICSROMANONLY';
        } else if (kerningMethod === AppStrings.Optical) {
            obj.adbeIlstKerningMethod = 'AutoKernType.OPTICAL';
        } else {
            obj.adbeIlstKerningMethod = 'AutoKernType.NOAUTOKERN';
            obj.adbeIlstKerningValue = source.kerningValue;
        }
    }

    var textLeading = source.leading;
    if (textLeading !== NothingEnum.NOTHING) {
        if (textLeading === Leading.AUTO) {
            obj.adbeAutoLeading = true;
        } else {
            var leading = TEXT.convertUnitsToPoints(typographicUnits, textLeading);
            obj.lineHeight = {
                type: 'pt',
                value: leading
            };
        }
    }

    var tracking = source.tracking;
    if (tracking !== NothingEnum.NOTHING) {
        obj.adbeTracking = tracking;
        if (obj.adbeTracking) {
            obj.letterSpacing = {
                type: 'em',
                value: (obj.adbeTracking / 1000.0).toFixed(2)
            };
        }
    }

    //text-decoration properties
    if (source.underline !== NothingEnum.NOTHING) {
        if (obj.textDecorationObject) {
            obj.textDecorationObject.adbeUnderline = source.underline;
        } else {
            obj.textDecorationObject = {
                adbeUnderline: source.underline
            };
        }
        //Populate the textDecoration legacy array as well, for cross-app compatibility
        if (source.underline) {
            if (obj.textDecoration) {
                obj.textDecoration.push('underline');
            } else {
                obj.textDecoration = ['underline'];
            }
        }
    }

    if (source.strikeThru !== NothingEnum.NOTHING) {
        if (obj.textDecorationObject) {
            obj.textDecorationObject.adbeStrikethrough = source.strikeThru;
        } else {
            obj.textDecorationObject = {
                adbeStrikethrough: source.strikeThru
            };
        }
        //Populate the textDecoration legacy array as well, for cross-app compatibility
        if (source.strikeThru) {
            if (obj.textDecoration) {
                obj.textDecoration.push('line-through');
            } else {
                obj.textDecoration = ['line-through'];
            }
        }
    }

    switch (source.capitalization) {
    case Capitalization.NORMAL:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.NORMAL';
        break;
    case Capitalization.CAP_TO_SMALL_CAP:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.ALLSMALLCAPS';
        obj.fontFeatureSettings.push('c2sc');
        break;
    case Capitalization.SMALL_CAPS:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.SMALLCAPS';
        obj.fontFeatureSettings.push('smcp');
        break;
    case Capitalization.ALL_CAPS:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.ALLCAPS';
        obj.textTransform = 'capitalize';
        break;
    }

    var isStyle = source.__class__ === 'CharacterStyle' || source.__class__ === 'ParagraphStyle';
    if (!isStyle) {
        if (source.noBreak) {
            obj.whiteSpace = 'nowrap';
        }
    } else {
        if (source.noBreak === true) {
            obj.whiteSpace = 'nowrap';
        } else if (source.noBreak === false) {
            obj.whiteSpace = 'wrap';
        }
    }

    switch (source.characterAlignment) {
    case CharacterAlignment.ALIGN_BASELINE:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.ROMANBASELINE';
        break;
    case CharacterAlignment.ALIGN_EM_BOTTOM:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.bottom';
        break;
    case CharacterAlignment.ALIGN_EM_CENTER:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.center';
        break;
    case CharacterAlignment.ALIGN_EM_TOP:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.top';
        break;
    case CharacterAlignment.ALIGN_ICF_BOTTOM:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.icfBottom';
        break;
    case CharacterAlignment.ALIGN_ICF_TOP:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.icfTop';
        break;
    }
};

TEXT.collectAdvancedProperties = function (obj, source) {
    var prefsOwner = TEXT.getPrefsOwner();
    var typographicUnits = prefsOwner.viewPreferences.typographicMeasurementUnits;

    var horizontalScale = source.horizontalScale;
    if (horizontalScale !== NothingEnum.NOTHING) {
        obj.adbeHorizontalScale = horizontalScale;
    }

    var verticalScale = source.verticalScale;
    if (verticalScale !== NothingEnum.NOTHING) {
        obj.adbeVerticalScale = verticalScale;
    }

    var textBaselineShift = source.baselineShift;
    if (textBaselineShift !== NothingEnum.NOTHING) {
        var baselineShift = TEXT.convertUnitsToPoints(typographicUnits, textBaselineShift);
        obj.baselineShift = {
            type: 'pt',
            value: baselineShift
        };
    }

    var skew = source.skew;
    if (skew !== NothingEnum.NOTHING) {
        obj.adbeIdsnSkew = skew;
    }

    var rotation = source.characterRotation;
    if (rotation !== NothingEnum.NOTHING) {
        obj.adbeIlstRotation = rotation;
    }

    var tsume = source.tsume;
    if (tsume !== NothingEnum.NOTHING) {
        obj.adbeIlstTsume = (tsume * 100).toFixed(2);
    }

    var leadingAki = source.leadingAki;
    if (leadingAki !== NothingEnum.NOTHING) {
        obj.adbeIlstAkiLeft = leadingAki;
    }

    var trailingAki = source.trailingAki;
    if (trailingAki !== NothingEnum.NOTHING) {
        obj.adbeIlstAkiRight = trailingAki;
    }

    switch (source.glyphForm) {
    case AlternateGlyphForms.EXPERT_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.EXPERT';
        break;
    case AlternateGlyphForms.FULL_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.FULLWIDTH';
        break;
    case AlternateGlyphForms.JIS04_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS04FORM';
        break;
    case AlternateGlyphForms.JIS78_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS78FORM';
        break;
    case AlternateGlyphForms.JIS83_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS83FORM';
        break;
    case AlternateGlyphForms.JIS90_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS90FORM';
        break;
    case AlternateGlyphForms.PROPORTIONAL_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.PROPORTIONALWIDTH';
        break;
    case AlternateGlyphForms.QUARTER_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.QUARTERWIDTH';
        break;
    case AlternateGlyphForms.THIRD_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.THIRDWIDTH';
        break;
    case AlternateGlyphForms.TRADITIONAL_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.TRADITIONAL';
        break;
    case AlternateGlyphForms.NONE:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.DEFAULTFORM';
        break;
    case AlternateGlyphForms.MONOSPACED_HALF_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.HALFWIDTH';
        break;
    case AlternateGlyphForms.NLC_FORM:
        //obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.DEFAULTFORM';
        break;
    }

    var appliedLanguage = source.appliedLanguage;
    if (appliedLanguage) {
        obj.adbeIdsnAppliedLanguageName = appliedLanguage.untranslatedName;
    }
};

TEXT.collectCharacterColorProperties = function (obj, source) {
    var prefsOwner = TEXT.getPrefsOwner();
    var strokeUnits = prefsOwner.viewPreferences.strokeMeasurementUnits;

    var fillColor = source.fillColor;
    if (fillColor) {
        if (COLOR.isColorSupported(fillColor)) {
            obj.color = COLOR.solidColorToData(fillColor);
        } else {
            if (COLOR.isRestrictedColor(fillColor) === true) {
                obj.color = fillColor.name;
            }
        }
    }

    //Only add stroke color if we have one
    var strokeColor = source.strokeColor;
    if (strokeColor) {
        if (COLOR.isColorSupported(strokeColor)) {
            obj.adbeIlstStrokeColor = COLOR.solidColorToData(strokeColor);
        } else {
            if (COLOR.isRestrictedColor(strokeColor) === true) {
                obj.adbeIlstStrokeColor = strokeColor.name;
            }
        }
    }

    //Only gather the stroke weight if there is a color specified
    if (obj.adbeIlstStrokeColor) {
        if (source.strokeWeight !== NothingEnum.NOTHING) {
            var strokeWeight = TEXT.convertUnitsToPoints(strokeUnits, source.strokeWeight);
            obj.adbeIlstStrokeWeight = {
                type: 'pt',
                value: strokeWeight
            };
        }
    }

    var overprintFill = source.overprintFill;
    if (overprintFill !== NothingEnum.NOTHING) {
        obj.adbeIlstOverprintFill = overprintFill;
    }

    var overprintStroke = source.overprintStroke;
    if (overprintStroke !== NothingEnum.NOTHING) {
        obj.adbeIlstOverprintStroke = overprintStroke;
    }

    if (obj.color) {
        var fillTint = source.fillTint;
        if (fillTint !== NothingEnum.NOTHING) {
            obj.adbeIdsnFillTint = fillTint;
        }
    }

    if (obj.adbeIlstStrokeColor) {
        var strokeTint = source.strokeTint;
        if (strokeTint !== NothingEnum.NOTHING) {
            obj.adbeIdsnStrokeTint = strokeTint;
        }
    }

    var strokeAlignment = source.strokeAlignment;
    if (strokeAlignment !== NothingEnum.NOTHING) {
        obj.adbeIdsnStrokeAlignment = 'TextStrokeAlign.' + strokeAlignment.toString();
    }

    var endJoin = source.endJoin;
    if (endJoin !== NothingEnum.NOTHING) {
        obj.adbeIdsnEndJoin = 'EndJoin.' + endJoin.toString();
    }

    if (obj.adbeIdsnEndJoin === 'EndJoin.MITER_END_JOIN') {
        obj.adbeIdsnMiterLimit = source.miterLimit;
    }
};

TEXT.collectOpenTypeProperties = function (obj, source) {
    switch (source.otfFigureStyle) {
    case OTFFigureStyle.DEFAULT_VALUE:
        obj.adbeIlstFigureStyle = 'FigureStyleType.DEFAULTFIGURESTYLE';
        break;
    case OTFFigureStyle.PROPORTIONAL_LINING:
        obj.adbeIlstFigureStyle = 'FigureStyleType.PROPORTIONAL';
        break;
    case OTFFigureStyle.PROPORTIONAL_OLDSTYLE:
        obj.adbeIlstFigureStyle = 'FigureStyleType.PROPORTIONALOLDSTYLE';
        break;
    case OTFFigureStyle.TABULAR_LINING:
        obj.adbeIlstFigureStyle = 'FigureStyleType.TABULAR';
        break;
    case OTFFigureStyle.TABULAR_OLDSTYLE:
        obj.adbeIlstFigureStyle = 'FigureStyleType.TABULAROLDSTYLE';
        break;
    }

    switch (source.position) {
    case Position.NORMAL:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.OPENTYPEDEFAULT';
        break;
    case Position.OT_DENOMINATOR:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.DENOMINATOR';
        break;
    case Position.OT_NUMERATOR:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.NUMERATOR';
        break;
    case Position.OT_SUBSCRIPT:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.OPENTYPESUBSCRIPT';
        break;
    case Position.OT_SUPERSCRIPT:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.OPENTYPESUPERSCRIPT';
        break;
    }

    //OpenType feature settings
    //Populate the fontFeatureSettings legacy array as well, for cross-app compatibility
    if (source.otfSwash !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFSwash = source.otfSwash;
        if (source.otfSwash) {
            obj.fontFeatureSettings.push('swsh');
        }
    }
    if (source.otfOrdinal !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFOrdinals = source.otfOrdinal;
        if (source.otfOrdinal) {
            obj.fontFeatureSettings.push('ordn');
        }
    }
    if (source.otfDiscretionaryLigature !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFDiscretionaryLigatures = source.otfDiscretionaryLigature;
        if (source.otfDiscretionaryLigature) {
            obj.fontFeatureSettings.push('dlig');
        }
    }
    if (source.otfContextualAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFContextualAlternates = source.otfContextualAlternate;
        if (source.otfContextualAlternate) {
            obj.fontFeatureSettings.push('clig');
        }
    }
    if (source.ligatures !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeLigatures = source.ligatures;
        if (source.ligatures) {
            obj.fontFeatureSettings.push('liga');
        }
    }
    if (source.otfFraction !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFFractions = source.otfFraction;
        if (source.otfFraction) {
            obj.fontFeatureSettings.push('frac');
        }
    }
    if (source.otfTitling !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFTitlingAlternates = source.otfTitling;
        if (source.otfTitling) {
            obj.fontFeatureSettings.push('titl');
        }
    }
    if (source.otfStylisticAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFStylisticAlternates = source.otfStylisticAlternate;
        if (source.otfStylisticAlternate) {
            obj.fontFeatureSettings.push('salt');
        }
    }
    if (source.otfHVKana !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFHVKana = source.otfHVKana;
        if (source.otfHVKana) {
            obj.fontFeatureSettings.push('hvkn');
        }
    }
    if (source.otfRomanItalics !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFRomanItalics = source.otfRomanItalics;
        if (source.otfRomanItalics) {
            obj.fontFeatureSettings.push('rita');
        }
    }
    if (source.otfSlashedZero !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFSlashedZero = source.otfSlashedZero;
        if (source.otfSlashedZero) {
            obj.fontFeatureSettings.push('szer');
        }
    }

    switch (source.position) {
    case Position.NORMAL:
    case Position.SUBSCRIPT:
    case Position.SUPERSCRIPT:
        obj.fontFeatureSettingsObject.adbePosition = 'Position.' + source.position.toString();
        break;
    }
    if (source.position === Position.SUBSCRIPT) {
        obj.fontFeatureSettings.push('subs');
    } else if (source.position === Position.SUPERSCRIPT) {
        obj.fontFeatureSettings.push('sups');
    }

    var proportionalMetrics = source.otfProportionalMetrics;
    if (proportionalMetrics !== NothingEnum.NOTHING) {
        obj.adbeIlstProportionalMetrics = proportionalMetrics;
    }

    var positionalForm = source.positionalForm;
    if (positionalForm !== NothingEnum.NOTHING) {
        obj.adbeIdsnPositionalForm = 'PositionalForm.' + positionalForm.toString();
    }

    var otfStylisticSets = source.otfStylisticSets;
    if (otfStylisticSets !== NothingEnum.NOTHING) {
        obj.adbeIdsnOtfStylisticSets = otfStylisticSets;
    }
};

TEXT.collectTCYProperties = function (obj, source) {
    var tatechuyoko = source.tatechuyoko;
    if (tatechuyoko !== NothingEnum.NOTHING) {
        obj.adbeIdsnTatechuyoko = tatechuyoko;
    }

    //Returns in pts.
    var tatechuyokoXOffset = source.tatechuyokoXOffset;
    if (tatechuyokoXOffset !== NothingEnum.NOTHING) {
        obj.adbeIlstTateChuYokoHorizontal = tatechuyokoXOffset;
    }
    var tatechuyokoYOffset = source.tatechuyokoYOffset;
    if (tatechuyokoYOffset !== NothingEnum.NOTHING) {
        obj.adbeIlstTateChuYokoVertical = tatechuyokoYOffset;
    }
};

TEXT.collectWarichuProperties = function (obj, source) {
    var warichu = source.warichu;
    if (warichu !== NothingEnum.NOTHING) {
        obj.adbeIlstWariChuEnabled = warichu;
    }

    if (obj.adbeIlstWariChuEnabled) {
        switch (source.warichuAlignment) {
        case WarichuAlignment.AUTO:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUAUTOJUSTIFY';
            break;
        case WarichuAlignment.CENTER_ALIGN:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.Center';
            break;
        case WarichuAlignment.CENTER_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINECENTER';
            break;
        case WarichuAlignment.FULLY_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFY';
            break;
        case WarichuAlignment.LEFT_ALIGN:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.Left';
            break;
        case WarichuAlignment.LEFT_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINELEFT';
            break;
        case WarichuAlignment.RIGHT_ALIGN:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.Right';
            break;
        case WarichuAlignment.RIGHT_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINERIGHT';
            break;
        }

        var warichuCharsAfterBreak = source.warichuCharsAfterBreak;
        if (warichuCharsAfterBreak !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuCharactersAfterBreak = warichuCharsAfterBreak;
        }
        var warichuCharsBeforeBreak = source.warichuCharsBeforeBreak;
        if (warichuCharsBeforeBreak !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuCharactersBeforeBreak = warichuCharsBeforeBreak;
        }
        var warichuLineSpacing = source.warichuLineSpacing;
        if (warichuLineSpacing !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuLineGap = warichuLineSpacing; //Returns in pts.
        }
        var warichuLines = source.warichuLines;
        if (warichuLines !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuLines = warichuLines;
        }
        var warichuSize = source.warichuSize;
        if (warichuSize !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuScale = warichuSize;
        }
    }
};

TEXT.collectMENAProperties = function (obj, source) {
    var digitsType = source.digitsType;
    if (digitsType !== NothingEnum.NOTHING) {
        obj.adbeIdsnDigitsType = 'DigitsTypeOptions.' + digitsType.toString();
    }

    var kashidas = source.kashidas;
    if (kashidas !== NothingEnum.NOTHING) {
        obj.adbeIdsnKashidas = 'KashidasOptions.' + kashidas.toString();
    }

    var characterDirection = source.characterDirection;
    if (characterDirection !== NothingEnum.NOTHING) {
        obj.adbeIdsnCharacterDirection = 'CharacterDirectionOptions.' + characterDirection.toString();
    }

    var diacriticPosition = source.diacriticPosition;
    if (characterDirection !== NothingEnum.NOTHING) {
        obj.adbeIdsnDiacriticPosition = 'DiacriticPositionOptions.' + diacriticPosition.toString();
    }

    var xOffsetDiacritic = source.xOffsetDiacritic;
    if (xOffsetDiacritic !== NothingEnum.NOTHING) {
        obj.adbeIdsnXOffsetDiacritic = xOffsetDiacritic;
    }

    var yOffsetDiacritic = source.yOffsetDiacritic;
    if (yOffsetDiacritic !== NothingEnum.NOTHING) {
        obj.adbeIdsnYOffsetDiacritic = yOffsetDiacritic;
    }

    //MENA OpenType feature settings
    //Populate the fontFeatureSettings legacy array as well, for cross-app compatibility
    if (source.otfJustificationAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFJustificationAlternates = source.otfJustificationAlternate;
        if (source.otfJustificationAlternate) {
            obj.fontFeatureSettings.push('jalt');
        }
    }
    if (source.otfStretchedAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFStretchedAlternates = source.otfStretchedAlternate;
        if (source.otfStretchedAlternate) {
            obj.fontFeatureSettings.push('stal');
        }
    }
    if (source.otfOverlapSwash !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFOverlapSwash = source.otfOverlapSwash;
        if (source.otfOverlapSwash) {
            obj.fontFeatureSettings.push('olsh');
        }
    }
};

TEXT.collectKashidaWidthProperties = function (obj, source) {
    try {
        if (source.paragraphKashidaWidth !== undefined) {
            switch (source.paragraphKashidaWidth) {
            case 0:
                obj.adbeIdsnKashidaWidth = 'KashidaWidth.kashidaNone';
                break;
            case 1:
                obj.adbeIdsnKashidaWidth = 'KashidaWidth.kashidaSmall';
                break;
            case 2:
                obj.adbeIdsnKashidaWidth = 'KashidaWidth.kashidaMedium';
                break;
            case 3:
                if (source.paragraphJustification === ParagraphJustificationOptions.NASKH_KASHIDA_JUSTIFICATION_FRAC) {
                    obj.adbeIdsnKashidaWidth = 'KashidaWidth.kashidaLong';
                } else {
                    obj.adbeIdsnKashidaWidth = 'KashidaWidth.kashidaStylistic';
                }
                break;
            }
        }
    } catch (ignore) {}
};

// Id only properties - Kenten, Ruby, Shatai, Strikethrough attributes, Underline attributes
// Called only for text, these properties don't need the NOTHING checks

TEXT.collectKentenProperties = function (obj, text) {
    obj.adbeIdsnKentenKind = 'KentenKind.' + text.kentenKind.toString();
    if (obj.adbeIdsnKentenKind !== 'KentenKind.NONE') {

        obj.adbeIdsnKentenPlacement = text.kentenPlacement; //Returns in pts.
        obj.adbeIdsnKentenPosition = 'RubyKentenPosition.' + text.kentenPosition.toString();
        obj.adbeIdsnKentenFontSize = text.kentenFontSize; //Returns in pts.
        obj.adbeIdsnKentenAlignment = 'KentenAlignment.' + text.kentenAlignment.toString();
        obj.adbeIdsnKentenXScale = text.kentenXScale;
        obj.adbeIdsnKentenYScale = text.kentenYScale;

        if (obj.adbeIdsnKentenKind === 'KentenKind.CUSTOM') {
            if (text.kentenFont) {
                try {
                    var postscriptName = TEXT.getFontPostscriptName(text.kentenFont, text.kentenFontStyle);
                    obj.adbeIdsnKentenFont = {
                        family: text.kentenFont.fontFamily,
                        style: text.kentenFontStyle,
                        name: postscriptName,
                        postScriptName: postscriptName
                    };
                } catch (ignore) {
                    //alert(ex1);
                }
            }
            obj.adbeIdsnKentenCustomCharacter = text.kentenCustomCharacter;
            obj.adbeIdsnKentenCharacterSet = 'KentenCharacterSet.' + text.kentenCharacterSet.toString();
        }

        obj.adbeIdsnKentenTint = text.kentenTint === -1 ? 'KentenTint.AUTO' : text.kentenTint;
        obj.adbeIdsnKentenWeight = text.kentenWeight === -1 ? 'KentenWeight.AUTO' : text.kentenWeight; //Returns in pts.
        obj.adbeIdsnKentenOverprintFill = 'AdornmentOverprint.' + text.kentenOverprintFill.toString();
        obj.adbeIdsnKentenOverprintStroke = 'AdornmentOverprint.' + text.kentenOverprintStroke.toString();

        if (TEXT.isColorSupported(text.kentenFillColor)) {
            obj.adbeIdsnKentenFillColor = TEXT.colorToData(text.kentenFillColor);
        }
        if (TEXT.isColorSupported(text.kentenStrokeColor)) {
            obj.adbeIdsnKentenStrokeColor = TEXT.colorToData(text.kentenStrokeColor);
        }
    }
};

TEXT.collectRubyProperties = function (obj, text) {
    obj.adbeIdsnRubyFlag = text.rubyFlag;
    if (obj.adbeIdsnRubyFlag) {

        obj.adbeIdsnRubyType = 'RubyType.' + text.rubyType.toString();
        obj.adbeIdsnRubyAlignment = 'RubyAlignment.' + text.rubyAlignment.toString();
        obj.adbeIdsnRubyPosition = 'RubyKentenPosition.' + text.rubyPosition.toString();
        obj.adbeIdsnRubyXOffset = text.rubyXOffset; //Returns in pts.
        obj.adbeIdsnRubyYOffset = text.rubyYOffset; //Returns in pts.

        if (text.rubyFont) {
            try {
                var postscriptName = TEXT.getFontPostscriptName(text.rubyFont, text.rubyFontStyle);
                obj.adbeIdsnRubyFont = {
                    family: text.rubyFont.fontFamily,
                    style: text.rubyFontStyle,
                    name: postscriptName,
                    postScriptName: postscriptName
                };
            } catch (ignore) {
                //alert(ex2);
            }
        }

        obj.adbeIdsnRubyFontSize = text.rubyFontSize; //Returns in pts.
        obj.adbeIdsnRubyXScale = text.rubyXScale;
        obj.adbeIdsnRubyYScale = text.rubyYScale;
        obj.adbeIdsnRubyOpenTypePro = text.rubyOpenTypePro;
        obj.adbeIdsnRubyAutoTcyDigits = text.rubyAutoTcyDigits;
        obj.adbeIdsnRubyAutoTcyIncludeRoman = text.rubyAutoTcyIncludeRoman;
        obj.adbeIdsnRubyAutoTcyAutoScale = text.rubyAutoTcyAutoScale;

        obj.adbeIdsnRubyParentOverhangAmount = 'RubyOverhang.' + text.rubyParentOverhangAmount.toString();
        obj.adbeIdsnRubyParentSpacing = 'RubyParentSpacing.' + text.rubyParentSpacing.toString();
        obj.adbeIdsnRubyAutoScaling = text.rubyAutoScaling;
        if (obj.adbeIdsnRubyAutoScaling) {
            obj.adbeIdsnRubyParentScalingPercent = text.rubyParentScalingPercent;
        }
        obj.adbeIdsnRubyAutoAlign = text.rubyAutoAlign;

        if (TEXT.isColorSupported(text.rubyFill)) {
            obj.adbeIdsnRubyFillColor = TEXT.colorToData(text.rubyFill);
        }
        if (TEXT.isColorSupported(text.rubyStroke)) {
            obj.adbeIdsnRubyStrokeColor = TEXT.colorToData(text.rubyStroke);
        }

        obj.adbeIdsnRubyTint = text.rubyTint === -1 ? 'RubyTint.AUTO' : text.rubyTint;
        obj.adbeIdsnRubyWeight = text.rubyWeight === -1 ? 'RubyWeight.AUTO' : text.rubyWeight; //Returns in pts.
        obj.adbeIdsnRubyOverprintFill = 'AdornmentOverprint.' + text.rubyOverprintFill.toString();
        obj.adbeIdsnRubyOverprintStroke = 'AdornmentOverprint.' + text.rubyOverprintStroke.toString();
    }
};

TEXT.collectShataiProperties = function (obj, text) {
    obj.adbeIdsnShataiMagnification = text.shataiMagnification;
    obj.adbeIdsnShataiDegreeAngle = text.shataiDegreeAngle;
    obj.adbeIdsnShataiAdjustRotation = text.shataiAdjustRotation;
    obj.adbeIdsnShataiAdjustTsume = text.shataiAdjustTsume;
};

TEXT.collectStrikeThroughProperties = function (obj, text) {
    var prefsOwner = TEXT.getPrefsOwner();
    var strokeUnits = prefsOwner.viewPreferences.strokeMeasurementUnits;

    if (text.strikeThru) {
        var strikeThroughWeight = TEXT.convertUnitsToPoints(strokeUnits, text.strikeThroughWeight);
        obj.adbeIdsnStrikeThroughWeight = {
            type: 'pt',
            value: strikeThroughWeight
        };
        obj.adbeIdsnStrikeThroughType = TEXT.strokeStyleToData(text.strikeThroughType);
        var strikeThroughOffset = TEXT.convertUnitsToPoints(strokeUnits, text.strikeThroughOffset);
        obj.adbeIdsnStrikeThroughOffset = {
            type: 'pt',
            value: strikeThroughOffset
        };

        if (TEXT.isColorSupported(text.strikeThroughColor)) {
            obj.adbeIdsnStrikeThroughColor = TEXT.colorToData(text.strikeThroughColor);
            obj.adbeIdsnStrikeThroughTint = text.strikeThroughTint;
            obj.adbeIdsnStrikeThroughOverprint = text.strikeThroughOverprint;
        }

        if (TEXT.isColorSupported(text.strikeThroughGapColor)) {
            obj.adbeIdsnStrikeThroughGapColor = TEXT.colorToData(text.strikeThroughGapColor);
            obj.adbeIdsnStrikeThroughGapTint = text.strikeThroughGapTint;
            obj.adbeIdsnStrikeThroughGapOverprint = text.strikeThroughGapOverprint;
        }
    }
};

TEXT.collectUnderlineProperties = function (obj, text) {
    var prefsOwner = TEXT.getPrefsOwner();
    var strokeUnits = prefsOwner.viewPreferences.strokeMeasurementUnits;

    if (text.underline) {
        var underlineWeight = TEXT.convertUnitsToPoints(strokeUnits, text.underlineWeight);
        obj.adbeIdsnUnderlineWeight = {
            type: 'pt',
            value: underlineWeight
        };
        obj.adbeIdsnUnderlineType = TEXT.strokeStyleToData(text.underlineType);
        var underlineOffset = TEXT.convertUnitsToPoints(strokeUnits, text.underlineOffset);
        obj.adbeIdsnUnderlineOffset = {
            type: 'pt',
            value: underlineOffset
        };

        if (TEXT.isColorSupported(text.underlineColor)) {
            obj.adbeIdsnUnderlineColor = TEXT.colorToData(text.underlineColor);
            obj.adbeIdsnUnderlineTint = text.underlineTint;
            obj.adbeIdsnUnderlineOverprint = text.underlineOverprint;
        }

        if (TEXT.isColorSupported(text.underlineGapColor)) {
            obj.adbeIdsnUnderlineGapColor = TEXT.colorToData(text.underlineGapColor);
            obj.adbeIdsnUnderlineGapTint = text.underlineGapTint;
            obj.adbeIdsnUnderlineGapOverprint = text.underlineGapOverprint;
        }
    }
};

TEXT.applyBasicProperties = function (target, style) {
    var font = TEXT.dataToFont(style.adbeFont, style.fontFamily, true);
    if (font) {
        try {
            target.appliedFont = font;
            target.fontStyle = style.adbeFont.style;
        } catch (ignore) {
            //alert(ex);
        }
    }

    var properties = {};

    if (style.fontSize) {
        var size = new UnitValue(style.fontSize.value, style.fontSize.type);
        properties.pointSize = size.as('pt') + ' pt';
    }

    if (style.adbeIlstKerningMethod === 'AutoKernType.AUTO') {
        properties.kerningMethod = AppStrings.Metrics;
    } else if (style.adbeIlstKerningMethod === 'AutoKernType.OPTICAL') {
        properties.kerningMethod = AppStrings.Optical;
    } else if (style.adbeIlstKerningMethod === 'AutoKernType.METRICSROMANONLY') {
        properties.kerningMethod = AppStrings.MetricsRomanOnly;
    } else if (style.adbeIlstKerningMethod === 'AutoKernType.NOAUTOKERN') {
        if (style.adbeIlstKerningValue) {
            properties.kerningValue = style.adbeIlstKerningValue;
        } else {
            properties.kerningValue = style.adbeIlstKerningValue;
        }
    }

    if (style.adbeAutoLeading === true) {
        properties.leading = Leading.AUTO;
    } else if (style.lineHeight) {
        var leading = new UnitValue(style.lineHeight.value, style.lineHeight.type);
        properties.leading = leading.as('pt') + ' pt';
    }

    if (style.adbeTracking !== undefined) {
        properties.tracking = style.adbeTracking;
    } else if (style.letterSpacing) {
        properties.tracking = style.letterSpacing.value * 1000;
    }

    var textDecoration = style.textDecorationObject;
    if (textDecoration && TEXT.isEmptyObject(textDecoration)) {
        textDecoration = undefined;
    }
    if (!textDecoration) {
        textDecoration = style.textDecoration;
    }
    if (textDecoration) {
        if (textDecoration.__class__ === 'Array') {
            properties.underline = textDecoration.indexOf('underline') !== -1;
            properties.strikeThru = textDecoration.indexOf('line-through') !== -1;
        } else if (textDecoration.__class__ === 'Object') {
            if (textDecoration.adbeUnderline !== undefined) {
                properties.underline = textDecoration.adbeUnderline;
            }
            if (textDecoration.adbeStrikethrough !== undefined) {
                properties.strikeThru = textDecoration.adbeStrikethrough;
            }
        }
    }

    //Use the fontFeatureSettings object if it exists, otherwise see if we have the legacy settings array
    var fontFeatureSettings = style.fontFeatureSettingsObject;
    if (!fontFeatureSettings) {
        fontFeatureSettings = style.fontFeatureSettings;
    }
    if (fontFeatureSettings) {
        if (fontFeatureSettings.__class__ === 'Array' && fontFeatureSettings.length > 0) {
            if (fontFeatureSettings.indexOf('c2sc') !== -1) {
                properties.capitalization = Capitalization.CAP_TO_SMALL_CAP;
            } else if (fontFeatureSettings.indexOf('smcp') !== -1) {
                properties.capitalization = Capitalization.SMALL_CAPS;
            }
        } else if (fontFeatureSettings.__class__ === 'Object' && fontFeatureSettings.adbeCapitalization) {
            switch (fontFeatureSettings.adbeCapitalization) {
            case 'FontCapsOption.NORMAL':
                properties.capitalization = Capitalization.NORMAL;
                break;
            case 'FontCapsOption.ALLSMALLCAPS':
                properties.capitalization = Capitalization.CAP_TO_SMALL_CAP;
                break;
            case 'FontCapsOption.SMALLCAPS':
                properties.capitalization = Capitalization.SMALL_CAPS;
                break;
            case 'FontCapsOption.ALLCAPS':
                properties.capitalization = Capitalization.ALL_CAPS;
                break;
            }
        }
    }

    var isStyle = target.__class__ === 'CharacterStyle' || target.__class__ === 'ParagraphStyle';

    if (style.textTransform === 'capitalize') {
        properties.capitalization = Capitalization.ALL_CAPS;
    } else if (properties.capitalization === undefined) {
        if (!isStyle) {
            properties.capitalization = Capitalization.NORMAL;
        }
    }

    if (!isStyle) {
        properties.noBreak = style.whiteSpace === 'nowrap';
    } else {
        if (style.whiteSpace === 'nowrap') {
            properties.noBreak = true;
        } else if (style.whiteSpace === 'wrap') {
            properties.noBreak = false;
        }
    }

    if (style.adbeIlstAlignment) {
        switch (style.adbeIlstAlignment) {
        case 'StyleRunAlignmentType.ROMANBASELINE':
            properties.characterAlignment = CharacterAlignment.ALIGN_BASELINE;
            break;
        case 'StyleRunAlignmentType.bottom':
            properties.characterAlignment = CharacterAlignment.ALIGN_EM_BOTTOM;
            break;
        case 'StyleRunAlignmentType.center':
            properties.characterAlignment = CharacterAlignment.ALIGN_EM_CENTER;
            break;
        case 'StyleRunAlignmentType.top':
            properties.characterAlignment = CharacterAlignment.ALIGN_EM_TOP;
            break;
        case 'StyleRunAlignmentType.icfBottom':
            properties.characterAlignment = CharacterAlignment.ALIGN_ICF_BOTTOM;
            break;
        case 'StyleRunAlignmentType.icfTop':
            properties.characterAlignment = CharacterAlignment.ALIGN_ICF_TOP;
            break;
        }
    }

    target.properties = properties;
};

TEXT.applyAdvancedProperties = function (target, style) {
    var properties = {};

    if (style.adbeHorizontalScale !== undefined) {
        properties.horizontalScale = style.adbeHorizontalScale;
    }

    if (style.adbeVerticalScale !== undefined) {
        properties.verticalScale = style.adbeVerticalScale;
    }

    if (style.baselineShift) {
        var baselineShift = new UnitValue(style.baselineShift.value, style.baselineShift.type);
        properties.baselineShift = baselineShift.as('pt') + ' pt';
    }

    if (style.adbeIdsnSkew !== undefined) {
        properties.skew = style.adbeIdsnSkew;
    }

    if (style.adbeIlstRotation !== undefined) {
        properties.characterRotation = style.adbeIlstRotation;
    }

    if (style.adbeIlstTsume !== undefined) {
        properties.tsume = style.adbeIlstTsume / 100.0;
    }

    if (style.adbeIlstAkiLeft !== undefined) {
        properties.leadingAki = style.adbeIlstAkiLeft;
    }

    if (style.adbeIlstAkiRight !== undefined) {
        properties.trailingAki = style.adbeIlstAkiRight;
    }

    if (style.adbeIlstAlternateGlyphs) {
        switch (style.adbeIlstAlternateGlyphs) {
        case 'AlternateGlyphsForm.EXPERT':
            properties.glyphForm = AlternateGlyphForms.EXPERT_FORM;
            break;
        case 'AlternateGlyphsForm.FULLWIDTH':
            properties.glyphForm = AlternateGlyphForms.FULL_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.JIS04FORM':
            properties.glyphForm = AlternateGlyphForms.JIS04_FORM;
            break;
        case 'AlternateGlyphsForm.JIS78FORM':
            properties.glyphForm = AlternateGlyphForms.JIS78_FORM;
            break;
        case 'AlternateGlyphsForm.JIS83FORM':
            properties.glyphForm = AlternateGlyphForms.JIS83_FORM;
            break;
        case 'AlternateGlyphsForm.JIS90FORM':
            properties.glyphForm = AlternateGlyphForms.JIS90_FORM;
            break;
        case 'AlternateGlyphsForm.PROPORTIONALWIDTH':
            properties.glyphForm = AlternateGlyphForms.PROPORTIONAL_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.QUARTERWIDTH':
            properties.glyphForm = AlternateGlyphForms.QUARTER_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.THIRDWIDTH':
            properties.glyphForm = AlternateGlyphForms.THIRD_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.TRADITIONAL':
            properties.glyphForm = AlternateGlyphForms.TRADITIONAL_FORM;
            break;
        case 'AlternateGlyphsForm.DEFAULTFORM':
            properties.glyphForm = AlternateGlyphForms.NONE;
            break;
        case 'AlternateGlyphsForm.HALFWIDTH':
            properties.glyphForm = AlternateGlyphForms.MONOSPACED_HALF_WIDTH_FORM;
            break;
        }
    }

    if (style.adbeIdsnAppliedLanguageName && style.adbeIdsnAppliedLanguageName !== '[No Language]') {
        var language = app.languagesWithVendors.itemByName(style.adbeIdsnAppliedLanguageName);
        if (language && language.isValid) {
            properties.appliedLanguage = language;
        }
    }
    target.properties = properties;
};

TEXT.applyCharacterColorProperties = function (target, style) {
    var properties = {};

    var colorsOwner;
    if (style.color) {
        if (style.color.__class__ === 'String') {
            colorsOwner = target;
            while (colorsOwner.__class__ !== 'Document' && colorsOwner.__class__ !== 'Application') {
                colorsOwner = colorsOwner.parent;
            }
            var fillColor = colorsOwner.swatches.item(style.color);
            properties.fillColor = fillColor;
        } else {
            properties.fillColor = COLOR.dataToSolidColor(style.color, undefined, target);
        }
    }

    if (style.adbeIlstStrokeColor) {
        if (style.adbeIlstStrokeColor.__class__ === 'String') {
            if (colorsOwner === undefined) {
                colorsOwner = target;
                while (colorsOwner.__class__ !== 'Document' && colorsOwner.__class__ !== 'Application') {
                    colorsOwner = colorsOwner.parent;
                }
            }
            var strokeColor = colorsOwner.swatches.item(style.adbeIlstStrokeColor);
            properties.strokeColor = strokeColor;
        } else {
            properties.strokeColor = COLOR.dataToSolidColor(style.adbeIlstStrokeColor, undefined, target);
        }
    }

    if (style.adbeIlstStrokeColor && style.adbeIlstStrokeWeight !== undefined) {
        properties.strokeWeight = style.adbeIlstStrokeWeight + ' pt';
    }

    if (style.adbeIlstOverprintFill !== undefined) {
        properties.overprintFill = style.adbeIlstOverprintFill;
    }

    if (style.adbeIlstOverprintStroke !== undefined) {
        properties.overprintStroke = style.adbeIlstOverprintStroke;
    }

    if (style.color && style.adbeIdsnFillTint !== undefined) {
        properties.fillTint = style.adbeIdsnFillTint;
    }

    if (style.adbeIlstStrokeColor && style.adbeIdsnStrokeTint !== undefined) {
        properties.strokeTint = style.adbeIdsnStrokeTint;
    }

    if (style.adbeIdsnStrokeAlignment) {
        if (style.adbeIdsnStrokeAlignment === 'TextStrokeAlign.CENTER_ALIGNMENT') {
            properties.strokeAlignment = TextStrokeAlign.CENTER_ALIGNMENT;
        } else if (style.adbeIdsnStrokeAlignment === 'TextStrokeAlign.OUTSIDE_ALIGNMENT') {
            properties.strokeAlignment = TextStrokeAlign.OUTSIDE_ALIGNMENT;
        }
    }

    if (style.adbeIdsnEndJoin) {
        switch (style.adbeIdsnEndJoin) {
        case 'EndJoin.MITER_END_JOIN':
            properties.endJoin = EndJoin.MITER_END_JOIN;
            if (style.adbeIdsnMiterLimit !== undefined) {
                properties.miterLimit = style.adbeIdsnMiterLimit;
            }
            break;
        case 'EndJoin.ROUND_END_JOIN':
            properties.endJoin = EndJoin.ROUND_END_JOIN;
            break;
        case 'EndJoin.BEVEL_END_JOIN':
            properties.endJoin = EndJoin.BEVEL_END_JOIN;
            break;
        }
    }

    target.properties = properties;
};

TEXT.applyOpenTypeProperties = function (target, style) {
    var properties = {};
    var positionSet = false;
    if (style.adbeIlstFigureStyle) {
        switch (style.adbeIlstFigureStyle) {
        case 'FigureStyleType.DEFAULTFIGURESTYLE':
            properties.otfFigureStyle = OTFFigureStyle.DEFAULT_VALUE;
            break;
        case 'FigureStyleType.PROPORTIONAL':
            properties.otfFigureStyle = OTFFigureStyle.PROPORTIONAL_LINING;
            break;
        case 'FigureStyleType.PROPORTIONALOLDSTYLE':
            properties.otfFigureStyle = OTFFigureStyle.PROPORTIONAL_OLDSTYLE;
            break;
        case 'FigureStyleType.TABULAR':
            properties.otfFigureStyle = OTFFigureStyle.TABULAR_LINING;
            break;
        case 'FigureStyleType.TABULAROLDSTYLE':
            properties.otfFigureStyle = OTFFigureStyle.TABULAR_OLDSTYLE;
            break;
        }
    }

    //OpenType feature settings
    //Use the fontFeatureSettings object if it exists, otherwise see if we have the legacy settings array
    var fontFeatureSettings = style.fontFeatureSettingsObject;
    if (!fontFeatureSettings) {
        fontFeatureSettings = style.fontFeatureSettings;
    }
    if (fontFeatureSettings) {
        if (fontFeatureSettings.__class__ === 'Array' && fontFeatureSettings.length > 0) {

            properties.otfSwash = fontFeatureSettings.indexOf('swsh') !== -1;
            properties.otfOrdinal = fontFeatureSettings.indexOf('ordn') !== -1;
            properties.otfDiscretionaryLigature = fontFeatureSettings.indexOf('dlig') !== -1;
            properties.otfContextualAlternate = fontFeatureSettings.indexOf('clig') !== -1;
            properties.ligatures = fontFeatureSettings.indexOf('liga') !== -1;
            properties.otfFraction = fontFeatureSettings.indexOf('frac') !== -1;
            properties.otfTitling = fontFeatureSettings.indexOf('titl') !== -1;
            properties.otfStylisticAlternate = fontFeatureSettings.indexOf('salt') !== -1;
            properties.otfHVKana = fontFeatureSettings.indexOf('hvkn') !== -1;
            properties.otfRomanItalics = fontFeatureSettings.indexOf('rita') !== -1;
            properties.otfSlashedZero = fontFeatureSettings.indexOf('szer') !== -1;

            if (fontFeatureSettings.indexOf('sups') !== -1) {
                properties.position = Position.SUPERSCRIPT;
                positionSet = true;
            } else if (fontFeatureSettings.indexOf('subs') !== -1) {
                properties.position = Position.SUBSCRIPT;
                positionSet = true;
            }
        } else if (fontFeatureSettings.__class__ === 'Object') {

            if (fontFeatureSettings.adbeOTFSwash !== undefined) {
                properties.otfSwash = fontFeatureSettings.adbeOTFSwash;
            }
            if (fontFeatureSettings.adbeOTFOrdinals !== undefined) {
                properties.otfOrdinal = fontFeatureSettings.adbeOTFOrdinals;
            }
            if (fontFeatureSettings.adbeOTFDiscretionaryLigatures !== undefined) {
                properties.otfDiscretionaryLigature = fontFeatureSettings.adbeOTFDiscretionaryLigatures;
            }
            if (fontFeatureSettings.adbeOTFContextualAlternates !== undefined) {
                properties.otfContextualAlternate = fontFeatureSettings.adbeOTFContextualAlternates;
            }
            if (fontFeatureSettings.adbeLigatures !== undefined) {
                properties.ligatures = fontFeatureSettings.adbeLigatures;
            }
            if (fontFeatureSettings.adbeOTFFractions !== undefined) {
                properties.otfFraction = fontFeatureSettings.adbeOTFFractions;
            }
            if (fontFeatureSettings.adbeOTFTitlingAlternates !== undefined) {
                properties.otfTitling = fontFeatureSettings.adbeOTFTitlingAlternates;
            }
            if (fontFeatureSettings.adbeOTFStylisticAlternates !== undefined) {
                properties.otfStylisticAlternate = fontFeatureSettings.adbeOTFStylisticAlternates;
            }
            if (fontFeatureSettings.adbeOTFHVKana !== undefined) {
                properties.otfHVKana = fontFeatureSettings.adbeOTFHVKana;
            }
            if (fontFeatureSettings.adbeOTFRomanItalics !== undefined) {
                properties.otfRomanItalics = fontFeatureSettings.adbeOTFRomanItalics;
            }
            if (fontFeatureSettings.adbeOTFSlashedZero !== undefined) {
                properties.otfSlashedZero = fontFeatureSettings.adbeOTFSlashedZero;
            }

            if (fontFeatureSettings.adbePosition) {
                switch (fontFeatureSettings.adbePosition) {
                case 'Position.NORMAL':
                    properties.position = Position.NORMAL;
                    positionSet = true;
                    break;
                case 'Position.SUBSCRIPT':
                    properties.position = Position.SUBSCRIPT;
                    positionSet = true;
                    break;
                case 'Position.SUPERSCRIPT':
                    properties.position = Position.SUPERSCRIPT;
                    positionSet = true;
                    break;
                }
            }
        }
    }

    if (style.adbeIlstOpenTypePosition) {
        switch (style.adbeIlstOpenTypePosition) {
        case 'FontOpenTypePositionOption.OPENTYPEDEFAULT':
            if (positionSet === false) {
                properties.position = Position.NORMAL;
            }
            break;
        case 'FontOpenTypePositionOption.DENOMINATOR':
            properties.position = Position.OT_DENOMINATOR;
            break;
        case 'FontOpenTypePositionOption.NUMERATOR':
            properties.position = Position.OT_NUMERATOR;
            break;
        case 'FontOpenTypePositionOption.OPENTYPESUBSCRIPT':
            properties.position = Position.OT_SUBSCRIPT;
            break;
        case 'FontOpenTypePositionOption.OPENTYPESUPERSCRIPT':
            properties.position = Position.OT_SUPERSCRIPT;
            break;
        }
    }

    if (style.adbeIlstProportionalMetrics !== undefined) {
        properties.otfProportionalMetrics = style.adbeIlstProportionalMetrics;
    }

    switch (style.adbeIdsnPositionalForm) {
    case 'PositionalForm.CALCULATE':
        properties.positionalForm = PositionalForms.CALCULATE;
        break;
    case 'PositionalForm.FINAL':
        properties.positionalForm = PositionalForms.FINAL;
        break;
    case 'PositionalForm.INITIAL':
        properties.positionalForm = PositionalForms.INITIAL;
        break;
    case 'PositionalForm.ISOLATED':
        properties.positionalForm = PositionalForms.ISOLATED;
        break;
    case 'PositionalForm.MEDIAL':
        properties.positionalForm = PositionalForms.MEDIAL;
        break;
    case 'PositionalForm.NONE':
        properties.positionalForm = PositionalForms.NONE;
        break;
    }

    if (style.adbeIdsnOtfStylisticSets !== undefined) {
        properties.otfStylisticSets = style.adbeIdsnOtfStylisticSets;
    }
    target.properties = properties;
};

TEXT.applyTCYProperties = function (target, style) {
    var properties = {};

    if (style.adbeIdsnTatechuyoko !== undefined) {
        properties.tatechuyoko = style.adbeIdsnTatechuyoko;
    }

    if (style.adbeIlstTateChuYokoHorizontal !== undefined) {
        properties.tatechuyokoXOffset = style.adbeIlstTateChuYokoHorizontal;
    }

    if (style.adbeIlstTateChuYokoVertical !== undefined) {
        properties.tatechuyokoYOffset = style.adbeIlstTateChuYokoVertical;
    }

    target.properties = properties;
};

TEXT.applyWarichuProperties = function (target, style) {
    var properties = {};

    if (style.adbeIlstWariChuEnabled !== undefined) {
        properties.warichu = style.adbeIlstWariChuEnabled;
    }
    if (style.adbeIlstWariChuEnabled) {
        if (style.adbeIlstWariChuJustification) {
            switch (style.adbeIlstWariChuJustification) {
            case 'WariChuJustificationType.WARICHUAUTOJUSTIFY':
                properties.warichuAlignment = WarichuAlignment.AUTO;
                break;
            case 'WariChuJustificationType.Center':
                properties.warichuAlignment = WarichuAlignment.CENTER_ALIGN;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINECENTER':
                properties.warichuAlignment = WarichuAlignment.CENTER_JUSTIFIED;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFY':
                properties.warichuAlignment = WarichuAlignment.FULLY_JUSTIFIED;
                break;
            case 'WariChuJustificationType.Left':
                properties.warichuAlignment = WarichuAlignment.LEFT_ALIGN;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINELEFT':
                properties.warichuAlignment = WarichuAlignment.LEFT_JUSTIFIED;
                break;
            case 'WariChuJustificationType.Right':
                properties.warichuAlignment = WarichuAlignment.RIGHT_ALIGN;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINERIGHT':
                properties.warichuAlignment = WarichuAlignment.RIGHT_JUSTIFIED;
                break;
            }
        }

        if (style.adbeIlstWariChuCharactersAfterBreak !== undefined) {
            properties.warichuCharsAfterBreak = style.adbeIlstWariChuCharactersAfterBreak;
        }
        if (style.adbeIlstWariChuCharactersBeforeBreak !== undefined) {
            properties.warichuCharsBeforeBreak = style.adbeIlstWariChuCharactersBeforeBreak;
        }
        if (style.adbeIlstWariChuLineGap !== undefined) {
            properties.warichuLineSpacing = style.adbeIlstWariChuLineGap;
        }
        if (style.adbeIlstWariChuLines !== undefined) {
            properties.warichuLines = style.adbeIlstWariChuLines;
        }
        if (style.adbeIlstWariChuScale !== undefined) {
            properties.warichuSize = style.adbeIlstWariChuScale;
        }
    }
    target.properties = properties;
};

TEXT.applyMENAProperties = function (target, style) {
    var properties = {};
    if (style.adbeIdsnDigitsType) {
        switch (style.adbeIdsnDigitsType) {
        case 'DigitsTypeOptions.DEFAULT_DIGITS':
            properties.digitsType = DigitsTypeOptions.DEFAULT_DIGITS;
            break;
        case 'DigitsTypeOptions.ARABIC_DIGITS':
            properties.digitsType = DigitsTypeOptions.ARABIC_DIGITS;
            break;
        case 'DigitsTypeOptions.HINDI_DIGITS':
            properties.digitsType = DigitsTypeOptions.HINDI_DIGITS;
            break;
        case 'DigitsTypeOptions.FARSI_DIGITS':
            properties.digitsType = DigitsTypeOptions.FARSI_DIGITS;
            break;
        }
    }

    if (style.adbeIdsnKashidas) {
        switch (style.adbeIdsnKashidas) {
        case 'KashidasOptions.DEFAULT_KASHIDAS':
            properties.kashidas = KashidasOptions.DEFAULT_KASHIDAS;
            break;
        case 'KashidasOptions.KASHIDAS_OFF':
            properties.kashidas = KashidasOptions.KASHIDAS_OFF;
            break;
        }
    }

    if (style.adbeIdsnKashidaWidth) {
        switch (style.adbeIdsnKashidaWidth) {
        case 'KashidaWidth.kashidaNone':
            properties.paragraphKashidaWidth = 0;
            break;
        case 'KashidaWidth.kashidaSmall':
            properties.paragraphKashidaWidth = 1;
            break;
        case 'KashidaWidth.kashidaMedium':
            properties.paragraphKashidaWidth = 2;
            break;
        case 'KashidaWidth.kashidaLong':
            properties.paragraphKashidaWidth = 3;
            properties.paragraphJustification = ParagraphJustificationOptions.NASKH_KASHIDA_JUSTIFICATION_FRAC;
            break;
        case 'KashidaWidth.kashidaStylistic':
            properties.paragraphKashidaWidth = 3;
            properties.paragraphJustification = ParagraphJustificationOptions.NASKH_KASHIDA_JUSTIFICATION;
            break;
        }
    }

    if (style.adbeIdsnCharacterDirection) {
        switch (style.adbeIdsnCharacterDirection) {
        case 'CharacterDirectionOptions.DEFAULT_DIRECTION':
            properties.characterDirection = CharacterDirectionOptions.DEFAULT_DIRECTION;
            break;
        case 'CharacterDirectionOptions.LEFT_TO_RIGHT_DIRECTION':
            properties.characterDirection = CharacterDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
            break;
        case 'CharacterDirectionOptions.RIGHT_TO_LEFT_DIRECTION':
            properties.characterDirection = CharacterDirectionOptions.RIGHT_TO_LEFT_DIRECTION;
            break;
        }
    }

    if (style.adbeIdsnDiacriticPosition) {
        switch (style.adbeIdsnDiacriticPosition) {
        case 'DiacriticPositionOptions.OPENTYPE_POSITION_FROM_BASELINE':
            properties.diacriticPosition = DiacriticPositionOptions.OPENTYPE_POSITION_FROM_BASELINE;
            break;
        case 'DiacriticPositionOptions.OPENTYPE_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.OPENTYPE_POSITION;
            break;
        case 'DiacriticPositionOptions.DEFAULT_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.DEFAULT_POSITION;
            break;
        case 'DiacriticPositionOptions.LOOSE_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.LOOSE_POSITION;
            break;
        case 'DiacriticPositionOptions.MEDIUM_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.MEDIUM_POSITION;
            break;
        case 'DiacriticPositionOptions.TIGHT_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.TIGHT_POSITION;
            break;
        }
    }

    if (style.adbeIdsnXOffsetDiacritic !== undefined) {
        properties.xOffsetDiacritic = style.adbeIdsnXOffsetDiacritic;
    }

    if (style.adbeIdsnYOffsetDiacritic !== undefined) {
        properties.yOffsetDiacritic = style.adbeIdsnYOffsetDiacritic;
    }

    //Use the fontFeatureSettings object if it exists, otherwise see if we have the legacy settings array
    var fontFeatureSettings = style.fontFeatureSettingsObject;
    if (!fontFeatureSettings) {
        fontFeatureSettings = style.fontFeatureSettings;
    }
    if (fontFeatureSettings) {
        if (fontFeatureSettings.__class__ === 'Array' && fontFeatureSettings.length > 0) {

            properties.otfJustificationAlternate = fontFeatureSettings.indexOf('jalt') !== -1;
            properties.otfStretchedAlternate = fontFeatureSettings.indexOf('stal') !== -1;
            properties.otfOverlapSwash = fontFeatureSettings.indexOf('olsh') !== -1;
        } else if (fontFeatureSettings.__class__ === 'Object') {

            if (fontFeatureSettings.adbeOTFJustificationAlternates !== undefined) {
                properties.otfJustificationAlternate = fontFeatureSettings.adbeOTFJustificationAlternates;
            }
            if (fontFeatureSettings.adbeOTFStretchedAlternates !== undefined) {
                properties.otfStretchedAlternate = fontFeatureSettings.adbeOTFStretchedAlternates;
            }
            if (fontFeatureSettings.adbeOTFOverlapSwash !== undefined) {
                properties.otfOverlapSwash = fontFeatureSettings.adbeOTFOverlapSwash;
            }
        }
    }

    target.properties = properties;
};

TEXT.applyKentenProperties = function (target, style) {
    var properties = {};
    if (style.adbeIdsnKentenKind !== undefined && style.adbeIdsnKentenKind !== 'KentenKind.NONE') {

        if (style.adbeIdsnKentenPlacement !== undefined) {
            properties.kentenPlacement = style.adbeIdsnKentenPlacement;
        }

        if (style.adbeIdsnKentenPosition) {
            if (style.adbeIdsnKentenPosition === 'RubyKentenPosition.BELOW_LEFT') {
                properties.kentenPosition = RubyKentenPosition.BELOW_LEFT;
            } else if (style.adbeIdsnKentenPosition === 'RubyKentenPosition.ABOVE_RIGHT') {
                properties.kentenPosition = RubyKentenPosition.ABOVE_RIGHT;
            }
        }

        if (style.adbeIdsnKentenFontSize !== undefined) {
            properties.kentenFontSize = style.adbeIdsnKentenFontSize;
        }

        if (style.adbeIdsnKentenAlignment) {
            if (style.adbeIdsnKentenAlignment === 'KentenAlignment.ALIGN_KENTEN_CENTER') {
                properties.kentenAlignment = KentenAlignment.ALIGN_KENTEN_CENTER;
            } else if (style.adbeIdsnKentenAlignment === 'KentenAlignment.ALIGN_KENTEN_LEFT') {
                properties.kentenAlignment = KentenAlignment.ALIGN_KENTEN_LEFT;
            }
        }

        if (style.adbeIdsnKentenXScale !== undefined) {
            properties.kentenXScale = style.adbeIdsnKentenXScale;
        }

        if (style.adbeIdsnKentenYScale !== undefined) {
            properties.kentenYScale = style.adbeIdsnKentenYScale;
        }

        switch (style.adbeIdsnKentenKind) {
        case 'KentenKind.CUSTOM':
            properties.kentenKind = KentenCharacter.CUSTOM;
            break;
        case 'KentenKind.KENTEN_BLACK_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_BLACK_CIRCLE;
            break;
        case 'KentenKind.KENTEN_BLACK_TRIANGLE':
            properties.kentenKind = KentenCharacter.KENTEN_BLACK_TRIANGLE;
            break;
        case 'KentenKind.KENTEN_BULLSEYE':
            properties.kentenKind = KentenCharacter.KENTEN_BULLSEYE;
            break;
        case 'KentenKind.KENTEN_FISHEYE':
            properties.kentenKind = KentenCharacter.KENTEN_FISHEYE;
            break;
        case 'KentenKind.KENTEN_SESAME_DOT':
            properties.kentenKind = KentenCharacter.KENTEN_SESAME_DOT;
            break;
        case 'KentenKind.KENTEN_SMALL_BLACK_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_SMALL_BLACK_CIRCLE;
            break;
        case 'KentenKind.KENTEN_SMALL_WHITE_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_SMALL_WHITE_CIRCLE;
            break;
        case 'KentenKind.KENTEN_WHITE_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_WHITE_CIRCLE;
            break;
        case 'KentenKind.KENTEN_WHITE_SESAME_DOT':
            properties.kentenKind = KentenCharacter.KENTEN_WHITE_SESAME_DOT;
            break;
        case 'KentenKind.KENTEN_WHITE_TRIANGLE':
            properties.kentenKind = KentenCharacter.KENTEN_WHITE_TRIANGLE;
            break;
        case 'KentenKind.NONE':
            properties.kentenKind = KentenCharacter.NONE;
            break;
        }

        if (style.adbeIdsnKentenKind === 'KentenKind.CUSTOM') {

            if (style.adbeIdsnKentenFont) {
                var kentenFont = TEXT.dataToFont(style.adbeIdsnKentenFont, style.adbeIdsnKentenFont.family, true);
                if (kentenFont) {
                    try {
                        properties.kentenFont = kentenFont;
                        properties.kentenFontStyle = kentenFont.fontStyleName;
                    } catch (ignore) {
                        //alert(ex1);
                    }
                }
            }

            if (style.adbeIdsnKentenCustomCharacter) {
                properties.kentenCustomCharacter = style.adbeIdsnKentenCustomCharacter;
            }

            if (style.adbeIdsnKentenCharacterSet) {
                switch (style.adbeIdsnKentenCharacterSet) {
                case 'KentenCharacterSet.CHARACTER_INPUT':
                    properties.kentenCharacterSet = KentenCharacterSet.CHARACTER_INPUT;
                    break;
                case 'KentenCharacterSet.JIS':
                    properties.kentenCharacterSet = KentenCharacterSet.JIS;
                    break;
                case 'KentenCharacterSet.KUTEN':
                    properties.kentenCharacterSet = KentenCharacterSet.KUTEN;
                    break;
                case 'KentenCharacterSet.SHIFT_JIS':
                    properties.kentenCharacterSet = KentenCharacterSet.SHIFT_JIS;
                    break;
                case 'KentenCharacterSet.UNICODE':
                    properties.kentenCharacterSet = KentenCharacterSet.UNICODE;
                    break;
                default:
                    properties.kentenCharacterSet = KentenCharacterSet.CHARACTER_INPUT;
                }
            }
        }

        if (style.adbeIdsnKentenTint !== undefined) {
            properties.kentenTint = style.adbeIdsnKentenTint === 'KentenTint.AUTO' ? -1 : style.adbeIdsnKentenTint;
        }

        if (style.adbeIdsnKentenWeight !== undefined) {
            properties.kentenWeight = style.adbeIdsnKentenWeight === 'KentenWeight.AUTO' ? -1 : style.adbeIdsnKentenWeight;
        }

        if (style.adbeIdsnKentenOverprintFill) {
            if (style.adbeIdsnKentenOverprintFill === 'AdornmentOverprint.AUTO') {
                properties.kentenOverprintFill = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnOverprintFill === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.kentenOverprintFill = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnOverprintFill === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.kentenOverprintFill = AdornmentOverprint.OVERPRINT_OFF;
            }
        }

        if (style.adbeIdsnKentenOverprintStroke) {
            if (style.adbeIdsnKentenOverprintStroke === 'AdornmentOverprint.AUTO') {
                properties.kentenOverprintStroke = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnOverprintStroke === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.kentenOverprintStroke = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnOverprintStroke === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.kentenOverprintStroke = AdornmentOverprint.OVERPRINT_OFF;
            }
        }

        if (style.adbeIdsnKentenFillColor) {
            properties.kentenFillColor = TEXT.dataToColor(style.adbeIdsnKentenFillColor, target);
        }
        if (style.adbeIdsnKentenStrokeColor) {
            properties.kentenStrokeColor = TEXT.dataToColor(style.adbeIdsnKentenStrokeColor, target);
        }
    } else if (style.adbeIdsnKentenKind === 'KentenKind.NONE') {
        properties.kentenKind = KentenCharacter.NONE;
    }
    target.properties = properties;
};

TEXT.applyRubyProperties = function (target, style) {
    var properties = {};
    if (style.adbeIdsnRubyFlag !== undefined && style.adbeIdsnRubyFlag === true) {
        properties.rubyFlag = true;

        if (style.adbeIdsnRubyType) {
            if (style.adbeIdsnRubyType === 'RubyType.GROUP_RUBY') {
                properties.rubyType = RubyTypes.GROUP_RUBY;
            } else if (style.adbeIdsnRubyType === 'RubyType.PER_CHARACTER_RUBY') {
                properties.rubyType = RubyTypes.PER_CHARACTER_RUBY;
            }
        }

        if (style.adbeIdsnRubyAlignment) {
            switch (style.adbeIdsnRubyAlignment) {
            case 'RubyAlignment.RUBY_1_AKI':
                properties.rubyAlignment = RubyAlignments.RUBY_1_AKI;
                break;
            case 'RubyAlignment.RUBY_CENTER':
                properties.rubyAlignment = RubyAlignments.RUBY_CENTER;
                break;
            case 'RubyAlignment.RUBY_EQUAL_AKI':
                properties.rubyAlignment = RubyAlignments.RUBY_EQUAL_AKI;
                break;
            case 'RubyAlignment.RUBY_FULL_JUSTIFY':
                properties.rubyAlignment = RubyAlignments.RUBY_FULL_JUSTIFY;
                break;
            case 'RubyAlignment.RUBY_JIS':
                properties.rubyAlignment = RubyAlignments.RUBY_JIS;
                break;
            case 'RubyAlignment.RUBY_LEFT':
                properties.rubyAlignment = RubyAlignments.RUBY_LEFT;
                break;
            case 'RubyAlignment.RUBY_RIGHT':
                properties.rubyAlignment = RubyAlignments.RUBY_RIGHT;
                break;
            }
        }

        if (style.adbeIdsnRubyPosition) {
            switch (style.adbeIdsnRubyPosition) {
            case 'RubyKentenPosition.ABOVE_RIGHT':
                properties.rubyPosition = RubyKentenPosition.ABOVE_RIGHT;
                break;
            case 'RubyKentenPosition.BELOW_LEFT':
                properties.rubyPosition = RubyKentenPosition.BELOW_LEFT;
                break;
            }
        }

        if (style.adbeIdsnRubyXOffset !== undefined) {
            properties.rubyXOffset = style.adbeIdsnRubyXOffset;
        }

        if (style.adbeIdsnRubyYOffset !== undefined) {
            properties.rubyYOffset = style.adbeIdsnRubyYOffset;
        }

        if (style.adbeIdsnRubyFont) {
            var rubyFont = TEXT.dataToFont(style.adbeIdsnRubyFont, style.adbeIdsnRubyFont.family, true);
            if (rubyFont) {
                try {
                    properties.rubyFont = rubyFont;
                    properties.rubyFontStyle = style.adbeIdsnRubyFont.style;
                } catch (ignore) {
                    //alert(ex2);
                }
            }
        }

        if (style.adbeIdsnRubyFontSize !== undefined) {
            properties.rubyFontSize = style.adbeIdsnRubyFontSize;
        }

        if (style.adbeIdsnRubyXScale !== undefined) {
            properties.rubyXScale = style.adbeIdsnRubyXScale;
        }

        if (style.adbeIdsnRubyYScale !== undefined) {
            properties.rubyYScale = style.adbeIdsnRubyYScale;
        }

        if (style.adbeIdsnRubyOpenTypePro !== undefined) {
            properties.rubyOpenTypePro = style.adbeIdsnRubyOpenTypePro;
        }

        if (style.adbeIdsnRubyAutoTcyDigits !== undefined) {
            properties.rubyAutoTcyDigits = style.adbeIdsnRubyAutoTcyDigits;
        }

        if (style.adbeIdsnRubyAutoTcyIncludeRoman !== undefined) {
            properties.rubyAutoTcyIncludeRoman = style.adbeIdsnRubyAutoTcyIncludeRoman;
        }

        if (style.adbeIdsnRubyAutoTcyAutoScale !== undefined) {
            properties.rubyAutoTcyAutoScale = style.adbeIdsnRubyAutoTcyAutoScale;
        }

        if (style.adbeIdsnRubyParentOverhangAmount) {
            switch (style.adbeIdsnRubyParentOverhangAmount) {
            case 'RubyOverhang.NONE':
                properties.rubyParentOverhangAmount = RubyOverhang.NONE;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_HALF_CHAR':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_HALF_CHAR;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_HALF_RUBY':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_HALF_RUBY;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_NO_LIMIT':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_NO_LIMIT;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_ONE_CHAR':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_ONE_CHAR;
                break;
            case 'RubyOverhang.RUBY_OVERHAND_ONE_RUBY':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHAND_ONE_RUBY;
                break;
            }
        }

        if (style.adbeIdsnRubyParentSpacing) {
            switch (style.adbeIdsnRubyParentSpacing) {
            case 'RubyParentSpacing.RUBY_PARENT_121_AKI':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_121_AKI;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_BOTH_SIDES':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_BOTH_SIDES;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_EQUAL_AKI':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_EQUAL_AKI;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_FULL_JUSTIFY':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_FULL_JUSTIFY;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_NO_ADJUSTMENT':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_NO_ADJUSTMENT;
                break;
            }
        }

        if (style.adbeIdsnRubyAutoScaling !== undefined) {
            properties.rubyAutoScaling = style.adbeIdsnRubyAutoScaling;

            if (style.adbeIdsnRubyAutoScaling && style.adbeIdsnRubyParentScalingPercent !== undefined) {
                properties.rubyParentScalingPercent = style.adbeIdsnRubyParentScalingPercent;
            }
        }

        if (style.adbeIdsnRubyAutoAlign !== undefined) {
            properties.rubyAutoAlign = style.adbeIdsnRubyAutoAlign;
        }

        if (style.adbeIdsnRubyFillColor) {
            properties.rubyFill = TEXT.dataToColor(style.adbeIdsnRubyFillColor, target);
        }

        if (style.adbeIdsnRubyStrokeColor) {
            properties.rubyStroke = TEXT.dataToColor(style.adbeIdsnRubyStrokeColor, target);
        }

        if (style.adbeIdsnRubyTint !== undefined) {
            properties.rubyTint = style.adbeIdsnRubyTint === 'RubyTint.AUTO' ? -1 : style.adbeIdsnRubyTint;
        }

        if (style.adbeIdsnRubyWeight !== undefined) {
            properties.rubyWeight = style.adbeIdsnRubyWeight === 'RubyWeight.AUTO' ? -1 : style.adbeIdsnRubyWeight;
        }

        if (style.adbeIdsnRubyOverprintFill) {
            if (style.adbeIdsnRubyOverprintFill === 'AdornmentOverprint.AUTO') {
                properties.rubyOverprintFill = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnRubyOverprintFill === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.rubyOverprintFill = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnRubyOverprintFill === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.rubyOverprintFill = AdornmentOverprint.OVERPRINT_OFF;
            }
        }

        if (style.adbeIdsnRubyOverprintStroke) {
            if (style.adbeIdsnRubyOverprintStroke === 'AdornmentOverprint.AUTO') {
                properties.rubyOverprintStroke = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnRubyOverprintStroke === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.rubyOverprintStroke = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnRubyOverprintStroke === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.rubyOverprintStroke = AdornmentOverprint.OVERPRINT_OFF;
            }
        }
    } else if (style.adbeIdsnRubyFlag === false) {
        properties.rubyFlag = false;
    }
    if (properties) {
        target.properties = properties;
    }
};

TEXT.applyShataiProperties = function (target, style) {
    var properties = {};

    if (style.adbeIdsnShataiMagnification !== undefined) {
        properties.shataiMagnification = style.adbeIdsnShataiMagnification;
    }
    if (style.adbeIdsnShataiDegreeAngle !== undefined) {
        properties.shataiDegreeAngle = style.adbeIdsnShataiDegreeAngle;
    }
    if (style.adbeIdsnShataiAdjustRotation !== undefined) {
        properties.shataiAdjustRotation = style.adbeIdsnShataiAdjustRotation;
    }
    if (style.adbeIdsnShataiAdjustTsume !== undefined) {
        properties.shataiAdjustTsume = style.adbeIdsnShataiAdjustTsume;
    }

    target.properties = properties;
};

TEXT.applyStrikeThroughProperties = function (target, style) {
    if (style.textDecoration && style.textDecoration.indexOf('line-through') !== -1) {
        var properties = {};

        if (style.adbeIdsnStrikeThroughWeight) {
            var strikeThroughWeight = new UnitValue(style.adbeIdsnStrikeThroughWeight.value, style.adbeIdsnStrikeThroughWeight.type);
            properties.strikeThroughWeight = strikeThroughWeight.as('pt') + ' pt';
        }

        if (style.adbeIdsnStrikeThroughType) {
            var strikeThroughStyle = TEXT.dataToStrokeStyle(style.adbeIdsnStrikeThroughType);
            if (strikeThroughStyle && strikeThroughStyle.isValid) {
                properties.strikeThroughType = strikeThroughStyle;
            }
        }

        if (style.adbeIdsnStrikeThroughOffset) {
            var strikeThroughOffset = new UnitValue(style.adbeIdsnStrikeThroughOffset.value, style.adbeIdsnStrikeThroughOffset.type);
            properties.strikeThroughOffset = strikeThroughOffset.as('pt') + ' pt';
        }

        if (style.adbeIdsnStrikeThroughColor) {
            properties.strikeThroughColor = TEXT.dataToColor(style.adbeIdsnStrikeThroughColor, target);

            if (style.adbeIdsnStrikeThroughTint !== undefined) {
                properties.strikeThroughTint = style.adbeIdsnStrikeThroughTint;
            }

            if (style.adbeIdsnStrikeThroughOverprint !== undefined) {
                properties.strikeThroughOverprint = style.adbeIdsnStrikeThroughOverprint;
            }
        }

        if (style.adbeIdsnStrikeThroughGapColor) {
            properties.strikeThroughGapColor = TEXT.dataToColor(style.adbeIdsnStrikeThroughGapColor, target);

            if (style.adbeIdsnStrikeThroughGapTint !== undefined) {
                properties.strikeThroughGapTint = style.adbeIdsnStrikeThroughGapTint;
            }

            if (style.adbeIdsnStrikeThroughGapOverprint !== undefined) {
                properties.strikeThroughGapOverprint = style.adbeIdsnStrikeThroughGapOverprint;
            }
        }

        target.properties = properties;
    }
};

TEXT.applyUnderlineProperties = function (target, style) {
    if (style.textDecoration && style.textDecoration.indexOf('underline') !== -1) {
        var properties = {};

        if (style.adbeIdsnUnderlineWeight) {
            var underlineWeight = new UnitValue(style.adbeIdsnUnderlineWeight.value, style.adbeIdsnUnderlineWeight.type);
            properties.underlineWeight = underlineWeight.as('pt') + ' pt';
        }

        if (style.adbeIdsnUnderlineType) {
            var underlineStyle = TEXT.dataToStrokeStyle(style.adbeIdsnUnderlineType);
            if (underlineStyle && underlineStyle.isValid) {
                properties.underlineType = underlineStyle;
            }
        }

        if (style.adbeIdsnUnderlineOffset) {
            var underlineOffset = new UnitValue(style.adbeIdsnUnderlineOffset.value, style.adbeIdsnUnderlineOffset.type);
            properties.underlineOffset = underlineOffset.as('pt') + ' pt';
        }

        if (style.adbeIdsnUnderlineColor) {
            properties.underlineColor = TEXT.dataToColor(style.adbeIdsnUnderlineColor, target);

            if (style.adbeIdsnUnderlineTint !== undefined) {
                properties.underlineTint = style.adbeIdsnUnderlineTint;
            }

            if (style.adbeIdsnUnderlineOverprint !== undefined) {
                properties.underlineOverprint = style.adbeIdsnUnderlineOverprint;
            }
        }

        if (style.adbeIdsnUnderlineGapColor) {
            properties.underlineGapColor = TEXT.dataToColor(style.adbeIdsnUnderlineGapColor, target);

            if (style.adbeIdsnUnderlineGapTint !== undefined) {
                properties.underlineGapTint = style.adbeIdsnUnderlineGapTint;
            }

            if (style.adbeIdsnUnderlineGapOverprint !== undefined) {
                properties.underlineGapOverprint = style.adbeIdsnUnderlineGapOverprint;
            }
        }
        target.properties = properties;
    }
};

TEXT.removeStylesAndStyleGroups = function (collection, isParaStyle) {
    var i;
    if (isParaStyle) {
        for (i = collection.length - 1; i >= 0; --i) {
            try {
                collection[i].forceDelete(); //gets rid of [Basic Paragraph Style] as well
            } catch (ignore) {
                //Will fail for [No Paragraph Style], ignore.
            }
        }
    } else {
        for (i = collection.length - 1; i >= 0; --i) {
            try {
                collection[i].remove();
            } catch (ignore) {
                //Will fail for [None] character style, ignore.
            }
        }
    }
};

TEXT.removeAllTypeStyles = function (doc) {
    TEXT.removeStylesAndStyleGroups(doc.paragraphStyleGroups, false);
    TEXT.removeStylesAndStyleGroups(doc.paragraphStyles, true);
    TEXT.removeStylesAndStyleGroups(doc.characterStyleGroups, false);
    TEXT.removeStylesAndStyleGroups(doc.characterStyles, false);
};

TEXT.getAllTypeStyles = function (doc, isCharStyle) {
    var collection;
    if (isCharStyle) {
        collection = doc.allCharacterStyles;
    } else {
        collection = doc.allParagraphStyles;
    }

    var styleNames = [];
    var length = collection.length;

    var i, styleName;
    for (i = 0; i < length; ++i) {
        styleName = TEXT.getStyleFullyQualifiedName(collection[i]);
        if (isCharStyle && styleName === AppStrings.NoneCharacterStyle) {
            continue;
        }
        if (!isCharStyle && styleName === AppStrings.NoParagraphStyle) {
            continue;
        }
        styleNames.push(styleName);
    }
    return styleNames;
};

TEXT.applyIdToAllStylesWithBlankUniqueID = function (targetDoc, uniqueId) {
    var typeStyle;

    //Apply unique id to all character styles in the document.
    var charStyles = targetDoc.allCharacterStyles;

    var i;
    for (i = 0; i < charStyles.length; ++i) {
        typeStyle = charStyles[i];
        if (typeStyle && typeStyle.isValid && typeStyle.styleUniqueId === '') {
            typeStyle.styleUniqueId = uniqueId;
        }
    }

    //Apply unique id to all paragraph styles in the document.
    var paraStyles = targetDoc.allParagraphStyles;

    for (i = 0; i < paraStyles.length; ++i) {
        typeStyle = paraStyles[i];
        if (typeStyle && typeStyle.isValid && typeStyle.styleUniqueId === '') {
            typeStyle.styleUniqueId = uniqueId;
        }
    }
};

var ConflictEnum = {
    STYLES_MATCH: 0, //No conflict, all styles match
    STYLES_CONFLICT: 1, //At least one conflicting style
    STYLES_MISSING: 2 //No conflict, but atleast one style is missing
};

TEXT.hasConflictingStyles = function (targetDoc, sourceDoc, isCharStyle) {
    var targetTypeStyle, sourceTypeStyle;
    var styleNames = TEXT.getAllTypeStyles(sourceDoc, isCharStyle);

    var areAllStylesPresent = true; //one or more styles are missing.
    var i;
    for (i = 0; i < styleNames.length; ++i) {
        sourceTypeStyle = TEXT.getStyleByFullyQualifiedName(styleNames[i], isCharStyle, sourceDoc);
        targetTypeStyle = TEXT.getStyleByFullyQualifiedName(styleNames[i], isCharStyle, targetDoc);
        if (targetTypeStyle && targetTypeStyle.isValid && sourceTypeStyle && sourceTypeStyle.isValid) {
            if (targetTypeStyle.styleUniqueId !== sourceTypeStyle.styleUniqueId) {
                //We have got a conflict
                return ConflictEnum.STYLES_CONFLICT;
            }
        } else {
            areAllStylesPresent = false;
        }
    }

    //For paragraph styles, also check the character styles (nested styles...)
    if (!isCharStyle) {
        styleNames = TEXT.getAllTypeStyles(sourceDoc, true);
        for (i = 0; i < styleNames.length; ++i) {
            sourceTypeStyle = TEXT.getStyleByFullyQualifiedName(styleNames[i], true, sourceDoc);
            targetTypeStyle = TEXT.getStyleByFullyQualifiedName(styleNames[i], true, targetDoc);
            if (targetTypeStyle && targetTypeStyle.isValid && sourceTypeStyle && sourceTypeStyle.isValid) {
                if (targetTypeStyle.styleUniqueId !== sourceTypeStyle.styleUniqueId) {
                    //We have got a conflict
                    return ConflictEnum.STYLES_CONFLICT;
                }
            } else {
                areAllStylesPresent = false;
            }
        }
    }

    if (areAllStylesPresent) {
        return ConflictEnum.STYLES_MATCH;
    }

    return ConflictEnum.STYLES_MISSING;
};

TEXT.createTypeStyle = function (typography) {
    var stylesOwner;

    try {
        if (app.documents.length !== 0) {
            //app.activeDocument throws if the only documents that are open, are opened in background.
            stylesOwner = app.activeDocument;
        }
    } catch (ignore) {}

    if (!stylesOwner) {
        stylesOwner = app;
    }

    var isCharStyle = (typography.type === 'charstyle');
    var typeStyle; //undefined

    var styleConflict = ConflictEnum.STYLES_MATCH;
    var strategy; //undefined
    var newTypeStyle;

    if (typography.hasOwnProperty('idmsPath')) {

        //create the font if it does not exist.
        TEXT.dataToFont(typography.adbeFont, typography.fontFamily, true);

        //Create a temporary document to place the snippet.
        var newDoc = TEXT.createHeadlessDocument();
        TEXT.removeAllTypeStyles(newDoc);

        //Place the snippet file. This adds the required styles to the document.
        var pageItems = newDoc.pages[0].place(typography.idmsPath, [0, 0], undefined, false, true);
        if (pageItems.length !== 1) {
            TEXT.closeHeadlessDocument(newDoc);
            return;
        }

        //Rename the applied style
        if (isCharStyle) {
            newTypeStyle = pageItems[0].texts[0].appliedCharacterStyle;
        } else {
            newTypeStyle = pageItems[0].texts[0].appliedParagraphStyle;
        }

        var previousUniqueId = newTypeStyle.styleUniqueId;
        if (typography.name) {
            try {
                newTypeStyle.name = typography.name;
            } catch (ignore) {
                //Catch and ignore issues with naming, for example, if the Libraries style asset has been renamed
                //to a style name which already exists in this style's hierarchy.
            }
        }

        if (previousUniqueId !== newTypeStyle.styleUniqueId) {
            newTypeStyle.styleUniqueId = previousUniqueId;
        }

        //Apply uniqueid to every style that came in without a style unique id.
        TEXT.applyIdToAllStylesWithBlankUniqueID(newDoc, typography.id);

        //Check for style conflicts
        styleConflict = TEXT.hasConflictingStyles(stylesOwner, newDoc, isCharStyle);

        var styleName = TEXT.getStyleFullyQualifiedName(newTypeStyle);

        if (styleConflict === ConflictEnum.STYLES_CONFLICT) {
            if (TEXT.GlobalConflictResolutionStrategy.initialized !== true) {
                //We have a style conflict. Get the resolution strategy from user.
                strategy = stylesOwner.getStyleConflictResolutionStrategy(isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE);
                if (strategy === false) {
                    strategy = undefined;
                }
                TEXT.GlobalConflictResolutionStrategy.initialized = true;
                TEXT.GlobalConflictResolutionStrategy.strategy = strategy;
            } else {
                strategy = TEXT.GlobalConflictResolutionStrategy.strategy;
            }
        } else if (styleConflict === ConflictEnum.STYLES_MISSING) {
            strategy = GlobalClashResolutionStrategy.DO_NOT_LOAD_THE_STYLE; //Bring in just the missing styles
        } else if (styleConflict === ConflictEnum.STYLES_MATCH) {
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, isCharStyle, stylesOwner);
            strategy = undefined;
        }

        if (strategy !== undefined) {
            //Save the document, and import its styles into the active document using the resolution strategy.
            var newDocPath = Folder.temp.fsName + '/TextStyles' + $.hiresTimer + '.indd';
            newDoc.save(newDocPath);

            stylesOwner.importStyles(ImportFormat.TEXT_STYLES_FORMAT, newDocPath, strategy);

            //Get hold of the imported style
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, isCharStyle, stylesOwner);

            //Get rid of the temporary document
            TEXT.closeHeadlessDocument(newDoc);


            var tempFile = new File(newDocPath);
            app.removeFileFromRecentFiles(tempFile); //Ensure it doesn't show up in recent documents list
            tempFile.remove();
        } else {
            TEXT.closeHeadlessDocument(newDoc);
        }
    } else {
        //Check for style conflicts
        if (isCharStyle) {
            typeStyle = stylesOwner.characterStyles.itemByName(typography.name);
        } else {
            typeStyle = stylesOwner.paragraphStyles.itemByName(typography.name);
        }

        if (typeStyle && typeStyle.isValid) {
            if (typeStyle.styleUniqueId === typography.id) {
                styleConflict = ConflictEnum.STYLES_MATCH;
                strategy = undefined;
            } else {
                styleConflict = ConflictEnum.STYLES_CONFLICT;
                //We have a style conflict. Get the resolution strategy from user.
                strategy = stylesOwner.getStyleConflictResolutionStrategy(isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE);
                if (strategy === false) {
                    strategy = undefined;
                    typeStyle = undefined;
                }
            }
        } else {
            styleConflict = ConflictEnum.STYLES_MISSING;
            strategy = GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE;
        }

        if (strategy === GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE) {
            if (isCharStyle) {
                newTypeStyle = TEXT.createCharacterStyle(typography);
            } else {
                newTypeStyle = TEXT.createParagraphStyle(typography);
            }

            if (styleConflict === ConflictEnum.STYLES_CONFLICT) {
                //We are using the incoming definition of the style. Remove existing, replacing with the new.
                typeStyle.remove(newTypeStyle);
            }

            newTypeStyle.name = typography.name;
            typeStyle = newTypeStyle;
            typeStyle.styleUniqueId = typography.id;
        }
    }
    return typeStyle;
};

TEXT.applyTypeStyle = function (text, typeStyle) {
    if (typeStyle.__class__ === 'CharacterStyle') {
        text.appliedCharacterStyle = typeStyle;
    } else if (typeStyle.__class__ === 'ParagraphStyle') {
        text.appliedParagraphStyle = typeStyle;
    }
};

TEXT.setOrAddTypeStyles = function (justAddStyle) {
    'use strict';
    var doc;
    //var newDocCreated = false; //Did we create a new document as well?
    //var textref; //new text layer
    var typeStyle; //applied style

    try {

        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                doc = app.activeDocument;
            }
        } catch (ignore) {}

        if (!doc && !justAddStyle) {
            return;
        }

        var selection = [];
        try {
            selection = app.selection;
        } catch (ignore) {}

        var hasTextElements = false;
        var i;
        for (i = 0; i < selection.length; i++) {
            if (selection[i].hasOwnProperty('characters')) {
                hasTextElements = true;
            }
        }

        TEXT.GlobalConflictResolutionStrategy.initialized = false;
        var numStyles = TEXT.TypographyArray.length;
        var areCharStyles = true;
        if (numStyles > 0) {
            if (TEXT.TypographyArray[0].type === 'parastyle') {
                areCharStyles = false;
            }
        }

        var itr, typography, triedOnce;
        for (itr = 0; itr < TEXT.TypographyArray.length; itr++) {
            typography = TEXT.TypographyArray[itr];
            //var size = new UnitValue(typography.fontSize ? typography.fontSize.value : 12, typography.fontSize ? typography.fontSize.type : 'pt');
            //var fontSize = size.as('pt');

            if (hasTextElements && justAddStyle === false) {
                triedOnce = false;
                for (i = 0; i < selection.length; i++) {
                    if (!selection[i].hasOwnProperty('characters')) {
                        //Non text selection.
                        continue;
                    }

                    if (TEXT.isLockedStory(selection[i].texts[0])) {
                        //Locked story.
                        continue;
                    }

                    if (selection[i].__class__ === 'TextFrame') {
                        //For threaded text frames, we skip applying text attributes.
                        if (selection[i].parentStory.textContainers.length === 1) {
                            if (!typeStyle && !triedOnce) {
                                typeStyle = TEXT.createTypeStyle(typography);
                                triedOnce = true;
                            }
                            //Apply to the entire story including overset text
                            if (typeStyle) {
                                TEXT.applyTypeStyle(selection[i].parentStory.texts[0], typeStyle);
                            }
                            /* else {
                                                            TEXT.setTextAttributes(selection[i].parentStory.texts[0], typography);
                                                        }*/
                        }
                    } else {
                        if (!typeStyle && !triedOnce) {
                            typeStyle = TEXT.createTypeStyle(typography);
                            triedOnce = true;
                        }
                        if (typeStyle) {
                            //Apply to the entire story including overset text
                            TEXT.applyTypeStyle(selection[i].texts[0], typeStyle);
                        }
                        /* else {
                                                    TEXT.setTextAttributes(selection[i].texts[0], typography);
                                                }*/
                    }
                }
            } else {
                TEXT.createTypeStyle(typography);
            }
        }
        TEXT.GlobalConflictResolutionStrategy.initialized = false;

        if (numStyles > 0) {
            if (areCharStyles) {
                app.openPanel(TextPanelActionID.CharacterStyle);
            } else {
                app.openPanel(TextPanelActionID.ParagraphStyle);
            }
        }
    } catch (ex) {
        //alert(ex);
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-setOrAddTypeStyles()', ex);
    }

};

TEXT.setFont = function (typography) {
    'use strict';

    TEXT.TypographyArray = [];
    TEXT.TypographyArray.push(typography);

    try {
        app.doScript(
            'TEXT.setOrAddTypeStyles(false);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Apply Text Style'
        );
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-setFont()', ex);
    }

    TEXT.TypographyArray = [];
};

TEXT.addTextStyle = function (typography, isFirstElement, isLastElement) {
    if (isFirstElement !== false) {
        TEXT.TypographyArray = [];
    }

    TEXT.TypographyArray.push(typography);

    if (isLastElement !== false) {
        try {
            app.doScript(
                'TEXT.setOrAddTypeStyles(true);',
                undefined,
                undefined,
                UndoModes.entireScript,
                '$ID/Apply Text Style'
            );
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-addTextStyle()', ex);
        }
        TEXT.TypographyArray = [];
    }
};

// Paragraph only properties - IndentsAndSpacing, Tabs, Hyphenation, Justification, Japanese Composition
// Called only for paragraph styles, these properties don't need the NOTHING checks

TEXT.collectIndentsSpacingAndDirection = function (obj, source) {
    // Alignment
    // Left Indent
    // First Line Indent
    // Right Indent
    // Space Before
    // Space After
    // Paragraph Direction
    var prefsOwner = TEXT.getPrefsOwner();

    var horizontalUnits = prefsOwner.viewPreferences.horizontalMeasurementUnits;
    var verticalUnits = prefsOwner.viewPreferences.verticalMeasurementUnits;

    if (source.justification !== Justification.TO_BINDING_SIDE && source.justification !== Justification.AWAY_FROM_BINDING_SIDE) {
        obj.adbeParaAlignment = 'Alignment.' + source.justification.toString();
    }

    var leftIndent = TEXT.convertUnitsToPoints(horizontalUnits, source.leftIndent);
    obj.adbeLeftIndent = {
        type: 'pt',
        value: leftIndent
    };

    var firstLineIndent = TEXT.convertUnitsToPoints(horizontalUnits, source.firstLineIndent);
    obj.adbeFirstLineIndent = {
        type: 'pt',
        value: firstLineIndent
    };

    var rightIndent = TEXT.convertUnitsToPoints(horizontalUnits, source.rightIndent);
    obj.adbeRightIndent = {
        type: 'pt',
        value: rightIndent
    };

    var spaceBefore = TEXT.convertUnitsToPoints(verticalUnits, source.spaceBefore);
    obj.adbeSpaceBefore = {
        type: 'pt',
        value: spaceBefore
    };

    var spaceAfter = TEXT.convertUnitsToPoints(verticalUnits, source.spaceAfter);
    obj.adbeSpaceAfter = {
        type: 'pt',
        value: spaceAfter
    };

    var paraDirection = source.paragraphDirection;
    if (paraDirection !== NothingEnum.NOTHING) {
        obj.adbeIdsnParagraphDirection = 'ParagraphDirectionOptions.' + paraDirection.toString();
    }
};

TEXT.collectTabs = function (obj, source) {
    // Tab Stops
    // -- Alignment
    // -- Alignment Character
    // -- Leader
    // -- Position
    var prefsOwner = TEXT.getPrefsOwner();
    var horizontalUnits = prefsOwner.viewPreferences.horizontalMeasurementUnits;

    obj.adbeTabStops = [];

    var tabStops = source.tabStops;
    var i, tabStop, tabStopObj, position;
    for (i = 0; i < tabStops.length; ++i) {
        tabStop = tabStops[i];

        tabStopObj = {};
        tabStopObj.adbeTabAlignment = 'TabStopAlignment.' + tabStop.alignment.toString();
        tabStopObj.adbeTabAlignmentChar = tabStop.alignmentCharacter;
        tabStopObj.adbeTabLeader = tabStop.leader;

        position = TEXT.convertUnitsToPoints(horizontalUnits, tabStop.position);
        tabStopObj.adbeTabPosition = {
            type: 'pt',
            value: position
        };
        obj.adbeTabStops.push(tabStopObj);
    }

    if (obj.adbeTabStops.length === 0) {
        delete obj.adbeTabStops;
    }
};

TEXT.collectHyphenationProperties = function (obj, source) {
    // Hyphenate
    // Words Longer Than (With at Least)
    // After First
    // Before Last
    // Hyphen Limit
    // Hyphenation Zone
    // Hyphen Weight
    // Hyphenate Capitalized Words
    var prefsOwner = TEXT.getPrefsOwner();

    var horizontalUnits = prefsOwner.viewPreferences.horizontalMeasurementUnits;

    obj.adbeHyphenation = source.hyphenation;
    if (obj.adbeHyphenation) {
        obj.adbeHyphenateWordsLongerThan = source.hyphenateWordsLongerThan;
        obj.adbeHyphenateAfterFirst = source.hyphenateAfterFirst;
        obj.adbeHyphenateBeforeLast = source.hyphenateBeforeLast;
        obj.adbeHyphenateLimit = source.hyphenateLadderLimit;

        var hyphenationZone = TEXT.convertUnitsToPoints(horizontalUnits, source.hyphenationZone);
        obj.adbeHyphenationZone = {
            type: 'pt',
            value: hyphenationZone
        };

        obj.adbeHyphenWeight = source.hyphenWeight * 10.0; //make it 0 to 100
        obj.adbeHyphenateCapitalizedWords = source.hyphenateCapitalizedWords;
    }
};

TEXT.fixupParagraphHyphenationSwitch = function (obj) {
    if (obj.adbeHyphenateWordsLongerThan !== undefined ||
            obj.adbeHyphenateAfterFirst !== undefined ||
            obj.adbeHyphenateBeforeLast !== undefined ||
            obj.adbeHyphenateLimit !== undefined ||
            obj.adbeHyphenationZone !== undefined ||
            obj.adbehyphenWeight !== undefined ||
            obj.adbeHyphenateCapitalizedWords !== undefined) {
        obj.adbeHyphenation = true;
    }
};

TEXT.collectJustificationProperties = function (obj, source) {
    // Minimumn Word Spacing
    // Desired Word Spacing
    // Maximum Word Spacing
    // Minimumn letter Spacing
    // Desired letter Spacing
    // Maximum letter Spacing
    // Minimumn Glyph Scaling
    // Desired Glyph Scaling
    // Maximum Glyph Scaling
    // Auto Leading
    // Single Word Justification
    obj.adbeMinimumWordSpacing = source.minimumWordSpacing;
    obj.adbeDesiredWordSpacing = source.desiredWordSpacing;
    obj.adbeMaximumWordSpacing = source.maximumWordSpacing;

    obj.adbeMinimumLetterSpacing = source.minimumLetterSpacing;
    obj.adbeDesiredLetterSpacing = source.desiredLetterSpacing;
    obj.adbeMaximumLetterSpacing = source.maximumLetterSpacing;

    obj.adbeMinimumGlyphScaling = source.minimumGlyphScaling;
    obj.adbeDesiredGlyphScaling = source.desiredGlyphScaling;
    obj.adbeMaximumGlyphScaling = source.maximumGlyphScaling;

    obj.adbeParaAutoLeading = source.autoLeading;
    obj.adbeSingleWordJustification = 'Justification.' + source.singleWordJustification.toString();
};

TEXT.collectJCompositionSettings = function (obj, source) {
    // Kinsoku Set
    // Kinsoku Type
    // Kinsoku Hang Type
    // Bunri-Kinshi
    // Mojikumi
    // Leading Model
    var kinsokuSet = source.kinsokuSet;
    if (kinsokuSet === KinsokuSet.NOTHING ||
            kinsokuSet === KinsokuSet.HARD_KINSOKU ||
            kinsokuSet === KinsokuSet.SOFT_KINSOKU) {
        obj.adbeKinsokuSet = 'KinsokuSet.' + kinsokuSet.toString();
    }

    var kinsokuType = source.kinsokuType;
    if (kinsokuType === KinsokuType.KINSOKU_PUSH_IN_FIRST ||
            kinsokuType === KinsokuType.KINSOKU_PUSH_OUT_FIRST ||
            kinsokuType === KinsokuType.KINSOKU_PUSH_OUT_ONLY) {
        obj.adbeKinsokuType = 'KinsokuType.' + kinsokuType.toString();
    }

    switch (source.kinsokuHangType.toString()) {
    case 'KINSOKU_HANG_FORCE':
        obj.adbeIlstBurasagariType = 'BurasagariTypeEnum.Forced';
        break;
    case 'KINSOKU_HANG_REGULAR':
        obj.adbeIlstBurasagariType = 'BurasagariTypeEnum.Standard';
        break;
    case 'NONE':
        obj.adbeIlstBurasagariType = 'BurasagariTypeEnum.None';
        break;
    }

    obj.adbeBunriKinshi = source.bunriKinshi;

    //TODO
    //obj.adbeMojikumi
    switch (source.mojikumi) {
    case MojikumiTableDefaults.LINE_END_ALL_ONE_HALF_EM_ENUM:
        obj.adbeIlstMojikumi = 'GyomatsuYakumonoHankaku';
        break;
    case MojikumiTableDefaults.LINE_END_ALL_ONE_EM_ENUM:
        obj.adbeIlstMojikumi = 'YakumonoZenkaku';
        break;
    case MojikumiTableDefaults.LINE_END_PERIOD_ONE_EM_ENUM:
        obj.adbeIlstMojikumi = 'GyomatsuYakumonoZenkaku';
        break;
    case MojikumiTableDefaults.NOTHING:
        obj.adbeIlstMojikumi = 'None';
        break;
    }

    //obj.adbeLeadingModel
};

TEXT.collectComposerSettings = function (obj, source) {
    if (source.composer !== undefined) {
        var composer = source.composer;
        if (composer === AppStrings.AdobeComposer_Paragraph) {
            obj.adbeIlstComposerEngine = 'ComposerType.Adobe';
            obj.adbeIlstEveryLineComposer = true;
        } else if (composer === AppStrings.AdobeComposer_SingleLine) {
            obj.adbeIlstComposerEngine = 'ComposerType.Adobe';
            obj.adbeIlstEveryLineComposer = false;
        } else if (composer === AppStrings.AdobeJapaneseComposer_Paragraph) {
            obj.adbeIlstComposerEngine = 'ComposerType.Japanese';
            obj.adbeIlstEveryLineComposer = true;
        } else if (composer === AppStrings.AdobeJapaneseComposer_SingleLine) {
            obj.adbeIlstComposerEngine = 'ComposerType.Japanese';
            obj.adbeIlstEveryLineComposer = false;
        } else if (composer === AppStrings.AdobeWorldReadyComposer_Paragraph) {
            obj.adbeIlstComposerEngine = 'ComposerType.WorldReady';
            obj.adbeIlstEveryLineComposer = true;
        } else if (composer === AppStrings.AdobeWorldReadyComposer_SingleLine) {
            obj.adbeIlstComposerEngine = 'ComposerType.WorldReady';
            obj.adbeIlstEveryLineComposer = false;
        }
    }
};

TEXT.applyIndentsSpacingAndDirection = function (target, style) {
    var properties = {};

    if (style.adbeIdsnParagraphDirection) {
        switch (style.adbeIdsnParagraphDirection) {
        case 'ParagraphDirectionOptions.LEFT_TO_RIGHT_DIRECTION':
            properties.paragraphDirection = ParagraphDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
            break;
        case 'ParagraphDirectionOptions.RIGHT_TO_LEFT_DIRECTION':
            properties.paragraphDirection = ParagraphDirectionOptions.RIGHT_TO_LEFT_DIRECTION;
            break;
        }
    }
    // Alignment
    if (style.adbeParaAlignment) {
        switch (style.adbeParaAlignment) {
        case 'Alignment.LEFT_ALIGN':
            properties.justification = Justification.LEFT_ALIGN;
            break;
        case 'Alignment.CENTER_ALIGN':
            properties.justification = Justification.CENTER_ALIGN;
            break;
        case 'Alignment.RIGHT_ALIGN':
            properties.justification = Justification.RIGHT_ALIGN;
            break;
        case 'Alignment.LEFT_JUSTIFIED':
            properties.justification = Justification.LEFT_JUSTIFIED;
            break;
        case 'Alignment.CENTER_JUSTIFIED':
            properties.justification = Justification.CENTER_JUSTIFIED;
            break;
        case 'Alignment.RIGHT_JUSTIFIED':
            properties.justification = Justification.RIGHT_JUSTIFIED;
            break;
        case 'Alignment.FULLY_JUSTIFIED':
            properties.justification = Justification.FULLY_JUSTIFIED;
            break;
        }
    }

    if (style.adbeLeftIndent) {
        var leftIndent = new UnitValue(style.adbeLeftIndent.value, style.adbeLeftIndent.type);
        properties.leftIndent = leftIndent.as('pt') + ' pt';
    }

    if (style.adbeFirstLineIndent) {
        var firstLineIndent = new UnitValue(style.adbeFirstLineIndent.value, style.adbeFirstLineIndent.type);
        properties.firstLineIndent = firstLineIndent.as('pt') + ' pt';
    }

    if (style.adbeRightIndent) {
        var rightIndent = new UnitValue(style.adbeRightIndent.value, style.adbeRightIndent.type);
        properties.rightIndent = rightIndent.as('pt') + ' pt';
    }

    if (style.adbeSpaceBefore) {
        var spaceBefore = new UnitValue(style.adbeSpaceBefore.value, style.adbeSpaceBefore.type);
        properties.spaceBefore = spaceBefore.as('pt') + ' pt';
    }

    if (style.adbeSpaceAfter) {
        var spaceAfter = new UnitValue(style.adbeSpaceAfter.value, style.adbeSpaceAfter.type);
        properties.spaceAfter = spaceAfter.as('pt') + ' pt';
    }

    target.properties = properties;
};

TEXT.applyTabs = function (target, style) {
    if (style.adbeTabStops) {
        var i, tabStop, properties, position;
        for (i = 0; i < style.adbeTabStops.length; ++i) {
            tabStop = style.adbeTabStops[i];

            properties = {};
            if (tabStop.adbeTabAlignment) {
                switch (tabStop.adbeTabAlignment) {
                case 'TabStopAlignment.LEFT_ALIGN':
                    properties.alignment = TabStopAlignment.LEFT_ALIGN;
                    break;
                case 'TabStopAlignment.CENTER_ALIGN':
                    properties.alignment = TabStopAlignment.CENTER_ALIGN;
                    break;
                case 'TabStopAlignment.RIGHT_ALIGN':
                    properties.alignment = TabStopAlignment.RIGHT_ALIGN;
                    break;
                case 'TabStopAlignment.CHARACTER_ALIGN':
                    properties.alignment = TabStopAlignment.CHARACTER_ALIGN;
                    break;
                }
            }

            if (tabStop.adbeTabAlignmentChar !== undefined) {
                properties.alignmentCharacter = tabStop.adbeTabAlignmentChar;
            }
            if (tabStop.adbeTabLeader !== undefined) {
                properties.leader = tabStop.adbeTabLeader;
            }
            if (tabStop.adbeTabPosition !== undefined) {
                position = new UnitValue(tabStop.adbeTabPosition.value, tabStop.adbeTabPosition.type);
                properties.position = position.as('pt') + ' pt';
            }

            target.tabStops.add(properties);
        }
    }
};

TEXT.applyHyphenationProperties = function (target, style) {
    if (style.adbeHyphenation === true) {
        var properties = {};
        properties.hyphenation = true;

        if (style.adbeHyphenateWordsLongerThan !== undefined) {
            properties.hyphenateWordsLongerThan = style.adbeHyphenateWordsLongerThan;
        }
        if (style.adbeHyphenateAfterFirst !== undefined) {
            properties.hyphenateAfterFirst = style.adbeHyphenateAfterFirst;
        }
        if (style.adbeHyphenateBeforeLast !== undefined) {
            properties.hyphenateBeforeLast = style.adbeHyphenateBeforeLast;
        }
        if (style.adbeHyphenateLimit !== undefined) {
            properties.hyphenateLadderLimit = style.adbeHyphenateLimit;
        }
        if (style.adbeHyphenationZone) {
            var hyphenationZone = new UnitValue(style.adbeHyphenationZone.value, style.adbeHyphenationZone.type);
            properties.hyphenationZone = hyphenationZone.as('pt') + ' pt';
        }
        if (style.adbeHyphenWeight !== undefined) {
            properties.hyphenWeight = Math.round(style.adbeHyphenWeight / 10.0);
        }
        if (style.adbeHyphenateCapitalizedWords !== undefined) {
            properties.hyphenateCapitalizedWords = style.adbeHyphenateCapitalizedWords;
        }

        target.properties = properties;

    } else if (style.adbeHyphenation === false) {
        target.hyphenation = false;
    }
};

TEXT.applyJustificationProperties = function (target, style) {
    var properties = {};

    if (style.adbeMinimumWordSpacing !== undefined) {
        properties.minimumWordSpacing = style.adbeMinimumWordSpacing;
    }
    if (style.adbeDesiredWordSpacing !== undefined) {
        properties.desiredWordSpacing = style.adbeDesiredWordSpacing;
    }
    if (style.adbeMaximumWordSpacing !== undefined) {
        properties.maximumWordSpacing = style.adbeMaximumWordSpacing;
    }
    if (style.adbeMinimumLetterSpacing !== undefined) {
        properties.minimumLetterSpacing = style.adbeMinimumLetterSpacing;
    }
    if (style.adbeDesiredLetterSpacing !== undefined) {
        properties.desiredLetterSpacing = style.adbeDesiredLetterSpacing;
    }
    if (style.adbeMaximumLetterSpacing !== undefined) {
        properties.maximumLetterSpacing = style.adbeMaximumLetterSpacing;
    }
    if (style.adbeMinimumGlyphScaling !== undefined) {
        properties.minimumGlyphScaling = style.adbeMinimumGlyphScaling;
    }
    if (style.adbeDesiredGlyphScaling !== undefined) {
        properties.desiredGlyphScaling = style.adbeDesiredGlyphScaling;
    }
    if (style.adbeMaximumGlyphScaling !== undefined) {
        properties.maximumGlyphScaling = style.adbeMaximumGlyphScaling;
    }
    if (style.adbeParaAutoLeading !== undefined) {
        properties.autoLeading = style.adbeParaAutoLeading;
    }
    if (style.adbeSingleWordJustification !== undefined) {
        switch (style.adbeSingleWordJustification) {
        case 'Justification.FULLY_JUSTIFIED':
            properties.singleWordJustification = SingleWordJustification.FULLY_JUSTIFIED;
            break;
        case 'Justification.LEFT_ALIGN':
            properties.singleWordJustification = SingleWordJustification.LEFT_ALIGN;
            break;
        case 'Justification.CENTER_ALIGN':
            properties.singleWordJustification = SingleWordJustification.CENTER_ALIGN;
            break;
        case 'Justification.RIGHT_ALIGN':
            properties.singleWordJustification = SingleWordJustification.RIGHT_ALIGN;
            break;
        }
    }

    target.properties = properties;
};

TEXT.applyJCompositionSettings = function (target, style) {
    var properties = {};

    if (style.adbeKinsokuSet) {
        switch (style.adbeKinsokuSet) {
        case 'KinsokuSet.NOTHING':
            properties.kinsokuSet = KinsokuSet.NOTHING;
            break;
        case 'KinsokuSet.HARD_KINSOKU':
            properties.kinsokuSet = KinsokuSet.HARD_KINSOKU;
            break;
        case 'KinsokuSet.SOFT_KINSOKU':
            properties.kinsokuSet = KinsokuSet.SOFT_KINSOKU;
            break;
        }
    }

    if (style.adbeKinsokuType) {
        switch (style.adbeKinsokuType) {
        case 'KinsokuType.KINSOKU_PUSH_IN_FIRST':
            properties.kinsokuType = KinsokuType.KINSOKU_PUSH_IN_FIRST;
            break;
        case 'KinsokuType.KINSOKU_PUSH_OUT_FIRST':
            properties.kinsokuType = KinsokuType.KINSOKU_PUSH_OUT_FIRST;
            break;
        case 'KinsokuType.KINSOKU_PUSH_OUT_ONLY':
            properties.kinsokuType = KinsokuType.KINSOKU_PUSH_OUT_ONLY;
            break;
        }
    }

    if (style.adbeIlstBurasagariType) {
        switch (style.adbeIlstBurasagariType) {
        case 'BurasagariTypeEnum.None':
            properties.kinsokuHangType = KinsokuHangTypes.NONE;
            break;
        case 'BurasagariTypeEnum.Standard':
            properties.kinsokuHangType = KinsokuHangTypes.KINSOKU_HANG_REGULAR;
            break;
        case 'BurasagariTypeEnum.Forced':
            properties.kinsokuHangType = KinsokuHangTypes.KINSOKU_HANG_FORCE;
            break;
        }
    }

    if (style.adbeBunriKinshi !== undefined) {
        properties.bunriKinshi = style.adbeBunriKinshi;
    }

    if (style.adbeIlstMojikumi) {
        switch (style.adbeIlstMojikumi) {
        case 'GyomatsuYakumonoHankaku':
            properties.mojikumi = MojikumiTableDefaults.LINE_END_ALL_ONE_HALF_EM_ENUM;
            break;
        case 'YakumonoZenkaku':
            properties.mojikumi = MojikumiTableDefaults.LINE_END_ALL_ONE_EM_ENUM;
            break;
        case 'GyomatsuYakumonoZenkaku':
            properties.mojikumi = MojikumiTableDefaults.LINE_END_PERIOD_ONE_EM_ENUM;
            break;
        case 'None':
            properties.mojikumi = MojikumiTableDefaults.NOTHING;
            break;
        }
    }
    //properties.adbeLeadingModel

    target.properties = properties;
};

TEXT.applyComposerSettings = function (target, style) {
    var properties = {};

    if (style.adbeIlstComposerEngine) {
        var composer = style.adbeIlstComposerEngine;
        var isEveryLine = style.adbeIlstEveryLineComposer;
        if (composer === 'ComposerType.Adobe') {
            if (isEveryLine) {
                properties.composer = AppStrings.AdobeComposer_Paragraph;
            } else {
                properties.composer = AppStrings.AdobeComposer_SingleLine;
            }
        } else if (composer === 'ComposerType.Japanese') {
            if (isEveryLine) {
                properties.composer = AppStrings.AdobeJapaneseComposer_Paragraph;
            } else {
                properties.composer = AppStrings.AdobeJapaneseComposer_SingleLine;
            }
        } else if (composer === 'ComposerType.WorldReady') {
            if (isEveryLine) {
                properties.composer = AppStrings.AdobeWorldReadyComposer_Paragraph;
            } else {
                properties.composer = AppStrings.AdobeWorldReadyComposer_SingleLine;
            }
        }
    }
    target.properties = properties;
};

TEXT.getTextStylePreviewColorFromText = function (text, isCharStyle) {

    //Use RGB black for text color
    var textColorValues = [0, 0, 0];
    var fontFamily;
    if (isCharStyle) {
        fontFamily = (text.appliedFont.__class__ === 'String') ? text.appliedFont : text.appliedFont.fontFamily;
        var appliedParaStyle = text.appliedParagraphStyle;
        var paraStyleFontFamily = (appliedParaStyle.appliedFont.__class__ === 'String') ? appliedParaStyle.appliedFont : appliedParaStyle.appliedFont.fontFamily;

        if (fontFamily === paraStyleFontFamily) {
            //If character style is defining a font family, the style does have font defined.
            var appliedCharStyle = text.appliedCharacterStyle;
            if (appliedCharStyle.appliedFont === NothingEnum.NOTHING || appliedCharStyle.appliedFont === '') {
                textColorValues = [128, 128, 128];
            }
        }
    } else {
        //If the applied font family is different from [No paragraph style], text has font defined through styles/overrides etc.
        fontFamily = (text.appliedFont.__class__ === 'String') ? text.appliedFont : text.appliedFont.fontFamily;
        var rootParaStyle = app.paragraphStyles.itemByName(AppStrings.NoParagraphStyle);
        var baseFontFamily = rootParaStyle.appliedFont.fontFamily;

        if (fontFamily === baseFontFamily) {
            textColorValues = [128, 128, 128];
        }
    }
    return textColorValues;
};

TEXT.getTextStylePreviewColorFromStyleObject = function (styleObj) {
    //Use RGB black for text color
    var textColorValues = [0, 0, 0];

    if (!styleObj.styleInfo.adbeFont && !styleObj.styleInfo.fontFamily) {
        // If the style does not have font information, use gray color for the text.
        textColorValues = [128, 128, 128];
    }
    return textColorValues;
};

TEXT.getTypeStyleWithOverridesInfoObject = function (text, isCharStyle) {
    var styleObj = {};

    var previewBasePath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer;
    var previewPath = previewBasePath + '.png';

    //Generate style preview
    var textColorSpace = ColorSpace.RGB;
    var textColorValues = TEXT.getTextStylePreviewColorFromText(text, isCharStyle);

    var styleType = isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE;
    text.createStyleThumbnailWithProperties(JSXGlobals.textPreviewString, JSXGlobals.textPreviewFontSize, textColorSpace, textColorValues, new File(previewPath), styleType);

    styleObj.previewPath = previewPath;
    styleObj.idmsPath = previewBasePath + '.idms';

    //Since the style is deleted as soon as we are done with snippet and thumbnail, we need to place the newly created snippet
    //in a headless document so that we can get the style object JSON from that.
    var tempDoc = TEXT.createHeadlessDocument();

    //Remove all type style in the headless document.
    //This ensures that the new snippet placement in headless document does not cause any style conflicts.
    TEXT.removeAllTypeStyles(tempDoc);

    //Get the applied style.
    var pageItems = tempDoc.pages[0].place(styleObj.idmsPath, [0, 0], undefined, false, true);
    if (pageItems.length !== 1) {
        TEXT.closeHeadlessDocument(tempDoc);
        return;
    }

    var newText = pageItems[0].texts[0];
    var typeStyle = isCharStyle ? newText.appliedCharacterStyle : newText.appliedParagraphStyle;

    styleObj.styleName = typeStyle.name;
    if (isCharStyle) {
        styleObj.styleInfo = TEXT.getCharacterStyleObject(typeStyle);
    } else {
        styleObj.styleInfo = TEXT.getParagraphStyleObject(typeStyle);
    }

    TEXT.closeHeadlessDocument(tempDoc);
    //if you want to see what's going back, uncomment the line below
    //alert(JSON.stringify(styleObj));

    return styleObj;
};

TEXT.getTypeStyleInfoObject = function (typeStyle) {
    if (!typeStyle) {
        return; //undefined
    }

    var styleObj = {};

    styleObj.styleName = typeStyle.name;

    if (typeStyle.__class__ === 'CharacterStyle') {
        styleObj.styleInfo = TEXT.getCharacterStyleObject(typeStyle);
    } else {
        styleObj.styleInfo = TEXT.getParagraphStyleObject(typeStyle);
    }

    //Generate style preview
    var textColorSpace = ColorSpace.RGB;
    var textColorValues = TEXT.getTextStylePreviewColorFromStyleObject(styleObj);

    var previewBasePath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer;
    var previewPath = previewBasePath + '.png';
    typeStyle.createThumbnailWithProperties(JSXGlobals.textPreviewString, JSXGlobals.textPreviewFontSize, textColorSpace, textColorValues, new File(previewPath));

    styleObj.previewPath = previewPath;
    styleObj.idmsPath = previewBasePath + '.idms';

    //if you want to see what's going back, uncomment the line below
    //alert(JSON.stringify(styleObj));

    return styleObj;
};

//getStyleFullyQualifiedName retrieves the full style name, combining
//the name of the style and parent groups together separated by nul.
TEXT.getStyleFullyQualifiedName = function (object, userVisible) {
    var objectName = object.name;

    var separator;
    if (userVisible) {
        separator = '_';
    } else {
        separator = '\u0000';
    }

    if (object.parent.__class__ !== 'Application' && object.parent.__class__ !== 'Document') {
        return TEXT.getStyleFullyQualifiedName(object.parent) + separator + objectName;
    }

    return objectName;
};

TEXT.getStyleByFullyQualifiedName = function (styleFQN, isCharStyle, stylesOwner) {
    var object = stylesOwner;
    var tmp = styleFQN.split('\u0000');

    var i;
    for (i = 0; i < (tmp.length - 1); ++i) {
        if (object.isValid) {
            if (isCharStyle) {
                object = object.characterStyleGroups.itemByName(tmp[i]);
            } else {
                object = object.paragraphStyleGroups.itemByName(tmp[i]);
            }
        } else {
            break;
        }
    }

    if (object.isValid) {
        if (isCharStyle) {
            object = object.characterStyles.itemByName(tmp[tmp.length - 1]);
        } else {
            object = object.paragraphStyles.itemByName(tmp[tmp.length - 1]);
        }

        if (object.isValid) {
            return object;
        }
    }

    return; //undefined
};

TEXT.getTypeStyleInfoByID = function (documentID, styleID, isCharStyle) {
    var stylesOwner = app;
    var typeStyle;

    if (documentID !== -1) {
        stylesOwner = app.documents.itemByID(documentID);
        if (isCharStyle) {
            typeStyle = stylesOwner.characterStyles.itemByID(styleID);
        } else {
            typeStyle = stylesOwner.paragraphStyles.itemByID(styleID);
        }
    } else {
        stylesOwner = TEXT.createHeadlessDocument();
        var styleName;
        if (isCharStyle) {
            styleName = TEXT.getStyleFullyQualifiedName(app.characterStyles.itemByID(styleID));
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, true, stylesOwner);
        } else {
            styleName = TEXT.getStyleFullyQualifiedName(app.paragraphStyles.itemByID(styleID));
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, false, stylesOwner);
        }
    }

    var styleObj = TEXT.getTypeStyleInfoObject(typeStyle);

    if (documentID === -1) {
        stylesOwner.close();
    }

    return styleObj;
};

TEXT.getTypeStyleInfo = function (isCharStyle) {
    var appSelection = app.selection;
    if (appSelection.length === 0) {
        return; //undefined
    }

    var selection = appSelection[0];
    if (selection.__class__ === 'TextFrame' || selection.__class__ === 'Cell') {
        selection = selection.texts[0];
    }

    var styleType = isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE;
    var styleObj; //undefined

    if (selection.textHasOverrides(styleType)) {
        styleObj = TEXT.getTypeStyleWithOverridesInfoObject(selection, isCharStyle);
    } else {
        var typeStyle;
        if (isCharStyle) {
            typeStyle = selection.appliedCharacterStyle;
        } else {
            typeStyle = selection.appliedParagraphStyle;
        }
        styleObj = TEXT.getTypeStyleInfoObject(typeStyle);
    }
    return styleObj;
};

TEXT.addFilesForText = function (textObj, doc, textFrame, origTextFrame) {
    //Export snippet and png and save.
    var basePath = Folder.temp.fsName + '/TextPreview' + $.hiresTimer;
    var pngPath = basePath + '.png';
    var idmsPath = basePath + '.idms';

    var tempObj = {
        filePath: idmsPath,
        outputFormats: ['snippet', 'png'],
        documentID: doc.id,
        itemIDList: [textFrame.id]
    };

    if (origTextFrame !== undefined) {
        var origDocument;
        origDocument = origTextFrame.parent;
        while (origDocument.__class__ !== 'Document') {
            origDocument = origDocument.parent;
        }
        tempObj.origDocumentID = origDocument.id;
        tempObj.originalFrameId = origTextFrame.id;
        tempObj.keepTextOrientation = true;
    }

    doc.exportForCloudLibrary(JSON.stringify(tempObj));

    var idmsFile = new File(idmsPath);
    if (idmsFile.exists) {
        textObj.primaryRepresentation = {};
        textObj.primaryRepresentation.filePath = idmsPath;
        textObj.primaryRepresentation.isFile = true;
        textObj.primaryRepresentation.representationType = 'application/vnd.adobe.indesign-idms-text';
    }

    var pngFile = new File(pngPath);
    if (pngFile.exists) {
        textObj.previewPath = pngPath;
    }
};

TEXT.addTextData = function (textObj, textFrame) {

    //cleanup text frame.
    textFrame.convertToRawText();

    textObj.textInfo = {};
    textObj.textInfo.paragraphs = [];                   //carries text and the runs.
    textObj.textInfo.styles = {};                       //carries the style definitions.

    textObj.textInfo.adbeIdsnTextDirection = app.activeDocument.getSelectedTextDirection().toString();

    //capture text content.
    var paragraphs = textFrame.parentStory.texts[0].paragraphs;
    var paragraph, paragraphsLen = paragraphs.length, paraItr = 0;
    var paraText, paraObject;
    var style, styleId;
    var styleObj = {};
    var hasCharOverride = false;
    var stylesMap = textObj.textInfo.styles;
    var charOverrides, paraOverrides;
    var paraOverrideItr = 0, charOverrideItr = 0, runIndex = -1;
    var range, rangeItr = 0, rangesLen, paraBeginIndex;

    for (paraItr = 0; paraItr < paragraphsLen; paraItr++) {
        paragraph = paragraphs[paraItr];
        paraObject = {};
        styleObj = {};
        paraText = paragraph.contents;
        if (paraText.charCodeAt(paraText.length - 1) === 0x000D) {
            paraText = paraText.slice(0, -1);
        }
        paraObject.text = paraText;
        paraObject.styles = [];

        //Capture style
        style = paragraph.appliedParagraphStyle;
        styleId = style.id;
        paraObject.styles.push(styleId);

        //check if style has already been picked.
        if (!stylesMap.hasOwnProperty(styleId)) {
            styleObj.value = TEXT.getParagraphStyleObjectInner(style, true);
            styleObj.name = TEXT.getStyleFullyQualifiedName(style, true);
            styleObj.type = PARASTYLE_REPRESENTATION_JSON_TYPE;
            stylesMap[styleId] = styleObj;
        }

        paraObject.runs = [];
        hasCharOverride = false;
        rangesLen = paragraph.textStyleRanges.length;
        paraBeginIndex = paragraph.index;

        for (rangeItr = 0; rangeItr < rangesLen; rangeItr++) {
            range = paragraph.textStyleRanges[rangeItr];
            hasCharOverride = false;
            style = range.appliedCharacterStyle;
            styleId = style.id;

            if (style.name !== AppStrings.NoneCharacterStyle) {
                runIndex = paraObject.runs.push({}) - 1;
                paraObject.runs[runIndex].from = range.index - paraBeginIndex;
                paraObject.runs[runIndex].to = range.index + range.length - paraBeginIndex;
                paraObject.runs[runIndex].styles = [];
                paraObject.runs[runIndex].styles.push(styleId);

                //check if style has already been picked.
                if (!stylesMap.hasOwnProperty(styleId)) {
                    styleObj = {};
                    styleObj.value = TEXT.getCharacterStyleObject(style);
                    if (!TEXT.isEmptyObject(styleObj.value)) {
                        styleObj.name = TEXT.getStyleFullyQualifiedName(style, true);
                        styleObj.type = CHARSTYLE_REPRESENTATION_JSON_TYPE;
                        stylesMap[styleId] = styleObj;
                    }
                }
            }

            if (range.textHasOverrides(StyleType.CHARACTER_STYLE_TYPE)) {
                charOverrides = TEXT.getCharacterStyleObjectInner(range);
                TEXT.removeCommonAttributes(charOverrides, stylesMap[paraObject.styles[0]].value);
                if (stylesMap[styleId]) {
                    TEXT.removeCommonAttributes(charOverrides, stylesMap[styleId].value);
                }
                if (!TEXT.isEmptyObject(charOverrides)) {
                    hasCharOverride = true;
                }
            }

            if (rangeItr === 0 && range.textHasOverrides(StyleType.PARAGRAPH_STYLE_TYPE, false)) {
                //only check for the first range for the para overrides.

                paraOverrides = {};

                //copy parastyle attributes.
                paraOverrides = TEXT.getParagraphStyleObjectInner(range, true);

                //remove char style attribute
                if (stylesMap[styleId]) {
                    TEXT.removeCommonAttributes(paraOverrides, stylesMap[styleId].value);
                }

                //get actual attributes here.
                TEXT.removeCommonAttributes(paraOverrides, stylesMap[paraObject.styles[0]].value);

                //Special Handling for paragraphDirection and alignment.
                if (paraOverrides.hasOwnProperty('adbeParaAlignment') && !paraOverrides.hasOwnProperty('adbeIdsnParagraphDirection')) {
                    paraOverrides.adbeIdsnParagraphDirection = stylesMap[paraObject.styles[0]].value.adbeIdsnParagraphDirection;
                } else if (!paraOverrides.hasOwnProperty('adbeParaAlignment') && paraOverrides.hasOwnProperty('adbeIdsnParagraphDirection')) {
                    paraOverrides.adbeParaAlignment = stylesMap[paraObject.styles[0]].value.adbeParaAlignment;
                }

                if (hasCharOverride) {
                    //remove the char style overrides created above.
                    TEXT.removeCommonAttributes(paraOverrides, charOverrides);
                }

                //append paraoverrides.
                if (!TEXT.isEmptyObject(paraOverrides)) {
                    styleId = 'ParaOverrides' + paraOverrideItr++;
                    paraObject.styles.push(styleId);
                    stylesMap[styleId] = {};
                    stylesMap[styleId].value = paraOverrides;
                    stylesMap[styleId].type = PARASTYLE_REPRESENTATION_JSON_TYPE;
                }
            }

            //append charOverrides.
            if (hasCharOverride) {
                styleId = 'CharOverrides' + charOverrideItr++;
                styleObj = {};
                styleObj.value = charOverrides;

                styleObj.type = CHARSTYLE_REPRESENTATION_JSON_TYPE;
                stylesMap[styleId] = styleObj;

                runIndex = paraObject.runs.push({}) - 1;
                paraObject.runs[runIndex].from = range.index - paraBeginIndex;
                paraObject.runs[runIndex].to = range.index + range.length - paraBeginIndex;
                paraObject.runs[runIndex].styles = [];
                paraObject.runs[runIndex].styles.push(styleId);
            }
        }
        textObj.textInfo.paragraphs.push(paraObject);
    }
};

TEXT.captureText = function (text) {
    var tempDoc;
    try {
        var textFrame, origTextFrame;
        if (text.__class__ === 'TextFrame') {
            origTextFrame = text;
            // Check if more than one text frame are present for the current story.
            if (origTextFrame.nextTextFrame !== null || origTextFrame.previousTextFrame !== null) {
                // It is a threaded text frame.
                var decision = app.getUserChoiceForCloudTextAddition();
                if (decision === false) {
                    // User cancelled the action.
                    return;
                }
                if (decision === ThreadedTextFrameTextOptions.TEXT_WITHIN_TEXTFRAME) {
                    text = text.texts[0];
                } else {
                    text = text.parentStory.texts[0];
                }
            } else {
                // Single text frame.
                text = text.parentStory.texts[0];
            }
        } else if (text.__class__ === 'Cell') {
            text = text.texts[0];
        } else if (text.__class__ === 'InsertionPoint') {
            text = text.parentStory.texts[0];
            origTextFrame = text.parentTextFrames[0];
        } else {
            origTextFrame = text.parentTextFrames[0];
        }

        tempDoc = TEXT.createHeadlessDocument();
        TEXT.removeAllTypeStyles(tempDoc);

        textFrame = tempDoc.textFrames.add();
        var measurementUnit = app.scriptPreferences.measurementUnit;
        app.scriptPreferences.measurementUnit = MeasurementUnits.POINTS;
        textFrame.geometricBounds = [0, 0, 120, 160];
        app.scriptPreferences.measurementUnit = measurementUnit;
        var previousPreference = app.scriptPreferences.userInteractionLevel;
        app.scriptPreferences.userInteractionLevel = UserInteractionLevels.neverInteract;
        text.duplicate(LocationOptions.AFTER, textFrame.texts[0]);
        app.scriptPreferences.userInteractionLevel = previousPreference;
        if (textFrame.contents === '') {
            if (origTextFrame) {
                textFrame.geometricBounds = origTextFrame.geometricBounds;
            }
        }
        var textObj = {};

        // Add snippet and PNG file for text representation.
        TEXT.addFilesForText(textObj, tempDoc, textFrame, origTextFrame);

        // Add JSON data.
        TEXT.addTextData(textObj, textFrame);

        TEXT.closeHeadlessDocument(tempDoc);
        return textObj;
    } catch (err) {
        //alert(err);
        if (tempDoc) {
            TEXT.closeHeadlessDocument(tempDoc);
        }
    }
};

TEXT.getTextInfo = function () {
    var appSelection = app.selection;
    if (appSelection.length === 0) {
        return; //undefined
    }

    var selection = appSelection[0];
    if (selection.__class__ === 'Cell') {
        selection = selection.texts[0];
    }

    var textObj = TEXT.captureText(selection);
    return textObj;
};

TEXT.getTextInfoFromDocument = function (path) {
    var tempDoc;
    try {
        tempDoc = app.open(new File(path), false, OpenOptions.OPEN_COPY);
        var textFrame = tempDoc.spreads[0].textFrames[0];

        if (textFrame === undefined || textFrame.__class__ !== 'TextFrame') {
            tempDoc.close(SaveOptions.NO);
            return;
        }

        var textObj = {};
        TEXT.addTextData(textObj, textFrame);
        tempDoc.close(SaveOptions.NO);
        return textObj;
    } catch (err) {
        if (tempDoc) {
            tempDoc.close(SaveOptions.NO);
        }
    }
};

TEXT.getTextInfoFromSnippet = function (path) {
    var tempDoc;
    try {
        tempDoc = TEXT.createHeadlessDocument();
        TEXT.removeAllTypeStyles(tempDoc);

        //place snippet here.
        var pageItems = tempDoc.pages[0].place(path, [0, 0], undefined, false, true);

        if (pageItems.length !== 1) {
            TEXT.closeHeadlessDocument(tempDoc);
            return;
        }

        //Get hold of text frame.
        var textFrame = pageItems[0];
        var textObj = {};

        TEXT.addTextData(textObj, textFrame);
        TEXT.closeHeadlessDocument(tempDoc);
        return textObj;
    } catch (err) {
        if (tempDoc) {
            TEXT.closeHeadlessDocument(tempDoc);
        }
    }
};

TEXT.placeTextInCurrentDocument = function (elementRef, idmsPath, isLinked, withStyles, isVertical) {
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

        var obj = {};
        obj.elementRef = elementRef;
        obj.isLinkedAsset = isLinked;
        obj.snippetPath = idmsPath;
        obj.withStyles = withStyles;
        obj.isVertical = isVertical;

        var args = JSON.stringify(obj);
        doc.placeCloudAsset(args);
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-placeTextInCurrentDocument()', ex);
    }
};

TEXT.placeText = function (textData, elementRef, linked, withStyles, inline) {
    var placeTextInternal = function () {
        var idmsPath = textData.idmsPath;
        if (idmsPath && withStyles) {
            // ensure that the font is available.
            var numFontsUsed = textData.fonts.length, i = 0;
            for (i = 0; i < numFontsUsed; i++) {
                //create the font if it does not exist.
                TEXT.dataToFont(textData.fonts[i].adbeFont, textData.fonts[i].fontFamily, true);
            }
        }
        if (inline) {
            var text = app.selection[0].texts[0];
            var tempDoc = TEXT.createHeadlessDocument();
            TEXT.removeAllTypeStyles(tempDoc);
            var textFrame;
            if (!idmsPath) {
                //JSON
                textFrame = tempDoc.textFrames.add();
                TEXT.setTextFromJSON(textData, withStyles, textFrame);
            } else {
                //snippet case
                var pageItems = tempDoc.pages[0].place(idmsPath, [0, 0], undefined, false, true);

                if (pageItems.length !== 1) {
                    TEXT.closeHeadlessDocument(tempDoc);
                    return;
                }

                //Get hold of text frame.
                textFrame = pageItems[0];
            }

            //clear text content in selection.
            text.contents = '';
            //need to copy text frame's content in current location.
            textFrame.parentStory.texts[0].move(LocationOptions.AFTER, text);
            TEXT.closeHeadlessDocument(tempDoc);
        } else {
            if (!idmsPath) {
                idmsPath = TEXT.getSnippetForText(textData, withStyles);
            }
            var isVertical = textData.adbeIdsnTextDirection === 'VERTICAL_TYPE';
            TEXT.placeTextInCurrentDocument(elementRef, idmsPath, linked, withStyles, isVertical);
        }
    };

    //Just to remove JSLint error for unused placeTextInternal
    if (app.doScript === undefined) {
        placeTextInternal();
    }
    try {
        if (inline) {
            app.doScript(
                'placeTextInternal();',
                undefined,
                undefined,
                UndoModes.entireScript,
                '$ID/Insert Text'
            );
        } else {
            app.doScript(
                'placeTextInternal();',
                undefined,
                undefined,
                UndoModes.entireScript,
                '$ID/Import'
            );
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-placeText()', ex);
    }
};

TEXT.createStyles = function (textData, document, styleMap) {
    try {
        var styles = textData.styles;
        var newTypeStyle, styleObj, isCharStyle, styleName;
        styleMap.overrides = [];
        var tempName = 'Overrides ' + $.hiresTimer;
        var overridesCounter = 0;
        var key;
        for (key in styles) {
            if (styles.hasOwnProperty(key)) {
                styleObj = styles[key];
                isCharStyle = styleObj.type === CHARSTYLE_REPRESENTATION_JSON_TYPE;
                styleName = styleObj.name;

                if (styleName) {
                    if (isCharStyle) {
                        newTypeStyle = TEXT.createCharacterStyle(styleObj.value, document);
                    } else {
                        newTypeStyle = TEXT.createParagraphStyle(styleObj.value, document);
                    }

                    //Remove brackets from the start and end.
                    while (styleName.charAt(0) === '[') {
                        styleName = styleName.substr(1);
                    }
                    while (styleName.charAt(styleName.length - 1) === ']') {
                        styleName = styleName.slice(0, -1);
                    }
                    newTypeStyle.name = styleName;
                } else {
                    if (isCharStyle) {
                        newTypeStyle = document.characterStyles.add();
                    } else {
                        newTypeStyle = document.paragraphStyles.add();
                    }
                    newTypeStyle.name = tempName + overridesCounter;
                    overridesCounter++;
                    styleMap.overrides.push(newTypeStyle);
                }
                styleMap[key] = newTypeStyle;
            }
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-createStyles()', ex);
    }
};

TEXT.applyStylesOnParagraph = function (document, paragraph, paraJSONObject, styles, styleMap) {
    try {
        var paraBeginIndex = paragraph.index;
        var styleIndex, numStyles, style, styleObj, isCharStyle;
        if (paraJSONObject.styles) {
            numStyles = paraJSONObject.styles.length;
            for (styleIndex = 0; styleIndex < numStyles; styleIndex++) {
                style = styleMap[paraJSONObject.styles[styleIndex]];
                if (style) {
                    styleObj = styles[paraJSONObject.styles[styleIndex]];
                    if (!styleObj.name) {
                        // override to be applied.
                        isCharStyle = styleObj.type === CHARSTYLE_REPRESENTATION_JSON_TYPE;
                        if (isCharStyle) {
                            TEXT.applyCharacterStyleProperties(paragraph, styleObj.value);
                        } else {
                            TEXT.applyParagraphStyleProperties(paragraph, styleObj.value);
                        }
                    } else {
                        if (style.__class__ === 'CharacterStyle') {
                            paragraph.appliedCharacterStyle = style;
                        } else {
                            paragraph.appliedParagraphStyle = style;
                        }
                    }
                }
            }
        }

        if (paraJSONObject.runs) {
            var runIndex, run, runTo;
            var range, rangeItr = 0;
            var namedCharStyleApplied = false;
            var dummyCharStyleApplied = false;
            var runLength = paraJSONObject.runs.length;
            var previousStyle, dummyCharStyle;
            for (runIndex = 0; runIndex < runLength; runIndex++) {
                run = paraJSONObject.runs[runIndex];
                numStyles = run.styles.length;
                namedCharStyleApplied = false;
                dummyCharStyleApplied = false;
                for (styleIndex = 0; styleIndex < numStyles; styleIndex++) {
                    style = styleMap[run.styles[styleIndex]];
                    if (style) {
                        styleObj = styles[run.styles[styleIndex]];

                        if (!styleObj.name) {
                            // override to be applied.
                            isCharStyle = styleObj.type === CHARSTYLE_REPRESENTATION_JSON_TYPE;
                            if (isCharStyle) {
                                runTo = run.to - 1;
                                if (runTo > paragraph.characters.length - 1) {
                                    runTo = paragraph.characters.length - 1;
                                }

                                if (namedCharStyleApplied === false) {
                                    //As no named char style has been applied the range is not defined as per the defined run.
                                    //Hence we need to create a range appropriate to the run. This is done by applying a temporary
                                    //character style. This style is removed after the overrides are deleted.
                                    dummyCharStyle = document.characterStyles.add();
                                    previousStyle = paragraph.characters[run.from].appliedCharacterStyle;
                                    paragraph.characters.itemByRange(run.from, runTo).appliedCharacterStyle = dummyCharStyle;
                                    dummyCharStyleApplied = true;
                                }

                                //iterate over the ranges.
                                for (rangeItr = 0; rangeItr < paragraph.textStyleRanges.length; rangeItr++) {
                                    range = paragraph.textStyleRanges[rangeItr];

                                    if (range.index - paraBeginIndex < run.from) {
                                        continue;
                                    }

                                    if (range.index + range.length - paraBeginIndex - 1 > runTo) {
                                        break;
                                    }

                                    // else case
                                    TEXT.applyCharacterStyleProperties(range, styleObj.value);
                                }
                                if (dummyCharStyleApplied) {
                                    dummyCharStyle.remove(previousStyle);
                                }
                            } else {
                                TEXT.applyParagraphStyleProperties(paragraph, styleObj.value);
                            }
                        } else {
                            if (style.__class__ === 'CharacterStyle') {
                                runTo = run.to - 1;
                                if (runTo > paragraph.characters.length - 1) {
                                    runTo = paragraph.characters.length - 1;
                                }
                                paragraph.characters.itemByRange(run.from, runTo).appliedCharacterStyle = style;
                                namedCharStyleApplied = true;
                            } else {
                                paragraph.appliedParagraphStyle = style;
                            }
                        }
                    }
                }
            }
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-applyStylesOnParagraph()', ex);
    }
};

TEXT.setTextFromJSON = function (textData, withStyles, object) {
    var setTextInternal = function (textData) {
        try {
            if (!object) {
                object = app.selection[0];
            }
            if (object.__class__ === 'TextFrame') {
                object = object.parentStory.texts[0];
            } else if (object.__class__ === 'Cell') {
                object = object.texts[0];
            }

            var document;
            document = object.parent;
            while (document.__class__ !== 'Document') {
                document = document.parent;
            }

            var styleMap = {};
            var noParagraphStyle = document.paragraphStyles.itemByName(AppStrings.NoParagraphStyle);
            var noneCharacterStyle = document.characterStyles.itemByName(AppStrings.NoneCharacterStyle);
            var bringStyles = withStyles && textData.styles;
            if (bringStyles) {
                TEXT.createStyles(textData, document, styleMap);
            }

            var paragraphs = textData.paragraphs;
            var numParagraphs = paragraphs.length;
            var paragraph;
            var paraIndex, paraLength;

            for (paraIndex = 0; paraIndex < numParagraphs; paraIndex++) {
                object.contents += paragraphs[paraIndex].text;
                object.contents += '\r';

                paraLength = paragraphs[paraIndex].text.length;
                if (bringStyles) {
                    paragraph = object.paragraphs[paraIndex];
                    if (paraLength > 0) {
                        paragraph.appliedParagraphStyle = noParagraphStyle;
                        paragraph.appliedCharacterStyle = noneCharacterStyle;
                    }
                    // Apply relevant styles and overrides
                    TEXT.applyStylesOnParagraph(document, paragraph, paragraphs[paraIndex], textData.styles, styleMap);
                }
                if (paraIndex === numParagraphs - 1) {
                    //This is the last paragraph and hence we have added an extra '\r'. Thus removing it.
                    object.characters[-1].remove();
                }
            }

            if (bringStyles && styleMap.overrides) {
                var overrideIndex, numOverrides = styleMap.overrides.length;
                for (overrideIndex = 0; overrideIndex < numOverrides; overrideIndex++) {
                    if (styleMap && styleMap.overrides && styleMap.overrides[overrideIndex]) {
                        styleMap.overrides[overrideIndex].remove();
                    }
                }
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-setTextInternal()', ex);
        }
    };

    // Just to remove JSLint error for unused setTextInternal
    if (app.doScript === undefined) {
        setTextInternal(textData);
    }

    try {
        app.doScript(
            'setTextInternal(textData);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Insert Text'
        );
    } catch (ex) {
        //alert(ex);
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-setText()', ex);
    }
};

TEXT.getSnippetForText = function (data, withStyles, idmsPath) {
    try {
        var textFrame;
        var tempDoc = TEXT.createHeadlessDocument();
        TEXT.removeAllTypeStyles(tempDoc);
        textFrame = tempDoc.textFrames.add();
        textFrame.geometricBounds = [0, 0, 200, 200];

        TEXT.setTextFromJSON(data, withStyles, textFrame);

        if (idmsPath === undefined) {
            var basePath = Folder.temp.fsName + '/TempIDMS' + $.hiresTimer;
            idmsPath = basePath + '.idms';
        }

        var tempObj = {
            filePath: idmsPath,
            outputFormats: ['snippet'],
            documentID: tempDoc.id,
            itemIDList: [textFrame.id]
        };
        tempDoc.exportForCloudLibrary(JSON.stringify(tempObj));
        TEXT.closeHeadlessDocument(tempDoc);

        var idmsFile = new File(idmsPath);
        if (idmsFile.exists) {
            return idmsPath;
        }
    } catch (ex) {
        //alert(ex);
        $._ADBE_LIBS_CORE.writeToLog('IDSN.jsx-getSnippetForText()', ex);
    }
};

//If the text has local overrides, allow picking up the style. A new style (with overrides) is created in that case.
//Do not allow picking up [None] character style
//Do not allow picking up [No Paragraph Style] paragraph style
TEXT.canAddTypeStyle = function (text, isCharStyle) {

    var allowed = false;
    if (isCharStyle) {
        allowed = text.textHasOverrides(StyleType.CHARACTER_STYLE_TYPE) ||
            text.appliedCharacterStyle.name !== AppStrings.NoneCharacterStyle;
    } else {
        allowed = text.textHasOverrides(StyleType.PARAGRAPH_STYLE_TYPE) ||
            text.appliedParagraphStyle.name !== AppStrings.NoParagraphStyle;
    }

    return allowed;
};
