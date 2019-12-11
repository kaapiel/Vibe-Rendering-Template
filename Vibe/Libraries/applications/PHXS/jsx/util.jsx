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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File, sTID,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions, ReferenceFormType, DescValueType,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, TEXT, COLOR, BRUSH, PSClass, PSEnum, PSType, PSForm, PSUnit, PSString, PSKey, PSEvent, getSelectedLayerIndices */
var UTIL = {};

UTIL.unitToString = function (key) {
    if (key === PSUnit.Points) {
        return 'pt';
    }

    if (key === PSUnit.Pixels) {
        return 'px';
    }

    if (key === PSUnit.Millimeters) {
        return 'mm';
    }

    if (key === PSUnit.Angle) {
        return 'ang';
    }

    if (key === PSUnit.Percent) {
        return '%';
    }

    return '';
};

UTIL.stringToUnit = function (key) {
    if (key === 'pt') {
        return PSUnit.Points;
    }

    if (key === 'px') {
        return PSUnit.Pixels;
    }

    if (key === 'mm') {
        return PSUnit.Millimeters;
    }

    if (key === 'ang') {
        return PSUnit.Angle;
    }

    if (key === '%') {
        return PSUnit.Percent;
    }

    return PSUnit.Pixels; // fallback to something that won't fail completely
};


UTIL.idToConstant = function (id, idObject) {
    var attr;
    for (attr in idObject) {
        if (idObject.hasOwnProperty(attr)) {
            if (idObject[attr] === id) {
                return attr;
            }
        }
    }
};

UTIL.selectLayerByIndex = function (layerIndex, addToSelection) {
    var layerIndexRef = new ActionReference();
    layerIndexRef.putIndex(PSKey.LayerKey, layerIndex);

    var selectDesc = new ActionDescriptor();
    selectDesc.putReference(PSKey.Target, layerIndexRef);

    if (addToSelection) {
        selectDesc.putEnumerated(PSKey.SelectionModifier, PSKey.SelectionModifierType, PSKey.AddToSelection);
    }

    executeAction(PSKey.Select, selectDesc, DialogModes.NO);
};

function getPropertyFromDesc(propertykey, desc) {
    if (desc && desc.hasKey(propertykey)) {
        switch (desc.getType(propertykey)) {
            // Add handling of new types here as needed
        case DescValueType.OBJECTTYPE:
            return desc.getObjectValue(propertykey);
        case DescValueType.BOOLEANTYPE:
            return desc.getBoolean(propertykey);
        case DescValueType.LISTTYPE:
            return desc.getList(propertykey);
        }
    }
    return undefined;
}

UTIL.getAppProperty = function (propertyKey, argsDesc) {
    // Use the passed in desc if provided so the caller can supply additional params
    if (!argsDesc) {
        argsDesc = new ActionDescriptor();
    }

    var ref = new ActionReference();
    ref.putProperty(PSClass.Property, propertyKey);
    ref.putEnumerated(PSClass.Application, PSType.Ordinal, PSEnum.Target);
    argsDesc.putReference(PSKey.Target, ref);
    var appDesc = executeAction(PSKey.Get, argsDesc, DialogModes.NO);
    return getPropertyFromDesc(propertyKey, appDesc);
};

UTIL.getLayerProperty = function (propertyKey, argsDesc) {
    // Use the passed in desc if provided so the caller can supply additional params
    if (!argsDesc) {
        argsDesc = new ActionDescriptor();
    }

    var ref = new ActionReference();
    ref.putProperty(PSClass.Property, propertyKey);
    ref.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
    argsDesc.putReference(PSKey.Target, ref);
    var layerDesc = executeAction(PSKey.Get, argsDesc, DialogModes.NO);

    return getPropertyFromDesc(propertyKey, layerDesc);
};

// Selects each layer one at a time, calling aFunction for each, and then
// restores the original selection.
UTIL.forEachSelectedLayer = function (aFunction) {
    if (typeof aFunction !== 'function') {
        return;
    }

    var index, layerIndex;
    var layerIndexes = getSelectedLayerIndices();

    for (index = 0; index < layerIndexes.length; ++index) {
        layerIndex = layerIndexes[index];
        UTIL.selectLayerByIndex(layerIndex);

        try {
            aFunction();
        } catch (ignore) {
            // eat exception to ensure we reset the original layer selection below.
        }
    }

    for (index = 0; index < layerIndexes.length - 1; ++index) {
        UTIL.selectLayerByIndex(layerIndexes[index], true);
    }
};

ActionDescriptor.prototype.eraseIfExists = function (key) {
    if (this.hasKey(key)) {
        this.erase(key);
    }
};

