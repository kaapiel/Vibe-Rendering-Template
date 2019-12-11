/*global $, TabStopAlignment, ComposerEngineType, app */
var UTIL = {};
UTIL.getArtboardPosition = function getArtboardPosition(artBoardRect, position, difference) {
    'use strict';
    return [artBoardRect[0] + position[0] - difference.left, artBoardRect[1] + difference.top - position[1]];
};
UTIL.getRealPosition = function getRealPosition(artBoardRect, position) {
    'use strict';
    var realPosition = {};
    realPosition.left = position[0] - artBoardRect[0];
    realPosition.top = artBoardRect[1] - position[1];
    return realPosition;
};
UTIL.convertJustificationString = function (justificationStr, isSingleWord) {
    'use strict';
    //converts Paragraph Justification to Id specific String ,, and vice versa 
    var prefix = 'Alignment.';
    if (isSingleWord) {
        prefix = 'Justification.';
    }
    switch (justificationStr) {
        //Justification is of form Alignment.<Id Specific Justification>
        //converting it to Ai's Justification Specific String
    case 'Alignment.LEFT_ALIGN':
        return 'LEFT';
    case 'Alignment.CENTER_ALIGN':
        return 'CENTER';
    case 'Alignment.RIGHT_ALIGN':
        return 'RIGHT';
    case 'Alignment.LEFT_JUSTIFIED':
        return 'FULLJUSTIFYLASTLINELEFT';
    case 'Alignment.CENTER_JUSTIFIED':
        return 'FULLJUSTIFYLASTLINECENTER';
    case 'Alignment.RIGHT_JUSTIFIED':
        return 'FULLJUSTIFYLASTLINERIGHT';
    case 'Alignment.FULLY_JUSTIFIED':
        return 'FULLJUSTIFY';
    case 'Justification.LEFT_ALIGN':
        return 'LEFT';
    case 'Justification.CENTER_ALIGN':
        return 'CENTER';
    case 'Justification.RIGHT_ALIGN':
        return 'RIGHT';
    case 'Justification.LEFT_JUSTIFIED':
        return 'FULLJUSTIFYLASTLINELEFT';
    case 'Justification.CENTER_JUSTIFIED':
        return 'FULLJUSTIFYLASTLINECENTER';
    case 'Justification.RIGHT_JUSTIFIED':
        return 'FULLJUSTIFYLASTLINERIGHT';
    case 'Justification.FULLY_JUSTIFIED':
        return 'FULLJUSTIFY';
        //Converting Ai Specific Justfication to Id's adbeParaAlignment parameter 
    case 'Justification.LEFT':
        return prefix + 'LEFT_ALIGN';
    case 'Justification.CENTER':
        return prefix + 'CENTER_ALIGN';
    case 'Justification.RIGHT':
        return prefix + 'RIGHT_ALIGN';
    case 'Justification.FULLJUSTIFYLASTLINELEFT':
        return prefix + 'LEFT_JUSTIFIED';
    case 'Justification.FULLJUSTIFYLASTLINECENTER':
        return prefix + 'CENTER_JUSTIFIED';
    case 'Justification.FULLJUSTIFYLASTLINERIGHT':
        return prefix + 'RIGHT_JUSTIFIED';
    case 'Justification.FULLJUSTIFY':
        return prefix + 'FULLY_JUSTIFIED';


    default:
        return '';
    }

};
UTIL.convertKinsokuTypeString = function (kinsokuStr) {
    'use strict';
    switch (kinsokuStr) {
    case 'KinsokuType.KINSOKU_PUSH_IN_FIRST':
        return 'KinsokuOrderEnum.PUSHIN';
    case 'KinsokuType.KINSOKU_PUSH_OUT_FIRST':
        return 'KinsokuOrderEnum.PUSHOUTFIRST';
    case 'KinsokuType.KINSOKU_PUSH_OUT_ONLY':
        return 'KinsokuOrderEnum.PUSHOUTONLY';
    case 'KinsokuOrderEnum.PUSHIN':
        return 'KinsokuType.KINSOKU_PUSH_IN_FIRST';
    case 'KinsokuOrderEnum.PUSHOUTONLY':
        return 'KinsokuType.KINSOKU_PUSH_OUT_ONLY';
    case 'KinsokuOrderEnum.PUSHOUTFIRST':
        return 'KinsokuType.KINSOKU_PUSH_OUT_FIRST';
    default:
        return '';
    }
};
UTIL.convertTabAlignmentTypeString = function (TabAlignmentStr) {
    'use strict';
    var prefix = 'TabStopAlignment.';
    switch (TabAlignmentStr) {
    case 'TabStopAlignment.LEFT_ALIGN':
        return TabStopAlignment.Left;
    case 'TabStopAlignment.RIGHT_ALIGN':
        return TabStopAlignment.Right;
    case 'TabStopAlignment.CENTER_ALIGN':
        return TabStopAlignment.Center;
    case 'TabStopAlignment.CHARACTER_ALIGN':
        return TabStopAlignment.Decimal;
    case 'TabType.Left':
        return prefix + 'LEFT_ALIGN';
    case 'TabType.Right':
        return prefix + 'RIGHT_ALIGN';
    case 'TabType.Center':
        return prefix + 'CENTER_ALIGN';
    case 'TabType.Decimal':
        return prefix + 'CHARACTER_ALIGN';
    default:
        return '';
    }
};

UTIL.convertComposerEngineTypeString = function (composerEngineTypeStr) {
    'use strict';
    var prefix = 'ComposerType.';
    switch (composerEngineTypeStr) {
    case 'ComposerType.WorldReady':
        return ComposerEngineType.optycaComposer;
    case 'ComposerType.Japanese':
    case 'ComposerType.Adobe':
        return ComposerEngineType.latinCJKComposer;
    case 'ComposerEngineType.optycaComposer':
        return prefix + 'WorldReady';
    case 'ComposerEngineType.latinCJKComposer':
        if (app.preferences.getBooleanPreference('showAsianTextOptions') === true) {
            return prefix + 'Japanese';
        }
        return prefix + 'Adobe';
    default:
        return '';
    }
};
/*
UTIL.convertUnitsToPoints = function (unitType, unitValue) {
    'use strict';
    if (unitType === RulerUnits.Points) {
        return unitValue;
    }

    var pointsValue = unitValue;
    switch (unitType) {
    case RulerUnits.Qs:
        pointsValue = pointsValue * 0.7086614173228346;
        break;
    case RulerUnits.Millimeters:
        pointsValue = (pointsValue * 72.0) / 25.4;
        break;
    case RulerUnits.Picas:
        pointsValue = pointsValue * 12.0;
        break;
    case RulerUnits.Inches:
        pointsValue = pointsValue * 72.0;
        break;
    case RulerUnits.Centimeters:
        pointsValue = (pointsValue * 72.0) / 2.54;
        break;
    case RulerUnits.Pixels:
        //No conversion required
        break;
    default:
        break;
    }
    return pointsValue;
};*/