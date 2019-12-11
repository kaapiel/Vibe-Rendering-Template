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
/*global $, Folder, DocumentColorSpace, app, RGBColor, File, SaveOptions, ImageColorSpace, ColorConvertPurpose, ExportOptionsSVG,
         SVGFontSubsetting, SVGFontType, ExportType, JSXGlobals, CMYKColor, GrayColor, TEXT, COLOR, UTIL, UnitValue,
         StyleRunAlignmentType, AlternateGlyphsForm, BaselineDirectionType, FontBaselineOption, FontCapsOption, FigureStyleType, AutoKernType,
         LanguageType, FontOpenTypePositionOption, WariChuJustificationType, TabStopInfo, Justification, AutoLeadingType, KinsokuOrderEnum, BurasagariTypeEnum,
         KashidasType, DirOverrideType, DigitSetType, DiacVPosType, KashidaWidthType, ParagraphDirectionType, ComposerEngineType, TextOrientation, NoColor, ColorModel */

var PARASTYLE_REPRESENTATION_JSON_TYPE = 'application/vnd.adobe.paragraphstyle+json';
var CHARSTYLE_REPRESENTATION_JSON_TYPE = 'application/vnd.adobe.characterstyle+json';

var TEXT = {};
TEXT.GET_CHARACTER_STYLE = "Get Character Style";
TEXT.GET_PARAGRAPH_STYLE = "Get Paragraph Style";

TEXT.GET_CHARACTER_STYLE_BY_ID = "Get Character Style By Id";
TEXT.GET_PARAGRAPH_STYLE_BY_ID = "Get Paragraph Style By Id";
TEXT.GET_COLLISION_RESPONCE = "Get Collision Response";

TEXT.MAX_STYLE_NAME_SIZE = 255;

TEXT.TypographyArray = [];
TEXT.GlobalConflictResolutionStrategy = {};
TEXT.RegistrationColor = undefined;

var ConflictResolutionStrategy = {
    wasNotOk: 1,
    useExisting: 2,
    useIncoming: 3
};

