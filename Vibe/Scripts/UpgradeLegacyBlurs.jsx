{/*
    UpgradeLegacyBlurs.jsx
    Upgrade legacy Gaussian Blur and Fast Blur effects to use the new GPU-accelerated Gaussian Blur
    */

var repeatEdges = false;

function askAboutEdges() {
    var myWindow = new Window ("dialog", "Upgrade Legacy Blur Effects");
    myWindow.preferredSize = [320, 70];

    var myInputGroup = myWindow.add ("group");

    var check1 = myInputGroup.add ("checkbox", undefined, "Repeat edge pixels for legacy Gaussian Blur effects?");
        check1.value = false;
        
    var myButtonGroup = myWindow.add ("group");
        myButtonGroup.alignment = "center";
        myButtonGroup.add ("button", undefined, "OK");
        
    myWindow.show ();
    return check1.value
}

function getAllComps(totalItems, compItems){
        for (var i = 1; i <= totalItems; i++){
        if (app.project.item(i) instanceof CompItem){
            compItems.push(app.project.item(i));
            }
        }
    
    return compItems
    }

function getSelectedComps(selectedItems, compItems){
     if (selectedItems.length != 0){
        for (var i = 0, ii = selectedItems.length; i < ii; i++){
            if (selectedItems[i] instanceof CompItem){
                compItems.push(selectedItems[i]);
                }
            
            }
        } 
    return compItems
    }

function getComps(){

    var totalItems = app.project.items.length;
    var selectedItems = app.project.selection;

    var compItems = [];
    
    if (totalItems < 1){
        alert("Error: Project is empty.");
        return null
        }
    
    if (selectedItems.length > 0) {
        compItems = getSelectedComps (selectedItems, compItems);
    } else {
        compItems = getAllComps (totalItems, compItems);
    }
    
    
    if (compItems.length < 1){
        alert("Error: No compositions found. Select one or more compositions, or leave nothing selected to upgrade entire project.");
        return null
        }
    
        return compItems
    }

function getSelectedLayers(targetComp){

    if (!targetComp()) {
        return null
    }    
    var targetLayers = targetComp.selectedLayers;
    return targetLayers
}

function getAllLayers(targetComp){
    var targetLayers = targetComp.layers;
    return targetLayers
}

function forEachComposition(compArray,doSomething){
    for (var i = 0, ii = compArray.length; i < ii; i++){
        doSomething(compArray[i]);
    }
}

function forEachLayer(targetLayerArray, doSomething) {
    for (var i = 1, ii = targetLayerArray.length; i <= ii; i++){
        doSomething(targetLayerArray[i]);
    }
}

function forEachEffect(targetLayer, doSomething){
    for (var i = 1, ii = targetLayer.property("ADBE Effect Parade").numProperties; i <= ii; i++) {
        doSomething(targetLayer.property("ADBE Effect Parade").property(i));    
    }
}

function matchMatchName(targetEffect,matchNameString){
    if (targetEffect != null && targetEffect.matchName === matchNameString) {
        return targetEffect
    } else {
        return null
    }
}
     
    
function hasKeyframes(targetProperty){
    return (targetProperty.isTimeVarying && targetProperty.numKeys > 0);
}
    
function copyKeyframes(targetProperty){
    var keyframes = {
        'keyIndex' : [],
        'times' : [],
        'values' : [],
        'interpolateIn' : [],
        'interpolateOut' : [],
        'autobezier' : [],
        'continuous' : [],
        'easeIn' : [],
        'easeOut' : []
        };
    
    for (var i = 1, ii = targetProperty.numKeys; i <= ii; i++){
        keyframes["keyIndex"].push(i);
        keyframes["times"].push(targetProperty.keyTime(i));
        keyframes["values"].push(targetProperty.keyValue(i));
        
        keyframes["interpolateIn"].push(targetProperty.keyInInterpolationType(i));
        keyframes["interpolateOut"].push(targetProperty.keyOutInterpolationType(i));
                        
        keyframes["autobezier"].push(targetProperty.keyTemporalAutoBezier(i));
        keyframes["continuous"].push(targetProperty.keyTemporalContinuous(i));

        keyframes["easeIn"].push(targetProperty.keyInTemporalEase(i));
        keyframes["easeOut"].push(targetProperty.keyOutTemporalEase(i));        
    }
    
    return keyframes
}
    
function collectOldValues(targetProperty){
   if( hasKeyframes(targetProperty) ){
        return copyKeyframes(targetProperty)
    } else {
        return targetProperty.value
    }
}

function collectOldExpression(targetProperty){
    if (targetProperty.canSetExpression === true && targetProperty.expressionEnabled === true){
        return targetProperty.expression
    } else {
        return null
    }
}
    
    

function setNewExpression(targetProperty, oldExpression){
    if (oldExpression != null ) {
            targetProperty.expression = oldExpression;
    }
}

function setNewValues(storedValues,targetProperty){
    if (storedValues.times === undefined) {
        targetProperty.setValue(storedValues);
    } else {
        targetProperty.setValuesAtTimes(storedValues.times,storedValues.values);
        
        for(var i = 0, ii = storedValues.keyIndex.length; i < ii; i++){
            var key = storedValues.keyIndex[i];
            
            if(storedValues.interpolateIn[i] === KeyframeInterpolationType.BEZIER || storedValues.interpolateOut[i] === KeyframeInterpolationType.BEZIER){
               targetProperty.setTemporalEaseAtKey(key,storedValues.easeIn[i],storedValues.easeOut[i]);   
            }

            targetProperty.setInterpolationTypeAtKey(key,storedValues.interpolateIn[i],storedValues.interpolateOut[i]);
            targetProperty.setTemporalContinuousAtKey(key,storedValues.continuous[i]);
            targetProperty.setTemporalAutoBezierAtKey(key,storedValues.autobezier[i]);

        }
    }
}    
    
    
function collectCompOpts(sourceEffect){
    var srcEffectMasks = sourceEffect.property("ADBE Effect Built In Params").property("ADBE Effect Mask Parade"); // Masking Options
    var compositingOpts = {
            'maskSet' : [],
            'effectOpacity' : sourceEffect.property("ADBE Effect Built In Params").property("ADBE Effect Mask Opacity").value
        };
    
    if (srcEffectMasks.numProperties > 0) { // has effect masks
        for ( var i = 1, ii = srcEffectMasks.numProperties; i <= ii; i++){
            compositingOpts.maskSet.push(srcEffectMasks.property(i).property("ADBE Effect Path Stream Ref").value);
            }
        } 

    return compositingOpts

}

function applyCompOpts(compositingOpts, targetEffect) {
    targetEffect.property("ADBE Effect Built In Params").property("ADBE Effect Mask Opacity").setValue(compositingOpts.effectOpacity);
    if (compositingOpts.maskSet.length > 0) { // has effect masks
        for ( var i = 0, ii = compositingOpts.maskSet.length; i < ii; i++){
            var fxMasks = targetEffect.property("ADBE Effect Built In Params").property("ADBE Effect Mask Parade");  // Masks
            var fxMask1 = fxMasks.addProperty("ADBE Effect Mask").property("ADBE Effect Path Stream Ref");
            fxMask1.setValue(compositingOpts.maskSet[i]);
            
        }
    } 
}
   
    
function upgradeBlur(targetLayer, targetEffect){
    
    var compositingOptions = collectCompOpts(targetEffect);

    var matchName = targetEffect.matchName;
    var customName = targetEffect.name;

    var oldBlurriness = collectOldValues(targetEffect.property(matchName + "-0001"));
    var oldBlurrinessExp = collectOldExpression(targetEffect.property(matchName + "-0001"));
    
    var oldDimensions = collectOldValues(targetEffect.property(matchName + "-0002"));
    var oldDimensionsExp = collectOldExpression(targetEffect.property(matchName + "-0002"));
    
    if(matchName === "ADBE Fast Blur"){
        var oldRepeat = collectOldValues(targetEffect.property(matchName + "-0003"));
        var oldRepeatExp = collectOldExpression(targetEffect.property(matchName + "-0003"));
    }
    
    var newEffect = targetLayer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
    applyCompOpts(compositingOptions, newEffect);

    setNewValues(oldBlurriness,newEffect.property("ADBE Gaussian Blur 2-0001"));
    setNewExpression(newEffect.property("ADBE Gaussian Blur 2-0001"),oldBlurrinessExp);

    setNewValues(oldDimensions,newEffect.property("ADBE Gaussian Blur 2-0002"));
    setNewExpression(newEffect.property("ADBE Gaussian Blur 2-0002"),oldDimensionsExp);

    
    if(oldRepeat != undefined){
            setNewValues(oldRepeat,newEffect.property("ADBE Gaussian Blur 2-0003"));
            setNewExpression(newEffect.property("ADBE Gaussian Blur 2-0003"),oldRepeatExp);
        } else {
            newEffect.property("ADBE Gaussian Blur 2-0003").setValue(repeatEdges);
        }
    
    
    newEffect.name = customName;
}

function removeEffect(targetEffect){
    targetEffect.remove(); 
}




app.beginUndoGroup("Upgrade Legacy Gaussian and Fast Blur Effects");
    var comps = getComps();
    if(comps != null) {

        repeatEdges = askAboutEdges();
        
        forEachComposition(comps, function(comp){
            
            var targetLayers = getAllLayers(comp);  
            forEachLayer (targetLayers, function(targetLayer){
                
                // No effects on Cameras or Lights...
                if (targetLayer instanceof CameraLayer || targetLayer instanceof LightLayer){
                    return
                    };

                var existingBlurs = [];
                forEachEffect (targetLayer, function(targetEffect){

                    // Create new blurs with existing settings
                    if (matchMatchName (targetEffect, "ADBE Gaussian Blur") || matchMatchName (targetEffect, "ADBE Fast Blur") ){
                        // Store layer indices of old blurs
                        existingBlurs.push(targetEffect.propertyIndex);
                        // Create new ones with their properties
                        upgradeBlur (targetLayer,targetEffect);
                    }

                });

                // Remove old blurs                
                for (var i = existingBlurs.length, ii = 0; i > ii; i--) { 
                    removeEffect(targetLayer.property("ADBE Effect Parade").property(existingBlurs[i - 1]));
                };

                // Move the new blurs into place
                for (var i = existingBlurs.length, ii = 0; i > ii; i--) { 
                    var numEffects = targetLayer.property("ADBE Effect Parade").numProperties;
                    var newBlur = targetLayer.property("ADBE Effect Parade").property(numEffects - i + 1);
                    newBlur.moveTo(existingBlurs[parseFloat(existingBlurs.length - i)]);
                };


                        
                });
            
            });
        
        }

app.endUndoGroup;
}