// Deep copy ActionReference
ActionReference.prototype.copy = function () {
    var r = new ActionReference();
    var c = this.getDesiredClass();

    switch (this.getForm()) {
    case ReferenceFormType.ENUMERATED:
        r.putEnumerated(c, this.getEnumeratedType(), this.getEnumeratedValue());
        break;
    case ReferenceFormType.CLASSTYPE:
        r.putClass(c);
        break;
    case ReferenceFormType.IDENTIFIER:
        r.putIdentifier(c, this.getIdentifier());
        break;
    case ReferenceFormType.INDEX:
        r.putIndex(c, this.getIndex());
        break;
    case ReferenceFormType.NAME:
        r.putName(c, this.getName());
        break;
    case ReferenceFormType.OFFSET:
        r.putOffset(c, this.getOffset());
        break;
    case ReferenceFormType.PROPERTY:
        r.putProperty(c, this.getProperty());
        break;
        // Container???
    default:
        $.writeln("Unknown ref type");
        break;
    }
    return r;
};

// Deep copy ActionDescriptor
ActionDescriptor.prototype.copy = function () {
    var key, i, r = new ActionDescriptor();
    for (i = 0; i < this.count; ++i) {
        key = this.getKey(i);
        switch (this.getType(key)) {
        case DescValueType.BOOLEANTYPE:
            r.putBoolean(key, this.getBoolean(key));
            break;
        case DescValueType.CLASSTYPE:
            r.putClass(key, this.getClass(key));
            break;
        case DescValueType.RAWTYPE:
            r.putData(key, this.getData(key));
            break;
        case DescValueType.DOUBLETYPE:
            r.putDouble(key, this.getDouble(key));
            break;
        case DescValueType.ENUMERATEDTYPE:
            r.putEnumerated(key, this.getEnumerationType(key),
                this.getEnumerationValue(key));
            break;
        case DescValueType.INTEGERTYPE:
            r.putInteger(key, this.getInteger(key));
            break;
        case DescValueType.LARGEINTEGERTYPE:
            r.putLargeInteger(key, this.getLargeInteger(key));
            break;
        case DescValueType.OBJECTTYPE:
            r.putObject(key, this.getObjectType(key),
                this.getObjectValue(key).copy());
            break;
        case DescValueType.ALIASTYPE:
            r.putPath(key, this.getPath(key));
            break;
        case DescValueType.REFERENCETYPE:
            r.putReference(key, this.getReference(key).copy());
            break;
        case DescValueType.STRINGTYPE:
            r.putString(key, this.getString(key));
            break;
        case DescValueType.UNITDOUBLE:
            r.putUnitDouble(key, this.getUnitDoubleType(key),
                this.getUnitDoubleValue(key));
            break;
        case DescValueType.LISTTYPE:
            r.putList(key, this.getList(key).copy());
            break;
        default:
            $.writeln("Unknown descriptor type");
            break;
        }
    }
    return r;
};


// Deep copy ActionList
ActionList.prototype.copy = function () {
    var i, r = new ActionList();
    for (i = 0; i < this.count; ++i) {
        switch (this.getType(i)) {
        case DescValueType.BOOLEANTYPE:
            r.putBoolean(this.getBoolean(i));
            break;
        case DescValueType.CLASSTYPE:
            r.putClass(this.getClass(i));
            break;
        case DescValueType.RAWTYPE:
            r.putData(this.getData(i));
            break;
        case DescValueType.DOUBLETYPE:
            r.putDouble(this.getDouble(i));
            break;
        case DescValueType.ENUMERATEDTYPE:
            r.putEnumerated(this.getEnumerationType(i),
                this.getEnumerationValue(i));
            break;
        case DescValueType.INTEGERTYPE:
            r.putInteger(this.getInteger(i));
            break;
        case DescValueType.LARGEINTEGERTYPE:
            r.putLargeInteger(this.getLargeInteger(i));
            break;
        case DescValueType.OBJECTTYPE:
            r.putObject(this.getObjectType(i),
                this.getObjectValue(i).copy());
            break;
        case DescValueType.ALIASTYPE:
            r.putPath(this.getPath(i));
            break;
        case DescValueType.REFERENCETYPE:
            r.putReference(this.getReference(i).copy());
            break;
        case DescValueType.STRINGTYPE:
            r.putString(this.getString(i));
            break;
        case DescValueType.UNITDOUBLE:
            r.putUnitDouble(this.getUnitDoubleType(i),
                this.getUnitDoubleValue(i));
            break;
        case DescValueType.LISTTYPE:
            r.putList(this.getList(i).copy());
            break;
        default:
            $.writeln("Unknown descriptor type");
            break;
        }
    }
    return r;
};