TEXT.processStyleName = function (styleName) {
    var length = styleName.length;
    if (length >= TEXT.MAX_STYLE_NAME_SIZE) {
        styleName = styleName.substring(0, TEXT.MAX_STYLE_NAME_SIZE);
    }
    return styleName;
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

TEXT.addCharacterStyleToAI = function (styleName, styleAttributes) {
    var characterStyle;
    styleName = TEXT.processStyleName(styleName);
    try {
        characterStyle = app.activeDocument.characterStyles.add(styleName);
    } catch (e) {
        // creating a temp Style
        if (app.activeDocument.characterStyles && app.activeDocument.characterStyles[0].name === styleName) { //first element in this array is always the normal style
            return null;
        }
        var tempStyleName = 'Temp' + $.hiresTimer;
        var tempStyleObject = TEXT.addCharacterStyleToAI(tempStyleName, styleAttributes);
        if (tempStyleObject === null || tempStyleObject === undefined) {
            return null;
        }
        //getting JSON for temp Style
        var tempStyleJSONString = TEXT.getCharacterStyleJSONStringfromAI(tempStyleName);
        var exisingStyleJSONString = TEXT.getCharacterStyleJSONStringfromAI(styleName);

        try {
            TEXT.removeCharacterStyle(tempStyleName);
        } catch (ex2) {
            $._ADBE_LIBS_CORE.writeToLog('ILST-> TEXT-> addCharacterStyleToAI -> removeCharacterStyle', ex2);
        }
        if (!tempStyleJSONString || !exisingStyleJSONString) {
            return null; /// no not proceed further stop adding style
        }

        characterStyle = app.activeDocument.characterStyles.getByName(styleName);

        if (tempStyleJSONString === exisingStyleJSONString) {
            return characterStyle; // style are same
        }

        //else showing collision dialog
        var wasOk = true;
        var useExisting = false;
        if (TEXT.GlobalConflictResolutionStrategy.initialized !== true) {
            var response = app.sendScriptMessage("Design Library", TEXT.GET_COLLISION_RESPONCE, "");
            var resonseJSON = JSON.parse(response);

            if (!resonseJSON) {
                return null; //conflict responce error
            }

            wasOk = resonseJSON.ActionOK && resonseJSON.ActionOK === "true";
            useExisting = resonseJSON.useExisting && resonseJSON.useExisting === "true";

            TEXT.GlobalConflictResolutionStrategy.initialized = true;
            if (!wasOk) {
                TEXT.GlobalConflictResolutionStrategy.strategy = ConflictResolutionStrategy.wasNotOk;
            } else if (useExisting) {
                TEXT.GlobalConflictResolutionStrategy.strategy = ConflictResolutionStrategy.useExisting;
            } else {
                TEXT.GlobalConflictResolutionStrategy.strategy = ConflictResolutionStrategy.useIncoming;
            }
        } else {
            if (TEXT.GlobalConflictResolutionStrategy.strategy === ConflictResolutionStrategy.wasNotOk) {
                wasOk = false;
            } else if (TEXT.GlobalConflictResolutionStrategy.strategy === ConflictResolutionStrategy.useExisting) {
                useExisting = true;
            }
        }

        if (!wasOk) {

            return null;
        }
        if (useExisting) {
            return characterStyle;
        }

        //if we are here here then we are using the incomming style
    }

    //adding character attributes to style
    try {
        if (characterStyle) {
            characterStyle.clear();
            TEXT.addCharacterAttributesToStyle(characterStyle, styleAttributes);
        }
    } catch (ex0) {
        $._ADBE_LIBS_CORE.writeToLog('addCharacterStyleToAI -> addCharacterAttributesToStyle', ex0);
    }
    return characterStyle;
};
TEXT.getCharacterStyleJSONStringfromAI = function (styleName, thumbnailFilePath) {
    var payLoad = {};
    payLoad.styleName = styleName;
    if (thumbnailFilePath) {
        payLoad.previewPath = thumbnailFilePath;
    } else {
        payLoad.previewPath = "null";
    }
    var response = app.sendScriptMessage("Design Library", TEXT.GET_CHARACTER_STYLE_BY_ID, JSON.stringify(payLoad));
    return response;
};



TEXT.addParagraphStyleToAI = function (styleName, styleAttributes) {
    var paragraphStyle;
    styleName = TEXT.processStyleName(styleName);
    try {
        paragraphStyle = app.activeDocument.paragraphStyles.add(styleName);
    } catch (e) {
        if (app.activeDocument.paragraphStyles && app.activeDocument.paragraphStyles[0].name === styleName) { //first element in this array is always the normal style
            return null;
        }
        var tempStyleName = 'Temp' + $.hiresTimer;
        var tempStyleObject = TEXT.addParagraphStyleToAI(tempStyleName, styleAttributes);

        if (tempStyleObject === null || tempStyleObject === undefined) {
            return null;
        }

        //getting JSON for temp Style
        var tempStyleJSONString = TEXT.getParagraphStyleJSONStringfromAI(tempStyleName);
        var exisingStyleJSONString = TEXT.getParagraphStyleJSONStringfromAI(styleName);

        try {
            TEXT.removeParagraphStyle(tempStyleName);
        } catch (ex2) {
            $._ADBE_LIBS_CORE.writeToLog('ILST-> TEXT-> addParagraphStyleToAI -> removeParagraphStyle', ex2);
        }


        if (!tempStyleJSONString || !exisingStyleJSONString) {
            return null; /// no not proceed further stop adding style
        }

        paragraphStyle = app.activeDocument.paragraphStyles.getByName(styleName);

        if (tempStyleJSONString === exisingStyleJSONString) {
            return paragraphStyle; // style are same
        }

        //else showing collision dialog
        var response = app.sendScriptMessage("Design Library", TEXT.GET_COLLISION_RESPONCE, "");
        var resonseJSON = JSON.parse(response);

        if (!resonseJSON) {
            return null; //conflict responce error
        }

        var wasOk = resonseJSON.ActionOK && resonseJSON.ActionOK === "true";
        var useExisting = resonseJSON.useExisting && resonseJSON.useExisting === "true";


        if (!wasOk) {
            return null;
        }
        if (useExisting) {
            return paragraphStyle;
        }

        //if we are here here then we are using the incomming style
    }
    //adding character attributes to style
    if (paragraphStyle) {
        paragraphStyle.clear(); //clearing before applying
        try {
            TEXT.addCharacterAttributesToStyle(paragraphStyle, styleAttributes);
        } catch (ex0) {
            $._ADBE_LIBS_CORE.writeToLog('addParagraphStyleToAI ->addCharacterAttributesToStyle', ex0);
        }
        try {
            //adding paragraph attributes to style
            TEXT.setJustificationAttributes(paragraphStyle, styleAttributes);
            TEXT.setScalingAttributes(paragraphStyle, styleAttributes);
            TEXT.setSpacingAttributes(paragraphStyle, styleAttributes);
            TEXT.setHyphenationAttributes(paragraphStyle, styleAttributes);
            TEXT.setIndentationAttributes(paragraphStyle, styleAttributes);
            TEXT.setOtherAttributes(paragraphStyle, styleAttributes);
            TEXT.setTabAttributes(paragraphStyle, styleAttributes);

        } catch (ex1) {
            $._ADBE_LIBS_CORE.writeToLog('addParagraphStyleToAI  ->adding paragraph attributes to style      ', ex1);
        }
    }
    return paragraphStyle;
};
TEXT.getParagraphStyleJSONStringfromAI = function (styleName, thumbnailFilePath) {
    var payLoad = {};
    payLoad.styleName = styleName;
    if (thumbnailFilePath) {
        payLoad.previewPath = thumbnailFilePath;
    } else {
        payLoad.previewPath = "null";
    }
    var response = app.sendScriptMessage("Design Library", TEXT.GET_PARAGRAPH_STYLE_BY_ID, JSON.stringify(payLoad));
    return response;
};

TEXT.isFontAvailable = function (style) {
    var result = app.textFonts.isFontAvailable(style.adbeFont.postScriptName) || app.textFonts.isFontAvailable(style.adbeFont.name);
    return result;
};

TEXT.updateRegistrationColor = function () {
    try {
        var doc = app.activeDocument;
        var spotsVar = doc.spots;
        var spotCount = spotsVar.length;
        var i;
        for (i = 0; i < spotCount; i++) {
            if (spotsVar[i].colorType === ColorModel.REGISTRATION) {
                TEXT.RegistrationColor = doc.swatches.getByName(spotsVar[i].name).color;
                return;
            }
        }
    } catch (ex1) {
        $._ADBE_LIBS_CORE.writeToLog('Error while reading registration color', ex1);
    }
};

TEXT.addCharacterAttributesToStyle = function (style, source) {
    var value, font;
    var i = 0;
    var activeDoc = app.activeDocument;
    if (!activeDoc) {
        return;
    }
    if (source.adbeFont && source.adbeFont.postScriptName !== "") {

        try {
            font = app.textFonts.getFontByName(source.adbeFont.postScriptName);
            style.characterAttributes.textFont = font;
        } catch (ignore) {}

    } else if (source.fontFamily) {
        //If all we have is the font-family then try to use that
        for (i = 0; i < app.textFonts.length; i++) {
            font = app.textFonts[i];
            if (font.family === source.fontFamily) {
                style.characterAttributes.textFont = font;
                break;
            }
        }
    }

    try {
        if (source.color) {
            if (source.color.__class__ === 'String') {
                if (source.color === "None") {
                    style.characterAttributes.fillColor = NoColor;
                } else if (source.color === "Registration") {
                    if (TEXT.RegistrationColor === undefined) {
                        TEXT.updateRegistrationColor();
                    }
                    style.characterAttributes.fillColor = TEXT.RegistrationColor;
                }
            } else {
                style.characterAttributes.fillColor = COLOR.dataToSolidColor(source.color);
            }
        }
    } catch (ignore) {}

    try {
        if (source.adbeIlstStrokeColor) {
            if (source.adbeIlstStrokeColor.__class__ === 'String') {
                if (source.adbeIlstStrokeColor === "None") {
                    style.characterAttributes.strokeColor = NoColor;
                } else if (source.adbeIlstStrokeColor === "Registration") {
                    if (TEXT.RegistrationColor === undefined) {
                        TEXT.updateRegistrationColor();
                    }
                    style.characterAttributes.strokeColor = TEXT.RegistrationColor;
                }
            } else {
                style.characterAttributes.strokeColor = COLOR.dataToSolidColor(source.adbeIlstStrokeColor);
            }
        }
    } catch (ignore) {}
    /* We probably don't want to add a stroke color if there isn't one defined
    else if (!source.adbeIlstStrokeColor && source.color) {
        style.characterAttributes.strokeColor = COLOR.dataToSolidColor(source.color);
    }*/

    if (source.fontSize !== undefined) {
        var size = new UnitValue(source.fontSize.value, source.fontSize.type);
        style.characterAttributes.size = size.as('pt');
    }

    //CHARACTER

    //Enumerations
    if (source.adbeIlstAlignment) {
        value = source.adbeIlstAlignment.split('.', 2)[1];
        style.characterAttributes.alignment = StyleRunAlignmentType[value];
    }
    if (source.adbeIlstAlternateGlyphs) {
        value = source.adbeIlstAlternateGlyphs.split('.', 2)[1];
        style.characterAttributes.alternateGlyphs = AlternateGlyphsForm[value];
    }
    if (source.adbeIlstBaselineDirection) {
        value = source.adbeIlstBaselineDirection.split('.', 2)[1];
        style.characterAttributes.baselineDirection = BaselineDirectionType[value];
    }
    if (source.adbeIdsnTatechuyoko === true) {
        style.characterAttributes.baselineDirection = BaselineDirectionType.TateChuYoko;
    }
    if (source.adbeIlstFigureStyle) {
        value = source.adbeIlstFigureStyle.split('.', 2)[1];
        style.characterAttributes.figureStyle = FigureStyleType[value];
    }
    if (source.adbeIlstKerningMethod) {
        value = source.adbeIlstKerningMethod.split('.', 2)[1];
        style.characterAttributes.kerningMethod = AutoKernType[value];
    }
    if (source.adbeIlstOpenTypePosition) {
        value = source.adbeIlstOpenTypePosition.split('.', 2)[1];
        style.characterAttributes.openTypePosition = FontOpenTypePositionOption[value];
    }
    if (source.adbeIlstWariChuJustification) {
        value = source.adbeIlstWariChuJustification.split('.', 2)[1];
        style.characterAttributes.wariChuJustification = WariChuJustificationType[value];
    }

    if (source.adbeIdsnKashidas !== undefined) {
        value = source.adbeIdsnKashidas.split('.', 2)[1];
        style.characterAttributes.kashidas = KashidasType[value];
    }

    if (source.adbeIdsnCharacterDirection !== undefined) {
        value = source.adbeIdsnCharacterDirection.split('.', 2)[1];
        style.characterAttributes.dirOverride = DirOverrideType[value];
    }

    if (source.adbeIdsnDigitsType !== undefined) {
        value = source.adbeIdsnDigitsType.split('.', 2)[1];
        style.characterAttributes.digitSet = DigitSetType[value];
    }
    try {
        if (source.adbeIdsnDiacriticPosition !== undefined) {
            value = source.adbeIdsnDiacriticPosition.split('.', 2)[1];
            style.characterAttributes.diacVPos = DiacVPosType[value];
        }
    } catch (ignore) {}

    //booleans and numbers
    if (source.fontStyle === 'italics') {
        style.characterAttributes.italics = true;
    }
    if (source.adbeIlstAkiLeft !== undefined) {
        style.characterAttributes.akiLeft = source.adbeIlstAkiLeft;
    }
    if (source.adbeIlstAkiRight !== undefined) {
        style.characterAttributes.akiRight = source.adbeIlstAkiRight;
    }
    if (source.adbeAutoLeading) {
        style.characterAttributes.autoLeading = true;
    }
    if (source.baselineShift !== undefined) {
        var bShift = new UnitValue(source.baselineShift.value, source.baselineShift.type);
        style.characterAttributes.baselineShift = bShift.as('pt');
    }
    if (source.adbeIlstConnectionForms !== undefined) {
        style.characterAttributes.connectionForms = source.adbeIlstConnectionForms;
    }
    /*if (source.adbeIlstContextualLigature) {
        style.characterAttributes.contextualLigature = source.adbeIlstContextualLigature;
    }*/

    if (source.adbeHorizontalScale !== undefined) {
        style.characterAttributes.horizontalScale = source.adbeHorizontalScale;
    }

    if (source.lineHeight !== undefined) {
        var lead = new UnitValue(source.lineHeight.value, source.lineHeight.type);
        style.characterAttributes.autoLeading = false;
        style.characterAttributes.leading = lead.as('pt');
    }

    try {
        if (source.adbeIdsnAppliedLanguageName !== undefined) {
            style.characterAttributes.language = source.adbeIdsnAppliedLanguageName;
        }
    } catch (ignore) {}

    if (source.whiteSpace && source.whiteSpace === 'nowrap') {
        style.characterAttributes.noBreak = true;
    }
    if (source.adbeIlstOverprintFill !== undefined) {
        style.characterAttributes.overprintFill = source.adbeIlstOverprintFill;
    }
    if (source.adbeIlstOverprintStroke !== undefined) {
        style.characterAttributes.overprintStroke = source.adbeIlstOverprintStroke;
    }
    if (source.adbeIlstProportionalMetrics !== undefined) {
        style.characterAttributes.proportionalMetrics = source.adbeIlstProportionalMetrics;
    }
    if (source.adbeIlstRotation !== undefined) {
        style.characterAttributes.rotation = source.adbeIlstRotation;
    }

    //Only set stroke weight if color is available because it will add a default black color if we set it and color is not set
    //Also, dont override with default black color if fill color is specified as NoColor
    if (source.adbeIlstStrokeWeight !== undefined && source.adbeIlstStrokeColor && source.adbeIlstStrokeColor !== "None") {
        style.characterAttributes.strokeWeight = source.adbeIlstStrokeWeight.value;
    }
    if (source.adbeIlstTateChuYokoHorizontal !== undefined) {
        style.characterAttributes.tateChuYokoHorizontal = source.adbeIlstTateChuYokoHorizontal;
    }
    if (source.adbeIlstTateChuYokoVertical !== undefined) {
        style.characterAttributes.tateChuYokoVertical = source.adbeIlstTateChuYokoVertical;
    }

    //Use our Adobe Tracking property if its available but revert back to converting CSS letter-spacing otherwise
    if (source.adbeTracking !== undefined) {
        style.characterAttributes.tracking = source.adbeTracking;
    } else if (source.letterSpacing) {
        style.characterAttributes.tracking = source.letterSpacing.value * 1000;
    }

    //text-decoration underline and strike-through

    if (source.textDecorationObject !== undefined) {
        if (source.textDecorationObject.adbeUnderline !== undefined) {
            style.characterAttributes.underline = source.textDecorationObject.adbeUnderline;
        }
        if (source.textDecorationObject.adbeStrikethrough !== undefined) {
            style.characterAttributes.strikeThrough = source.textDecorationObject.adbeStrikethrough;
        }
    } else if (source.textDecoration) {
        if (source.textDecoration.indexOf('underline') !== -1) {
            style.characterAttributes.underline = true;
        } else {
            style.characterAttributes.underline = false;
        }

        if (source.textDecoration.indexOf('line-through') !== -1) {
            style.characterAttributes.strikeThrough = true;
        } else {
            style.characterAttributes.strikeThrough = false;
        }
    }

    if (source.adbeIdsnXOffsetDiacritic !== undefined) {
        style.characterAttributes.diacXOffset = source.adbeIdsnXOffsetDiacritic;
    }
    if (source.adbeIdsnYOffsetDiacritic !== undefined) {
        style.characterAttributes.diacYOffset = source.adbeIdsnYOffsetDiacritic;
    }

    if (source.adbeIlstTsume !== undefined) {
        style.characterAttributes.Tsume = source.adbeIlstTsume;
    }


    if (source.adbeVerticalScale !== undefined) {
        style.characterAttributes.verticalScale = source.adbeVerticalScale;
    }

    if (source.adbeIlstWariChuCharactersAfterBreak !== undefined) {
        style.characterAttributes.wariChuCharactersAfterBreak = source.adbeIlstWariChuCharactersAfterBreak;
    }

    if (source.adbeIlstWariChuCharactersBeforeBreak !== undefined) {
        style.characterAttributes.wariChuCharactersBeforeBreak = source.adbeIlstWariChuCharactersBeforeBreak;
    }

    if (source.adbeIlstWariChuEnabled !== undefined) {
        style.characterAttributes.wariChuEnabled = source.adbeIlstWariChuEnabled;
    }

    if (source.adbeIlstWariChuLineGap !== undefined) {
        style.characterAttributes.wariChuLineGap = source.adbeIlstWariChuLineGap;
    }

    if (source.adbeIlstWariChuLines !== undefined) {
        style.characterAttributes.wariChuLines = source.adbeIlstWariChuLines;
    }

    if (source.adbeIlstWariChuScale !== undefined) {
        style.characterAttributes.wariChuScale = source.adbeIlstWariChuScale;
    }

    if (source.adbeIdsnOtfStylisticSets !== undefined) {
        /* Converting to the value Illustrator understands */
        style.characterAttributes.stylisticSets = source.adbeIdsnOtfStylisticSets / 2;
    }

    var fontFeatureSettings = source.fontFeatureSettingsObject;
    if (!fontFeatureSettings) {
        fontFeatureSettings = source.fontFeatureSettings;
    }

    if (fontFeatureSettings) {
        if (fontFeatureSettings.__class__ === 'Array' && fontFeatureSettings.length > 0) {
            var hasFontFeatureSettings = source.fontFeatureSettings !== undefined && source.fontFeatureSettings.length > 0;

            style.characterAttributes.discretionaryLigature = hasFontFeatureSettings && (source.fontFeatureSettings.indexOf('dlig') !== -1);
            style.characterAttributes.contextualLigature = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('clig') !== -1;
            style.characterAttributes.ornaments = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('ornm') !== -1;
            style.characterAttributes.ordinals = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('ordn') !== -1;
            style.characterAttributes.swash = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('swsh') !== -1;
            style.characterAttributes.ligature = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('liga') !== -1;
            style.characterAttributes.fractions = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('frac') !== -1;
            style.characterAttributes.titling = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('titl') !== -1;
            style.characterAttributes.stylisticAlternates = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('salt') !== -1;
            style.characterAttributes.italics = hasFontFeatureSettings && source.fontFeatureSettings.indexOf('rita') !== -1;


            // Superscript subscript normal baseline
            if (hasFontFeatureSettings && source.fontFeatureSettings.indexOf('sups') !== -1) {
                style.characterAttributes.baselinePosition = FontBaselineOption.SUPERSCRIPT;
            } else if (hasFontFeatureSettings && source.fontFeatureSettings.indexOf('subs') !== -1) {
                style.characterAttributes.baselinePosition = FontBaselineOption.SUBSCRIPT;
            } else {
                style.characterAttributes.baselinePosition = FontBaselineOption.NORMALBASELINE;
            }


            // All small caps, small caps. all caps, normal
            if (hasFontFeatureSettings && source.fontFeatureSettings.indexOf('c2sc') !== -1) {
                style.characterAttributes.capitalization = FontCapsOption.ALLSMALLCAPS;
            } else if (hasFontFeatureSettings && source.fontFeatureSettings.indexOf('smcp') !== -1) {
                style.characterAttributes.capitalization = FontCapsOption.SMALLCAPS;
            } else if (source.textTransform === 'capitalize') {
                style.characterAttributes.capitalization = FontCapsOption.ALLCAPS;
            } else {
                style.characterAttributes.capitalization = FontCapsOption.NORMALCAPS;
            }
        } else if (fontFeatureSettings.__class__ === 'Object') {

            if (fontFeatureSettings.adbeOTFSwash !== undefined) {
                style.characterAttributes.swash = fontFeatureSettings.adbeOTFSwash;
            }
            if (fontFeatureSettings.adbeOTFOrdinals !== undefined) {
                style.characterAttributes.ordinals = fontFeatureSettings.adbeOTFOrdinals;
            }
            if (fontFeatureSettings.adbeOTFDiscretionaryLigatures !== undefined) {
                style.characterAttributes.discretionaryLigature = fontFeatureSettings.adbeOTFDiscretionaryLigatures;
            }
            if (fontFeatureSettings.adbeOTFContextualAlternates !== undefined) {
                style.characterAttributes.contextualLigature = fontFeatureSettings.adbeOTFContextualAlternates;
            }
            if (fontFeatureSettings.adbeLigatures !== undefined) {
                style.characterAttributes.ligature = fontFeatureSettings.adbeLigatures;
            }
            if (fontFeatureSettings.adbeOTFFractions !== undefined) {
                style.characterAttributes.fractions = fontFeatureSettings.adbeOTFFractions;
            }
            if (fontFeatureSettings.adbeOTFTitlingAlternates !== undefined) {
                style.characterAttributes.titling = fontFeatureSettings.adbeOTFTitlingAlternates;
            }
            if (fontFeatureSettings.adbeOTFStylisticAlternates !== undefined) {
                style.characterAttributes.stylisticAlternates = fontFeatureSettings.adbeOTFStylisticAlternates;
            }
            if (fontFeatureSettings.adbeOTFRomanItalics !== undefined) {
                style.characterAttributes.italics = fontFeatureSettings.adbeOTFRomanItalics;
            }
            if (fontFeatureSettings.adbeOTFOrnaments !== undefined) {
                style.characterAttributes.ornaments = fontFeatureSettings.adbeOTFOrnaments;
            }
            if (fontFeatureSettings.adbeOTFHVKana !== undefined) {
                style.characterAttributes.kana = fontFeatureSettings.adbeOTFHVKana;
            }
            if (fontFeatureSettings.adbePosition) {
                switch (fontFeatureSettings.adbePosition) {
                case 'Position.NORMAL':
                    style.characterAttributes.baselinePosition = FontBaselineOption.NORMALBASELINE;
                    break;
                case 'Position.SUBSCRIPT':
                    style.characterAttributes.baselinePosition = FontBaselineOption.SUBSCRIPT;
                    break;
                case 'Position.SUPERSCRIPT':
                    style.characterAttributes.baselinePosition = FontBaselineOption.SUPERSCRIPT;
                    break;
                }
            }
            if (fontFeatureSettings.adbeCapitalization) {
                switch (fontFeatureSettings.adbeCapitalization) {
                case 'FontCapsOption.NORMAL':
                    style.characterAttributes.capitalization = FontCapsOption.NORMALCAPS;
                    break;
                case 'FontCapsOption.ALLSMALLCAPS':
                    style.characterAttributes.capitalization = FontCapsOption.ALLSMALLCAPS;
                    break;
                case 'FontCapsOption.SMALLCAPS':
                    style.characterAttributes.capitalization = FontCapsOption.SMALLCAPS;
                    break;
                case 'FontCapsOption.ALLCAPS':
                    style.characterAttributes.capitalization = FontCapsOption.ALLCAPS;
                    break;
                }
            }
            if (fontFeatureSettings.adbeOTFJustificationAlternates !== undefined) {
                style.characterAttributes.justificationAlternates = fontFeatureSettings.adbeOTFJustificationAlternates;
            }
        }
    }
};


TEXT.setParagraphStyle = function (attributes) {
    var i;
    var paragraphStyle = TEXT.addParagraphStyleToAI(attributes.name, attributes);

    var appSelection = app.selection;
    if (appSelection) {
        try {
            if (paragraphStyle) {
                if (appSelection.__class__ === 'TextRange') {
                    paragraphStyle.applyTo(appSelection, true);
                } else if (appSelection.length > 0 && appSelection[0] !== undefined) {

                    for (i = 0; i < appSelection.length; i++) {
                        if (appSelection[i].__class__ === "TextFrame") {
                            paragraphStyle.applyTo(appSelection[i].textRange, true);
                        }
                    }
                }
            }
        } catch (ex2) {
            $._ADBE_LIBS_CORE.writeToLog('Ilst.jsx-setParagraphStyle', ex2);
        }
    }
};
TEXT.setCharacterStyle = function (attributes) {
    //var currentSelection = app.selection;
    var i = 0;
    var characterStyle = TEXT.addCharacterStyleToAI(attributes.name, attributes);
    if (app.selection) {
        try {
            if (characterStyle) {
                if (app.selection.__class__ === 'TextRange') {
                    characterStyle.applyTo(app.selection, true);
                } else if (app.selection.length > 0 && app.selection[0] !== undefined) {
                    for (i = 0; i < app.selection.length; i++) {
                        if (app.selection[i].__class__ === "TextFrame") {
                            characterStyle.applyTo(app.selection[i].textRange, true);
                        }
                    }
                }
            }
        } catch (ex2) {
            $._ADBE_LIBS_CORE.writeToLog('Ilst.jsx-setCharacterStyle', ex2);
        }
    }
};

TEXT.addParagraphStyles = function () {
    TEXT.GlobalConflictResolutionStrategy.initialized = false;

    var numStyles = TEXT.TypographyArray.length;
    var itr, typography;
    for (itr = 0; itr < numStyles; itr++) {
        typography = TEXT.TypographyArray[itr];
        TEXT.addParagraphStyle(typography);
    }

    TEXT.GlobalConflictResolutionStrategy.initialized = false;
};

TEXT.addCharacterStyles = function () {
    TEXT.GlobalConflictResolutionStrategy.initialized = false;

    var numStyles = TEXT.TypographyArray.length;
    var itr, typography;
    for (itr = 0; itr < numStyles; itr++) {
        typography = TEXT.TypographyArray[itr];
        TEXT.addCharacterStyle(typography);
    }

    TEXT.GlobalConflictResolutionStrategy.initialized = false;
};

TEXT.addParagraphStyle = function (attributes) {
    TEXT.addParagraphStyleToAI(attributes.name, attributes);
};
TEXT.addCharacterStyle = function (attributes) {
    TEXT.addCharacterStyleToAI(attributes.name, attributes);
};
TEXT.removeParagraphStyle = function (styleName) {
    var paragraphStyle = app.activeDocument.paragraphStyles.getByName(styleName);
    if (paragraphStyle) {
        paragraphStyle.remove();
    }
};
TEXT.removeCharacterStyle = function (styleName) {
    var characterStyle = app.activeDocument.characterStyles.getByName(styleName);
    if (characterStyle) {
        characterStyle.remove();
    }
};
TEXT.setFont = function (styleObject) {
    'use strict';
    try {
        if (styleObject.type === 'parastyle') {
            TEXT.setParagraphStyle(styleObject);
        } else {
            TEXT.setCharacterStyle(styleObject);
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('Ilst.jsx-setFont()', ex);
    }
};
TEXT.createTextLayer = function (styleObject, isFirstElement, isLastElement) {
    if (isFirstElement !== false) {
        TEXT.TypographyArray = [];
    }

    TEXT.TypographyArray.push(styleObject);

    if (isLastElement !== false) {
        try {
            if (styleObject.type === 'parastyle') {
                TEXT.addParagraphStyles();
            } else {
                TEXT.addCharacterStyles();
            }
        } catch (ex) {
            $._ADBE_LIBS_CORE.writeToLog('Ilst.jsx-createTextLayer()', ex);
        }
        TEXT.TypographyArray = [];
    }
};

TEXT.getCharacterColors = function (textRange) {
    var i, range, colors = [];

    for (i = 0; i < textRange.textRanges.length; i++) {
        range = textRange.textRanges[i];
        if (COLOR.isColorSupported(range.characterAttributes.fillColor)) {
            colors.push(COLOR.solidColorToData(range.characterAttributes.fillColor));
        }

        // Only add stroke color if we have one
        if (COLOR.isColorSupported(range.characterAttributes.strokeColor)) {
            colors.push(COLOR.solidColorToData(range.characterAttributes.strokeColor));
        }
    }
    return colors;
};


TEXT.getCharacterStyle = function () {
    //var currentSelection = app.activeDocument.selection;
    var previewPath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer + '.png';
    var characterStyleObject = {};
    var attributes;
    var jsonString;
    try {
        jsonString = app.sendScriptMessage("Design Library", TEXT.GET_CHARACTER_STYLE, previewPath);
        if (jsonString) {
            attributes = JSON.parse(jsonString);
        }
        var styleInfo = {};
        if (attributes.styleName) {
            characterStyleObject.styleName = attributes.styleName;
        }
        if (attributes) {
            try {
                TEXT.collectCharacterAttributes(styleInfo, attributes);
            } catch (ex1) {
                $._ADBE_LIBS_CORE.writeToLog("Error ILST->TEXT.getCharacterStyle()->collectCharacterAttributes() ", ex1);
            }
        }
        characterStyleObject.styleInfo = styleInfo;
        characterStyleObject.previewPath = previewPath;
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog("Error ILST->TEXT.getCharacterStyle()", ex);
    }
    return characterStyleObject;
};
TEXT.getParagraphStyle = function () {
    var paragraphStyleObject = {};
    var styleInfo = {};
    var previewPath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer + '.png';
    var attributes;
    var jsonString;
    try {
        jsonString = app.sendScriptMessage("Design Library", TEXT.GET_PARAGRAPH_STYLE, previewPath);
        if (jsonString) {
            attributes = JSON.parse(jsonString);
        }
        if (attributes.styleName) {
            paragraphStyleObject.styleName = attributes.styleName;
        }
        if (attributes) {
            try {
                TEXT.collectParagraphAttributes(styleInfo, attributes);
            } catch (ex1) {
                $._ADBE_LIBS_CORE.writeToLog("Error ILST->TEXT.getCharacterStyle()->collectParagraphAttributes() ", ex1);
            }

            try {
                TEXT.collectCharacterAttributes(styleInfo, attributes);
            } catch (ex2) {
                $._ADBE_LIBS_CORE.writeToLog("Error ILST->TEXT.getCharacterStyle()->collectCharacterAttributes() ", ex2);
            }
        }

        paragraphStyleObject.styleInfo = styleInfo;
        paragraphStyleObject.previewPath = previewPath;
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog("Error ILST->TEXT.getParagraphStyle()", ex);
    }
    return paragraphStyleObject;
};
TEXT.getCharacterStyleById = function (id) {
    //var currentSelection = app.activeDocument.selection;
    var previewPath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer + '.png';
    var characterStyleObject = {};
    try {
        var jsonString = TEXT.getCharacterStyleJSONStringfromAI(id, previewPath);
        if (jsonString) {
            var attributes = JSON.parse(jsonString);
            var styleInfo = {};
            characterStyleObject.styleName = id;
            if (app.activeDocument.characterStyles && app.activeDocument.characterStyles[0].name === id) { //first element in this array is always the normal style
                if (id[0] === '[' && id[id.length - 1] === ']') {
                    characterStyleObject.styleName = id.substring(1, id.length - 1); // removing [ & ]
                }
            }
            TEXT.collectCharacterAttributes(styleInfo, attributes);
            characterStyleObject.styleInfo = styleInfo;
            characterStyleObject.previewPath = previewPath;
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog("Error ILST->TEXT.getCharacterStyleById()", ex);
    }
    return characterStyleObject;
};
TEXT.getParagraphStyleById = function (id) {
    var paragraphStyleObject = {};
    var styleInfo = {};
    var previewPath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer + '.png';
    try {
        var jsonString = TEXT.getParagraphStyleJSONStringfromAI(id, previewPath);
        var attributes = JSON.parse(jsonString);
        if (attributes) {
            paragraphStyleObject.styleName = id;
            if (app.activeDocument.paragraphStyles && app.activeDocument.paragraphStyles[0].name === id) { //first element in this array is always the normal style
                if (id[0] === '[' && id[id.length - 1] === ']') {
                    paragraphStyleObject.styleName = id.substring(1, id.length - 1); // removing [ & ]
                }
            }
            TEXT.collectParagraphAttributes(styleInfo, attributes);
            TEXT.collectCharacterAttributes(styleInfo, attributes);
            paragraphStyleObject.styleInfo = styleInfo;
            paragraphStyleObject.previewPath = previewPath;
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog("Error ILST->TEXT.getParagraphStyleById()", ex);
    }
    return paragraphStyleObject;
};
TEXT.getPrefsOwner = function () {
    var prefsOwner = app;
    try {
        prefsOwner = app.activeDocument;
    } catch (ex) {
        prefsOwner = app;
    }
    return prefsOwner;
};

TEXT.collectCharacterAttributes = function (obj, characterAttributes) {
    var charAttributes = {};
    var key, value;
    for (key in characterAttributes) {
        if (characterAttributes.hasOwnProperty(key)) {
            try {
                charAttributes[key] = characterAttributes[key];
            } catch (ignore) {}
        }
    }
    if (charAttributes.fillColor !== undefined) {
        if (charAttributes.fillColor.__class__ === 'String') {
            obj.color = charAttributes.fillColor;
        } else if (COLOR.isColorSupported(charAttributes.fillColor)) {
            obj.color = COLOR.solidColorToData(charAttributes.fillColor);
        }
    }

    // Only add stroke color if we have one
    if (charAttributes.strokeColor !== undefined) {
        if (charAttributes.strokeColor.__class__ === 'String') {
            obj.adbeIlstStrokeColor = charAttributes.strokeColor;
        } else if (COLOR.isColorSupported(charAttributes.strokeColor)) {
            obj.adbeIlstStrokeColor = COLOR.solidColorToData(charAttributes.strokeColor);
        }
    }

    if (charAttributes.textFont !== undefined) {
        if (charAttributes.textFont !== null) {
            obj.adbeFont = {
                family: charAttributes.textFont.family,
                name: charAttributes.textFont.name,
                postScriptName: charAttributes.textFont.name,
                style: charAttributes.textFont.style
            };
            obj.fontFamily = charAttributes.textFont.family;
        }
    }


    if (charAttributes.size !== undefined) {
        obj.fontSize = {
            type: 'pt',
            value: charAttributes.size
        };
    }



    if (charAttributes.textFont !== undefined && charAttributes.textFont !== null && charAttributes.textFont.style !== undefined) {
        //Approximate font-style and font-weight for CSS
        var style = charAttributes.textFont.style.toLowerCase();
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



    //CHARACTER ATTRIBUTES
    //Enumerations



    if (charAttributes.alignment !== undefined) {
        obj.adbeIlstAlignment = charAttributes.alignment;
    }

    if (charAttributes.alternateGlyphs !== undefined) {
        try {
            obj.adbeIlstAlternateGlyphs = charAttributes.alternateGlyphs;
        } catch (e) {
            obj.adbeIlstAlternateGlyphs = AlternateGlyphsForm.DEFAULTFORM.toString();
        }
    }



    if (charAttributes.baselineDirection !== undefined) {
        obj.adbeIlstBaselineDirection = charAttributes.baselineDirection;
        if (obj.adbeIlstBaselineDirection === 'BaselineDirectionType.TateChuYoko') {
            obj.adbeIdsnTatechuyoko = true;
        }
    }



    if (charAttributes.figureStyle !== undefined) {
        obj.adbeIlstFigureStyle = charAttributes.figureStyle;
    }



    if (charAttributes.kerningMethod !== undefined) {
        try {
            obj.adbeIlstKerningMethod = charAttributes.kerningMethod;
        } catch (err) {
            obj.adbeIlstKerningMethod = AutoKernType.AUTO.toString();
        }
    }



    if (charAttributes.openTypePosition !== undefined) {
        obj.adbeIlstOpenTypePosition = charAttributes.openTypePosition;
    }



    if (charAttributes.wariChuJustification !== undefined) {
        obj.adbeIlstWariChuJustification = charAttributes.wariChuJustification;
    }

    //booleans and numbers


    if (charAttributes.akiLeft !== undefined) {
        obj.adbeIlstAkiLeft = charAttributes.akiLeft;
    }



    if (charAttributes.akiRight !== undefined) {
        obj.adbeIlstAkiRight = charAttributes.akiRight;
    }



    if (charAttributes.autoLeading !== undefined) {
        if (charAttributes.autoLeading) {
            obj.adbeAutoLeading = true;
        }
    }



    if (charAttributes.baselineShift !== undefined) {
        obj.baselineShift = {
            type: 'pt',
            value: charAttributes.baselineShift
        };
    }



    if (charAttributes.connectionForms !== undefined) {
        obj.adbeIlstConnectionForms = charAttributes.connectionForms;
    }



    if (charAttributes.horizontalScale !== undefined) {
        obj.adbeHorizontalScale = charAttributes.horizontalScale;
    }







    if (charAttributes.leading !== undefined) {
        obj.lineHeight = {
            type: 'pt',
            value: charAttributes.leading
        };
    }
    if (charAttributes.language !== undefined) {
        obj.adbeIdsnAppliedLanguageName = charAttributes.language;
    }

    if (charAttributes.noBreak !== undefined) {
        if (charAttributes.noBreak) {
            obj.whiteSpace = 'nowrap';
        }
    }


    if (charAttributes.overprintFill !== undefined) {
        obj.adbeIlstOverprintFill = charAttributes.overprintFill;
    }


    if (charAttributes.overprintStroke !== undefined) {
        obj.adbeIlstOverprintStroke = charAttributes.overprintStroke;
    }


    if (charAttributes.proportionalMetrics !== undefined) {
        obj.adbeIlstProportionalMetrics = charAttributes.proportionalMetrics;
    }


    if (charAttributes.rotation !== undefined) {
        obj.adbeIlstRotation = charAttributes.rotation;
    }



    //Only gather the stroke weight if there is a color specified

    if (charAttributes.strokeWeight !== undefined) {
        if (obj.adbeIlstStrokeColor) {
            obj.adbeIlstStrokeWeight = charAttributes.strokeWeight;
        }
    }


    if (charAttributes.tateChuYokoHorizontal !== undefined) {
        obj.adbeIlstTateChuYokoHorizontal = charAttributes.tateChuYokoHorizontal;
    }


    if (charAttributes.tateChuYokoVertical !== undefined) {
        obj.adbeIlstTateChuYokoVertical = charAttributes.tateChuYokoVertical;
    }


    // OpenType feature settings
    obj.fontFeatureSettings = [];
    obj.fontFeatureSettingsObject = {};
    if (charAttributes.swash !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFSwash = charAttributes.swash;
        if (charAttributes.swash) {
            obj.fontFeatureSettings.push('swsh');
        }
    }

    if (charAttributes.justificationAlternates !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFJustificationAlternates = charAttributes.justificationAlternates;
        if (charAttributes.justificationAlternates) {
            obj.fontFeatureSettings.push('jalt');
        }
    }

    if (charAttributes.stylisticSets !== undefined) {
        /* Spec's count starts with 2, ILST's starts with 1, converting as per spec */
        obj.adbeIdsnOtfStylisticSets = 2 * charAttributes.stylisticSets;
    }

    if (charAttributes.ordinals !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFOrdinals = charAttributes.ordinals;
        if (charAttributes.ordinals) {
            obj.fontFeatureSettings.push('ordn');
        }
    }



    if (charAttributes.ornaments !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFOrnaments = charAttributes.ordinals;
        if (charAttributes.ornaments) {
            obj.fontFeatureSettings.push('ornm');
        }
    }


    if (charAttributes.kana !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFHVKana = charAttributes.kana;
        if (charAttributes.kana) {
            obj.fontFeatureSettings.push('hvkn');
        }
    }

    if (charAttributes.discretionaryLigature !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFDiscretionaryLigatures = charAttributes.discretionaryLigature;
        if (charAttributes.discretionaryLigature) {
            obj.fontFeatureSettings.push('dlig');
        }
    }



    if (charAttributes.contextualLigature !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFContextualAlternates = charAttributes.contextualLigature;
        if (charAttributes.contextualLigature) {
            obj.fontFeatureSettings.push('clig');
        }
    }



    if (charAttributes.ligature !== undefined) {
        obj.fontFeatureSettingsObject.adbeLigatures = charAttributes.ligature;
        if (charAttributes.ligature) {
            obj.fontFeatureSettings.push('liga');
        }
    }


    if (charAttributes.fractions !== undefined) {

        obj.fontFeatureSettingsObject.adbeOTFFractions = charAttributes.fractions;
        if (charAttributes.fractions) {
            obj.fontFeatureSettings.push('frac');
        }
    }


    if (charAttributes.titling !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFTitlingAlternates = charAttributes.titling;
        if (charAttributes.titling) {
            obj.fontFeatureSettings.push('titl');
        }
    }



    if (charAttributes.stylisticAlternates !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFStylisticAlternates = charAttributes.stylisticAlternates;
        if (charAttributes.stylisticAlternates) {
            obj.fontFeatureSettings.push('salt');
        }
    }

    if (charAttributes.italics !== undefined) {
        obj.fontFeatureSettingsObject.adbeOTFRomanItalics = charAttributes.italics;
        if (charAttributes.italics) {
            obj.fontFeatureSettings.push('rita');
        }
    }





    if (charAttributes.baselinePosition === FontBaselineOption.SUPERSCRIPT.toString()) {
        obj.fontFeatureSettingsObject.adbePosition = 'Position.SUPERSCRIPT';
        obj.fontFeatureSettings.push('sups');
    } else if (charAttributes.baselinePosition === FontBaselineOption.SUBSCRIPT.toString()) {
        obj.fontFeatureSettingsObject.adbePosition = 'Position.SUBSCRIPT';
        obj.fontFeatureSettings.push('subs');
    } else if (charAttributes.baselinePosition === FontBaselineOption.NORMALBASELINE.toString()) {
        obj.fontFeatureSettingsObject.adbePosition = 'Position.NORMAL';
    }

    if (charAttributes.capitalization !== undefined) {
        if (charAttributes.capitalization === FontCapsOption.NORMALCAPS.toString()) {
            obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.NORMAL';
        } else {
            obj.fontFeatureSettingsObject.adbeCapitalization = charAttributes.capitalization;
        }
    }

    if (charAttributes.capitalization === FontCapsOption.ALLSMALLCAPS.toString()) {
        obj.fontFeatureSettings.push('c2sc');
    } else if (charAttributes.capitalization === FontCapsOption.SMALLCAPS.toString()) {
        obj.fontFeatureSettings.push('smcp');
    } else if (charAttributes.capitalization === FontCapsOption.ALLCAPS.toString()) {
        obj.textTransform = 'capitalize';
    }

    if (TEXT.isEmptyObject(obj.fontFeatureSettingsObject)) {
        delete obj.fontFeatureSettingsObject;
    }

    //If we have no open type settings delete the empty array
    if (obj.fontFeatureSettings.length === 0) {
        delete obj.fontFeatureSettings;
    }



    if (charAttributes.tracking !== undefined) {
        obj.adbeTracking = charAttributes.tracking;
    }



    if (obj.adbeTracking) {
        obj.letterSpacing = {
            type: 'em',
            value: (obj.adbeTracking / 1000.0).toFixed(2)
        };
    }



    if (charAttributes.Tsume !== undefined) {
        obj.adbeIlstTsume = charAttributes.Tsume;
    }


    obj.textDecorationObject = {};
    // text-decoration properties

    if (charAttributes.underline !== undefined) {
        obj.textDecorationObject.adbeUnderline = charAttributes.underline;
        if (charAttributes.underline) {
            if (obj.textDecoration) {
                obj.textDecoration.push('underline');
            } else {
                obj.textDecoration = ['underline'];
            }
        }
    }

    //Strike through or in CSS speak line-through
    if (charAttributes.strikeThrough !== undefined) {
        obj.textDecorationObject.adbeStrikethrough = charAttributes.strikeThrough;
        if (charAttributes.strikeThrough) {
            if (obj.textDecoration) {
                obj.textDecoration.push('line-through');
            } else {
                obj.textDecoration = ['line-through'];
            }
        }
    }


    if (charAttributes.verticalScale !== undefined) {
        obj.adbeVerticalScale = charAttributes.verticalScale;
    }


    if (charAttributes.wariChuCharactersAfterBreak !== undefined) {
        obj.adbeIlstWariChuCharactersAfterBreak = charAttributes.wariChuCharactersAfterBreak;
    }


    if (charAttributes.wariChuCharactersBeforeBreak !== undefined) {
        obj.adbeIlstWariChuCharactersBeforeBreak = charAttributes.wariChuCharactersBeforeBreak;
    }


    if (charAttributes.wariChuEnabled !== undefined) {
        obj.adbeIlstWariChuEnabled = charAttributes.wariChuEnabled;
    }


    if (charAttributes.wariChuLineGap !== undefined) {
        obj.adbeIlstWariChuLineGap = charAttributes.wariChuLineGap;
    }


    if (charAttributes.wariChuLines !== undefined) {
        obj.adbeIlstWariChuLines = charAttributes.wariChuLines;
    }


    if (charAttributes.wariChuScale !== undefined) {
        obj.adbeIlstWariChuScale = charAttributes.wariChuScale;
    }

    if (charAttributes.kashidas !== undefined) {
        obj.adbeIdsnKashidas  = charAttributes.kashidas;
    }

    if (charAttributes.dirOverride !== undefined) {
        value = charAttributes.dirOverride.split('.', 2)[1];
        obj.adbeIdsnCharacterDirection  = "CharacterDirectionOptions." + value;
    }

    if (charAttributes.digitSet !== undefined) {
        obj.adbeIdsnDigitsType   = charAttributes.digitSet;
    }

    if (charAttributes.diacVPos !== undefined) {
        obj.adbeIdsnDiacriticPosition  = charAttributes.diacVPos;
    }

    if (charAttributes.diacXOffset !== undefined) {
        obj.adbeIdsnXOffsetDiacritic   = charAttributes.diacXOffset;
    }

    if (charAttributes.diacYOffset !== undefined) {
        obj.adbeIdsnYOffsetDiacritic  = charAttributes.diacYOffset;
    }

    return obj;
};
TEXT.collectParagraphAttributes = function (obj, source) {
    TEXT.getJustificationAttributes(obj, source);
    TEXT.getScalingAttributes(obj, source);
    TEXT.getSpacingAttributes(obj, source);
    TEXT.getHyphenationAttributes(obj, source);
    TEXT.getIndentationAttributes(obj, source);
    TEXT.getOtherAttributes(obj, source);
    TEXT.getTabAttributes(obj, source);
};
/////////////////////////////////////////////////////////////////////////
//// Paragraph Attributes Getters and Setters
/////////////////////////////////////////////////////////////////////////

TEXT.getOtherAttributes = function (obj, source) {

    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////

    try {
        if (source.paragraphDirection !== undefined) {
            obj.adbeIdsnParagraphDirection = source.paragraphDirection;
        }
    } catch (ignore) {}

    try {
        if (source.kashidaWidth !== undefined) {
            obj.adbeIdsnKashidaWidth = source.kashidaWidth;
        }
    } catch (ignore) {}

    try {
        if (source.composerEngine !== undefined) {
            obj.adbeIlstComposerEngine = UTIL.convertComposerEngineTypeString(source.composerEngine);
        }
    } catch (ignore) {}

    //bunriKinshi
    try {
        if (source.bunriKinshi !== undefined) {
            obj.adbeBunriKinshi = source.bunriKinshi;
        }
    } catch (ignore) {}


    try {
        //kinsokuOrder  : kinsokuOrder is kinsokuType in Id
        if (source.kinsokuOrder !== undefined) {
            obj.adbeKinsokuType = UTIL.convertKinsokuTypeString(source.kinsokuOrder);
        }
    } catch (ignore) {}

    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////

    //autoLeadingAmount
    try {
        if (source.autoLeadingAmount !== undefined) {
            obj.adbeParaAutoLeading = source.autoLeadingAmount;
        }
    } catch (ignore) {}



    //burasagariType
    try {
        if (source.burasagariType !== undefined) {
            switch (source.burasagariType) {
            case BurasagariTypeEnum.Forced.toString():
                obj.adbeIlstBurasagariType = 'BurasagariTypeEnum.Forced';
                break;
            case BurasagariTypeEnum.Standard.toString():
                obj.adbeIlstBurasagariType = 'BurasagariTypeEnum.Standard';
                break;
            case BurasagariTypeEnum.None.toString():
                obj.adbeIlstBurasagariType = 'BurasagariTypeEnum.None';
                break;
            }
        }
    } catch (ignore) {}


    //everyLineComposer
    try {
        if (source.everyLineComposer !== undefined) {
            obj.adbeIlstEveryLineComposer = source.everyLineComposer;
        }
    } catch (ignore) {}


    //leadingType
    try {
        if (source.leadingType !== undefined) {
            obj.adbeLeadingModel = source.leadingType;
        }
    } catch (ignore) {}


    //kurikaeshiMojiShori
    try {
        if (source.kurikaeshiMojiShori !== undefined) {
            obj.adbeIlstKurikaeshiMojiShori = source.kurikaeshiMojiShori;
        }
    } catch (ignore) {}

    //mojikumi
    if (source.mojikumi !== undefined) {
        obj.adbeIlstMojikumi = source.mojikumi;
    }
    //kinsoku
    if (source.kinsoku !== undefined) {
        switch (source.kinsoku) {
        case 'Hard':
            obj.adbeKinsokuSet = 'KinsokuSet.HARD_KINSOKU';
            break;
        case 'Soft':
            obj.adbeKinsokuSet = 'KinsokuSet.SOFT_KINSOKU';
            break;
        case 'None':
            obj.adbeKinsokuSet = 'KinsokuSet.NOTHING';
            break;
        }
    }

    //romanHanging
    try {
        if (source.romanHanging !== undefined) {
            obj.adbeIlstRomanHanging = source.romanHanging;
        }
    } catch (ignore) {}

};

TEXT.setOtherAttributes = function (style, source) {

    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////

    var value;

    //bunriKinshi
    if (source.adbeBunriKinshi !== undefined) {
        style.paragraphAttributes.bunriKinshi = source.adbeBunriKinshi;
    }

    //kinsokuOrder  : kinsokuOrder is kinsokuType in Id
    if (source.adbeKinsokuType !== undefined) {
        var kinsokuType = UTIL.convertKinsokuTypeString(source.adbeKinsokuType);
        switch (kinsokuType) {
        case "KinsokuOrderEnum.PUSHOUTFIRST":
            style.paragraphAttributes.kinsokuOrder = KinsokuOrderEnum.PUSHOUTFIRST;
            break;
        case "KinsokuOrderEnum.PUSHIN":
            style.paragraphAttributes.kinsokuOrder = KinsokuOrderEnum.PUSHIN;
            break;
        case "KinsokuOrderEnum.PUSHOUTONLY":
            style.paragraphAttributes.kinsokuOrder = KinsokuOrderEnum.PUSHOUTONLY;
            break;
        }
    }

    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////

    //autoLeadingAmount
    if (source.adbeParaAutoLeading !== undefined) {
        style.paragraphAttributes.autoLeadingAmount = source.adbeParaAutoLeading;
    }

    //burasagariType
    if (source.adbeIlstBurasagariType !== undefined) {
        switch (source.adbeIlstBurasagariType) {
        case 'BurasagariTypeEnum.Forced':
            style.paragraphAttributes.burasagariType = BurasagariTypeEnum.Forced;
            break;
        case 'BurasagariTypeEnum.Standard':
            style.paragraphAttributes.burasagariType = BurasagariTypeEnum.Standard;
            break;
        case 'BurasagariTypeEnum.None':
            style.paragraphAttributes.burasagariType = BurasagariTypeEnum.None;
            break;
        }
    }

    //leadingType
    if (source.adbeLeadingModel !== undefined) {
        switch (source.adbeLeadingModel) {
        case 'AutoLeadingType.BOTTOMTOBOTTOM':
            style.paragraphAttributes.leadingType = AutoLeadingType.BOTTOMTOBOTTOM;
            break;
        case 'AutoLeadingType.TOPTOTOP':
            style.paragraphAttributes.leadingType = AutoLeadingType.TOPTOTOP;
            break;
        }
    }

    //kurikaeshiMojiShori
    if (source.adbeIlstKurikaeshiMojiShori !== undefined) {
        style.paragraphAttributes.kurikaeshiMojiShori = source.adbeIlstKurikaeshiMojiShori;
    }
    //kinsoku
    if (source.adbeKinsokuSet !== undefined) {
        switch (source.adbeKinsokuSet) {
        case 'KinsokuSet.HARD_KINSOKU':
            style.paragraphAttributes.kinsoku = 'Hard';
            break;
        case 'KinsokuSet.SOFT_KINSOKU':
            style.paragraphAttributes.kinsoku = 'Soft';
            break;
        case 'KinsokuSet.NOTHING':
            style.paragraphAttributes.kinsoku = 'None';
            break;
        }
    }
    //mojikumi
    if (source.adbeIlstMojikumi !== undefined) {
        style.paragraphAttributes.mojikumi = source.adbeIlstMojikumi;
    }
    //romanHanging
    if (source.adbeIlstRomanHanging !== undefined) {
        style.paragraphAttributes.romanHanging = source.adbeIlstRomanHanging;
    }

    if (source.adbeIdsnKashidaWidth !== undefined) {
        value = source.adbeIdsnKashidaWidth.split('.', 2)[1];
        style.paragraphAttributes.kashidaWidth = KashidaWidthType[value];
    }

    if (source.adbeIlstComposerEngine !== undefined) {
        value = UTIL.convertComposerEngineTypeString(source.adbeIlstComposerEngine);
        style.paragraphAttributes.composerEngine = value;
    }
        //everyLineComposer
    if (source.adbeIlstEveryLineComposer !== undefined) {
        style.paragraphAttributes.everyLineComposer = source.adbeIlstEveryLineComposer;
    }
};



TEXT.getScalingAttributes = function (obj, source) {
    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////
    try {
        //minimumGlyphScaling
        if (source.minimumGlyphScaling !== undefined) {
            obj.adbeMinimumGlyphScaling = source.minimumGlyphScaling;
        }
    } catch (ignore) {}

    try {
        //desiredGlyphScaling
        if (source.desiredGlyphScaling !== undefined) {
            obj.adbeDesiredGlyphScaling = source.desiredGlyphScaling;
        }
    } catch (ignore) {}

    try {
        //maximumGlyphScaling
        if (source.maximumGlyphScaling !== undefined) {
            obj.adbeMaximumGlyphScaling = source.maximumGlyphScaling;
        }
    } catch (ignore) {}



    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////
};
TEXT.setScalingAttributes = function (style, source) {
    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////

    //minimumGlyphScaling
    if (source.adbeMinimumGlyphScaling !== undefined) {
        style.paragraphAttributes.minimumGlyphScaling = source.adbeMinimumGlyphScaling;
    }

    //maximumGlyphScaling
    if (source.adbeMaximumGlyphScaling !== undefined) {
        style.paragraphAttributes.maximumGlyphScaling = source.adbeMaximumGlyphScaling;
    }
    //desiredGlyphScaling
    if (source.adbeDesiredGlyphScaling !== undefined) {
        style.paragraphAttributes.desiredGlyphScaling = source.adbeDesiredGlyphScaling;
    }


    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////
};



TEXT.getSpacingAttributes = function (obj, source) {
    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////

    try {
        //minimumWordSpacing
        if (source.minimumWordSpacing !== undefined) {
            obj.adbeMinimumWordSpacing = source.minimumWordSpacing;
        }
    } catch (ignore) {}

    try {
        //desiredWordSpacing
        if (source.desiredWordSpacing !== undefined) {
            obj.adbeDesiredWordSpacing = source.desiredWordSpacing;
        }
    } catch (ignore) {}

    try {
        //maximumWordSpacing
        if (source.maximumWordSpacing !== undefined) {
            obj.adbeMaximumWordSpacing = source.maximumWordSpacing;
        }
    } catch (ignore) {}

    try {
        //minimumLetterSpacing
        if (source.minimumLetterSpacing !== undefined) {
            obj.adbeMinimumLetterSpacing = source.minimumLetterSpacing;
        }
    } catch (ignore) {}

    try {
        //desiredLetterSpacing
        if (source.desiredLetterSpacing !== undefined) {
            obj.adbeDesiredLetterSpacing = source.desiredLetterSpacing;
        }
    } catch (ignore) {}

    try {
        //maximumLetterSpacing
        if (source.maximumLetterSpacing !== undefined) {
            obj.adbeMaximumLetterSpacing = source.maximumLetterSpacing;
        }
    } catch (ignore) {}



    try {
        //spaceAfter
        if (source.spaceAfter !== undefined) {
            obj.adbeSpaceAfter = {
                type: 'pt',
                value: source.spaceAfter
            };
        }
    } catch (ignore) {}

    try {
        //spaceBefore
        if (source.spaceBefore !== undefined) {
            obj.adbeSpaceBefore = {
                type: 'pt',
                value: source.spaceBefore
            };
        }
    } catch (ignore) {}



    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////
};
TEXT.setSpacingAttributes = function (style, source) {
    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////


    //maximumWordSpacing
    if (source.adbeMaximumWordSpacing !== undefined) {
        style.paragraphAttributes.maximumWordSpacing = source.adbeMaximumWordSpacing;
    }
    //minimumWordSpacing
    if (source.adbeMinimumWordSpacing !== undefined) {
        style.paragraphAttributes.minimumWordSpacing = source.adbeMinimumWordSpacing;
    }
    //desiredWordSpacing
    if (source.adbeDesiredWordSpacing !== undefined) {
        style.paragraphAttributes.desiredWordSpacing = source.adbeDesiredWordSpacing;
    }



    //maximumLetterSpacing
    if (source.adbeMaximumLetterSpacing !== undefined) {
        style.paragraphAttributes.maximumLetterSpacing = source.adbeMaximumLetterSpacing;
    }
    //minimumLetterSpacing
    if (source.adbeMinimumLetterSpacing !== undefined) {
        style.paragraphAttributes.minimumLetterSpacing = source.adbeMinimumLetterSpacing;
    }
    //desiredLetterSpacing
    if (source.adbeDesiredLetterSpacing !== undefined) {
        style.paragraphAttributes.desiredLetterSpacing = source.adbeDesiredLetterSpacing;
    }




    //spaceAfter
    if (source.adbeSpaceAfter !== undefined) {
        var spaceAfter = new UnitValue(source.adbeSpaceAfter.value, source.adbeSpaceAfter.type);
        style.paragraphAttributes.spaceAfter = spaceAfter.as('pt');
    }

    //spaceBefore
    if (source.adbeSpaceBefore !== undefined) {
        var spaceBefore = new UnitValue(source.adbeSpaceBefore.value, source.adbeSpaceBefore.type);
        style.paragraphAttributes.spaceBefore = spaceBefore.as('pt');
    }

    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////
};



TEXT.getHyphenationAttributes = function (obj, source) {

    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////
    try {
        //hyphenation
        if (source.hyphenation !== undefined) {
            obj.adbeHyphenation = source.hyphenation;
        }
    } catch (ignore) {}


    //hyphenationZone
    if (source.hyphenationZone !== undefined) {
        obj.adbeHyphenationZone = {
            type: 'pt',
            value: source.hyphenationZone
        };
    }

    //hyphenateCapitalizedWords
    if (source.hyphenateCapitalizedWords !== undefined) {
        obj.adbeHyphenateCapitalizedWords = source.hyphenateCapitalizedWords;
    }

    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////


    try {
        //hyphenationPreference
        if (source.hyphenationPreference !== undefined) {
            obj.adbeHyphenWeight = source.hyphenationPreference * 100; // to make it 0-100 as ID
        }
    } catch (ignore) {}



    try {
        //maximumConsecutiveHyphens
        if (source.maximumConsecutiveHyphens !== undefined) {
            obj.adbeHyphenateLimit = source.maximumConsecutiveHyphens;
        }
    } catch (ignore) {}


    try {
        //minimumAfterHyphen
        if (source.minimumAfterHyphen !== undefined) {
            obj.adbeHyphenateAfterFirst = source.minimumAfterHyphen;
        }
    } catch (ignore) {}


    try {
        //minimumBeforeHyphen
        if (source.minimumBeforeHyphen !== undefined) {
            obj.adbeHyphenateBeforeLast = source.minimumBeforeHyphen;
        }
    } catch (ignore) {}


    try {
        //minimumHyphenatedWordSize
        if (source.minimumHyphenatedWordSize !== undefined) {
            obj.adbeHyphenateWordsLongerThan = source.minimumHyphenatedWordSize;
        }
    } catch (ignore) {}
};
TEXT.setHyphenationAttributes = function (style, source) {

    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////

    //hyphenation
    if (source.adbeHyphenation !== undefined) {
        style.paragraphAttributes.hyphenation = source.adbeHyphenation;
    }

    //hyphenationZone
    if (source.adbeHyphenationZone !== undefined) {
        var hyphenationZone = new UnitValue(source.adbeHyphenationZone.value, source.adbeHyphenationZone.type);
        style.paragraphAttributes.hyphenationZone = hyphenationZone.as('pt');
    }
    //hyphenateCapitalizedWords
    if (source.adbeHyphenateCapitalizedWords !== undefined) {
        style.paragraphAttributes.hyphenateCapitalizedWords = source.adbeHyphenateCapitalizedWords;
    }
    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////

    //hyphenationPreference
    if (source.adbeHyphenWeight !== undefined) {
        style.paragraphAttributes.hyphenationPreference = source.adbeHyphenWeight / 100; // to make it 0-100 as ID
    }


    //maximumConsecutiveHyphens
    if (source.adbeHyphenateLimit !== undefined) {
        style.paragraphAttributes.maximumConsecutiveHyphens = source.adbeHyphenateLimit;
    }
    //minimumAfterHyphen
    if (source.adbeHyphenateAfterFirst !== undefined) {
        style.paragraphAttributes.minimumAfterHyphen = source.adbeHyphenateAfterFirst;
    }

    //minimumBeforeHyphen
    if (source.adbeHyphenateBeforeLast !== undefined) {
        style.paragraphAttributes.minimumBeforeHyphen = source.adbeHyphenateBeforeLast;
    }

    //minimumHyphenatedWordSize
    if (source.adbeHyphenateWordsLongerThan !== undefined) {
        style.paragraphAttributes.minimumHyphenatedWordSize = source.adbeHyphenateWordsLongerThan;
    }
};



TEXT.getJustificationAttributes = function (obj, source) {

    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////


    try {
        //justification
        if (source.justification !== undefined) {
            obj.adbeParaAlignment = UTIL.convertJustificationString(source.justification, false);
        }
    } catch (ignore) {}


    try {
        //singleWordJustification
        if (source.singleWordJustification !== undefined) {
            var justStr = source.singleWordJustification;
            obj.adbeSingleWordJustification = UTIL.convertJustificationString(justStr, true);
        }
    } catch (ignore) {}


    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////
};
TEXT.setJustificationAttributes = function (style, source) {

    var value;

    if (source.adbeIdsnParagraphDirection !== undefined) {
        value = source.adbeIdsnParagraphDirection.split('.', 2)[1];
        style.paragraphAttributes.paragraphDirection = ParagraphDirectionType[value];
    }
    //justification
    if (source.adbeParaAlignment !== undefined) {
        switch (UTIL.convertJustificationString(source.adbeParaAlignment, false)) {
        case 'CENTER':
            style.paragraphAttributes.justification = Justification.CENTER;
            break;
        case 'LEFT':
            style.paragraphAttributes.justification = Justification.LEFT;
            break;
        case 'RIGHT':
            style.paragraphAttributes.justification = Justification.RIGHT;
            break;
        case 'FULLJUSTIFY':
            style.paragraphAttributes.justification = Justification.FULLJUSTIFY;
            break;
        case 'FULLJUSTIFYLASTLINECENTER':
            style.paragraphAttributes.justification = Justification.FULLJUSTIFYLASTLINECENTER;
            break;
        case 'FULLJUSTIFYLASTLINELEFT':
            style.paragraphAttributes.justification = Justification.FULLJUSTIFYLASTLINELEFT;
            break;
        case 'FULLJUSTIFYLASTLINERIGHT':
            style.paragraphAttributes.justification = Justification.FULLJUSTIFYLASTLINERIGHT;
            break;
        default:
            break;
        }
    }
    //singleWordJustification
    if (source.adbeSingleWordJustification !== undefined) {
        switch (UTIL.convertJustificationString(source.adbeSingleWordJustification, true)) {
        case 'CENTER':
            style.paragraphAttributes.singleWordJustification = Justification.CENTER;
            break;
        case 'LEFT':
            style.paragraphAttributes.singleWordJustification = Justification.LEFT;
            break;
        case 'RIGHT':
            style.paragraphAttributes.singleWordJustification = Justification.RIGHT;
            break;
        case 'FULLJUSTIFY':
            style.paragraphAttributes.singleWordJustification = Justification.FULLJUSTIFY;
            break;
        case 'FULLJUSTIFYLASTLINECENTER':
            style.paragraphAttributes.singleWordJustification = Justification.FULLJUSTIFYLASTLINECENTER;
            break;
        case 'FULLJUSTIFYLASTLINELEFT':
            style.paragraphAttributes.singleWordJustification = Justification.FULLJUSTIFYLASTLINELEFT;
            break;
        case 'FULLJUSTIFYLASTLINERIGHT':
            style.paragraphAttributes.singleWordJustification = Justification.FULLJUSTIFYLASTLINERIGHT;
            break;
        default:
            break;
        }
    }
};



TEXT.getIndentationAttributes = function (obj, source) {

    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////
    try {
        //firstLineIndent
        if (source.firstLineIndent !== undefined) {
            obj.adbeFirstLineIndent = {
                type: 'pt',
                value: source.firstLineIndent
            };
        }
    } catch (ignore) {}

    try {
        //leftIndent
        if (source.leftIndent !== undefined) {
            obj.adbeLeftIndent = {
                type: 'pt',
                value: source.leftIndent
            };
        }
    } catch (ignore) {}

    try {
        //rightIndent
        if (source.rightIndent !== undefined) {
            obj.adbeRightIndent = {
                type: 'pt',
                value: source.rightIndent
            };
        }
    } catch (ignore) {}

    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////
};
TEXT.setIndentationAttributes = function (style, source) {

    ///////////////////////////////
    ////    Common Attributes
    ///////////////////////////////

    //firstLineIndent
    if (source.adbeFirstLineIndent !== undefined) {
        var firstLineIndent = new UnitValue(source.adbeFirstLineIndent.value, source.adbeFirstLineIndent.type);
        style.paragraphAttributes.firstLineIndent = firstLineIndent.as('pt');
    }
    //leftIndent
    if (source.adbeLeftIndent !== undefined) {
        var leftIndent = new UnitValue(source.adbeLeftIndent.value, source.adbeLeftIndent.type);
        style.paragraphAttributes.leftIndent = leftIndent.as('pt');
    }
    //rightIndent
    if (source.adbeRightIndent !== undefined) {
        var rightIndent = new UnitValue(source.adbeRightIndent.value, source.adbeRightIndent.type);
        style.paragraphAttributes.rightIndent = rightIndent.as('pt');
    }

    ///////////////////////////////
    ////    Ai Specific Attributes
    ///////////////////////////////
};

TEXT.captureText = function (responseJsonData) {
    var textInfo = {};
    try {
        textInfo = JSON.parse(responseJsonData);
        var stylesMap = textInfo.styles;
        var styleItem, styleItemKey;
        var styleItemValue;
        var newStyleItemValue;
        var styleType;
        for (styleItemKey in stylesMap) {
            if (stylesMap.hasOwnProperty(styleItemKey)) {
                styleItem = stylesMap[styleItemKey];
                newStyleItemValue = {};
                styleType = styleItem.type;
                styleItemValue = styleItem.value;
                delete styleItemValue.styleName;
                TEXT.collectCharacterAttributes(newStyleItemValue, styleItemValue);
                if (styleType === 'application/vnd.adobe.paragraphstyle+json') {
                    TEXT.collectParagraphAttributes(newStyleItemValue, styleItemValue);
                }
                styleItem.value = newStyleItemValue;
            }
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('TEXT.captureText->failed creating json info', ex);
        return {};
    }
    return textInfo;
};

TEXT.getTextInfo = function () {
    var textObj = {};
    var topObject;
    var appSelection = app.activeDocument.selection;
    // 1. If a text range is selected, appSelection represents the selected text range
    // 2. If a single text frame is selected, appSelection represents an array of length 1
    // 3. If multiple objects are selected, appSelection represents an array of length > 1

    if (appSelection.__class__ === 'TextRange') {
        topObject = appSelection;
    } else if (appSelection.__class__ === 'Array') {
        if (appSelection.length === 1 && appSelection[0].__class__ === 'TextFrame') {
            topObject = appSelection[0].textRange;
        }
    }

    if (topObject) {
        // At this point, topObject represents the selected text range
        // We now create an ai file with this text range
        var basePath = Folder.temp.fsName + '/TextPreview' + $.hiresTimer;
        var aiPath = basePath + '.ai';
        var pngPath = basePath + '.png';
        var primaryAiFile = new File(aiPath);
        var pngFile = new File(pngPath);
        var responseJsonData = app.sendScriptMessage("Design Library", "Get Add Text JSON", basePath);
        if (primaryAiFile.exists) {
            var textInfo = TEXT.captureText(responseJsonData);
            if (!TEXT.isEmptyObject(textInfo)) {
                textObj.primaryRepresentation = {};
                textObj.primaryRepresentation.filePath = aiPath;
                textObj.primaryRepresentation.isFile = true;
                textObj.primaryRepresentation.representationType = 'application/illustrator-text';
                textObj.textInfo = textInfo;
                if (pngFile.exists) {
                    textObj.previewPath = pngPath;
                }
            } else {
                $._ADBE_LIBS_CORE.writeToLog('TEXT.getTextInfo->failed creating text info');
            }
        }

        //******************TEMP CHANGES TO BE REMOVED*************
        //** write to file
        //var txtFile = "C:/Users/anmurark/Desktop/Trash/test.txt";
        //var file = new File(txtFile);
        //file.open("w"); // open file with write access
        //file.write(JSON.stringify(textObj, null, "\t"));
        //file.close();
    }
    return textObj;
};

/* Applies the style over the entire textRange */
TEXT.applyStyle = function (textRange, style) {
    var paragraphStyle;
    var characterStyle;
    if (style.type === PARASTYLE_REPRESENTATION_JSON_TYPE) {
        if (style.name === undefined) {
            try {
                TEXT.addCharacterAttributesToStyle(textRange, style.value);
            } catch (ex0) {
                $._ADBE_LIBS_CORE.writeToLog('setText ->addCharacterAttributesToStyle( paragraph override)', ex0);
            }
            try {
                //adding paragraph attributes to style
                TEXT.setJustificationAttributes(textRange, style.value);
                TEXT.setScalingAttributes(textRange, style.value);
                TEXT.setSpacingAttributes(textRange, style.value);
                TEXT.setHyphenationAttributes(textRange, style.value);
                TEXT.setIndentationAttributes(textRange, style.value);
                TEXT.setOtherAttributes(textRange, style.value);
                TEXT.setTabAttributes(textRange, style.value);
            } catch (ex1) {
                $._ADBE_LIBS_CORE.writeToLog('setText  ->adding paragraph attributes to style (Override)', ex1);
            }
        } else {
            try {
                paragraphStyle = TEXT.addParagraphStyleToAI(style.name, style.value);
                if (paragraphStyle !== null) {
                    paragraphStyle.applyTo(textRange, true);
                }
            } catch (ex2) {
                $._ADBE_LIBS_CORE.writeToLog('setText  ->adding paragraph attributes to style', ex2);
            }
        }
    } else if (style.type === CHARSTYLE_REPRESENTATION_JSON_TYPE) {
        if (style.name === undefined) {
            try {
                TEXT.addCharacterAttributesToStyle(textRange, style.value);
            } catch (ex3) {
                $._ADBE_LIBS_CORE.writeToLog('setText ->addCharacterAttributesToStyle (Override)', ex3);
            }
        } else {
            try {
                characterStyle = TEXT.addCharacterStyleToAI(style.name, style.value);
                if (characterStyle !== null) {
                    characterStyle.applyTo(textRange, true);
                }
            } catch (ex4) {
                $._ADBE_LIBS_CORE.writeToLog('setText ->addCharacterAttributesToStyle', ex4);
            }
        }
    }
};

TEXT.getUpdatedTextInfo = function (aiFilePath) {
    var data = {};
    data.isValidSave = false;
    data.textData = {};
    var responseJsonData = app.sendScriptMessage("Design Library", "Get Edited Text JSON", aiFilePath);
    var textInfo = TEXT.captureText(responseJsonData);
    if (!TEXT.isEmptyObject(textInfo)) {
        data.textData.textInfo = textInfo;
        data.isValidSave = true;
    }
    return data;
};

TEXT.setText = function (textData, object) {
    try {
        if (!object) {
            object = app.selection;
        }
        var handled = false;
        if (object) {
            if (object.length > 0 && object[0]) {
                object = object[0];
            }
            if (object.__class__ === "TextFrame") {
                object = object.textRange;
            }
            if (object.__class__ === "TextRange") {
                var styles = textData.styles;
                var style;
                var paraStyles;
                var paraStyleNum;
                var paraStyleIndex;
                var paragraphs = textData.paragraphs;
                var numParagraphs = paragraphs.length;
                var paraIndex;
                var styleInfo;
                var numStyleInfo;
                var styleInfoIndex;
                var runs;
                var numRuns;
                var runIndex;
                var styleInfoIterator;
                var originalRangeStart = object.end;
                var paraRangeStart;
                var runRangeStart;
                var runRangeEnd;
                for (paraIndex = 0; paraIndex < numParagraphs; paraIndex++) {
                    if (paragraphs[paraIndex].text.length === 0) {
                        object.paragraphs.add("\r");
                    } else {
                        object.paragraphs.add(paragraphs[paraIndex].text);
                    }
                }
                var originalRangeEnd = object.end;
                for (paraIndex = 0; paraIndex < numParagraphs; paraIndex++) {
                    paraStyles = paragraphs[paraIndex].styles;
                    paraStyleNum = paraStyles.length;
                    /* Runs a loop over the styles applicable over entire para and calls to add them */
                    for (paraStyleIndex = 0; paraStyleIndex < paraStyleNum; paraStyleIndex++) {
                        try {
                            TEXT.applyStyle(object.paragraphs[paraIndex], styles[paraStyles[paraStyleIndex]]);
                        } catch (ignore) {}
                    }
                    paraRangeStart = object.paragraphs[paraIndex].start;
                    runs = paragraphs[paraIndex].runs;
                    numRuns = runs.length;
                    /* Adding styles to individual runs */
                    for (runIndex = 0; runIndex < numRuns; runIndex++) {
                        styleInfo = runs[runIndex].styles;
                        numStyleInfo = styleInfo.length;
                        runRangeStart = paraRangeStart + runs[runIndex].from;
                        runRangeEnd = paraRangeStart + runs[runIndex].to;
                        object.start = runRangeStart;
                        object.end = runRangeEnd;
                        for (styleInfoIndex = 0; styleInfoIndex < numStyleInfo; styleInfoIndex++) {
                            try {
                                styleInfoIterator = styleInfo[styleInfoIndex];
                                style = styles[styleInfoIterator];
                                TEXT.applyStyle(object, style);
                            } catch (ignore) {}

                        }
                    }
                    object.start = originalRangeStart;
                    object.end = originalRangeEnd;
                }
                handled = true;
            }
        }
        if (!handled) {
            alert('To be implemented');
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-setText()', ex);
    }
};

TEXT.getAiFileForText = function (data) {
    var myDocument;
    try {
        myDocument = app.documents.addDocumentNoUI();
        var myPathItem1 = myDocument.pathItems.rectangle(244, 64, 82, 76);
        var myTextFrame1 = myDocument.textFrames.areaText(myPathItem1);
        if (data.adbeIdsnTextDirection !== undefined) {
            if (data.adbeIdsnTextDirection === "VERTICAL_TYPE") {
                myTextFrame1.orientation = TextOrientation.VERTICAL;
            }
        }
        TEXT.setText(data, myTextFrame1);

        var basePath = Folder.temp.fsName + '/TempAI' + $.hiresTimer;
        var aiPath = basePath + '.ai';
        var exportPresetFile = new File(aiPath);
        myDocument.saveNoUI(exportPresetFile);
        myDocument.closeNoUI();

        var aiFile = new File(aiPath);
        if (aiFile.exists) {
            return aiPath;
        }
    } catch (ex) {
        $._ADBE_LIBS_CORE.writeToLog('ILST.jsx-getAiFileForText()', ex);
        if (myDocument) {
            myDocument.closeNoUI();
        }
    }

    return "";
};


TEXT.getTabAttributes = function (obj, source) {
    try {
        if (source.tabStops !== undefined) {
            obj.adbeTabStops = [];
            var tabStops = source.tabStops;
            var tabStop;
            var tabStopObj = {};
            var i;
            for (i = 0; i < tabStops.length; ++i) {
                tabStop = tabStops[i];
                tabStopObj = {};
                tabStopObj.adbeTabAlignment = UTIL.convertTabAlignmentTypeString(tabStop.alignment);
                tabStopObj.adbeTabAlignmentChar = tabStop.alignmentCharacter;
                tabStopObj.adbeTabLeader = tabStop.leader;

                tabStopObj.adbeTabPosition = {
                    type: 'pt',
                    value: tabStop.position
                };
                obj.adbeTabStops.push(tabStopObj);
            }
            if (obj.adbeTabStops.length === 0) {
                delete obj.adbeTabStops;
            }
        }
    } catch (ignore) {}
};

TEXT.setTabAttributes = function (style, source) {
    try {
        if (source.adbeTabStops !== undefined) {
            var tabStops = source.adbeTabStops;
            var tabStopInfo = [];
            var tab;
            for (tab = 0; tab < tabStops.length; ++tab) {
                tabStopInfo[tab] = new TabStopInfo();
                tabStopInfo[tab].position = tabStops[tab].adbeTabPosition.value;
                tabStopInfo[tab].decimalCharacter = tabStops[tab].adbeTabAlignmentChar;
                tabStopInfo[tab].alignment = UTIL.convertTabAlignmentTypeString(tabStops[tab].adbeTabAlignment);
                if (tabStops[tab].adbeTabLeader !== undefined && tabStops[tab].adbeTabLeader !== "") {
                    tabStopInfo[tab].leader = tabStops[tab].adbeTabLeader;
                }
            }
            style.paragraphAttributes.tabStops = tabStopInfo;
        }
    } catch (ignore) {}
};
