var debug               = true;
var csInterface         = new CSInterface();
var imsInterface       = new IMSInterface();
var appId                = csInterface.getApplicationID();
function onLoaded() {
    var resourceBundle = csInterface.initResourceBundle();
    var path = csInterface.getSystemPath("userData") + "/kulerdata.json";
    console.log(" path is " + path);
    var result = window.cep.fs.readFile(path);
    if( 0 == result.err){
      console.log(JSON.parse(result.data));
      result = JSON.parse(result.data);
    }
  if(result.localCacheAvailable){
    console.log("local cache available");
    window.location = "https://kuler.adobe.com/";
  }else{
      console.log("cache not available");
      if (csInterface.hostEnvironment.isAppOnline) {
          if(window.navigator.onLine){
              window.location = "https://kuler.adobe.com/";
          }else{
            resetUIColors();
            $(".message").css("margin" ,"15px");
            csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, resetUIColors);
            $(".message")[0].innerHTML = resourceBundle.internetNotConnected;
          }
      }
      else{
            $(".message").css("margin" ,"15px");
            resetUIColors();
            csInterface.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, resetUIColors);
          if(debug){ console.log("App is Not online. Please allow from preferences menu."); }
          if(window.navigator.onLine){
            $(".message").html(resourceBundle.extensionNotAllowedInternet);
            $(".open-preference").html(resourceBundle.pluginPreferences).css({'display':'block'}).mousedown( function(){
                $(this).addClass("selected");
            } ).mouseup(function(){
                $(this).removeClass("selected");
            });
            $(".retry").html(resourceBundle.retry).css({'display':'block'}).mousedown( function(){
                $(this).addClass("selected");
            } ).mouseup(function(){
                $(this).removeClass("selected");
            });;
            if(appId == "PHXS"){
                $(".open-preference").click(openPreferences);
                $(".retry").click(retry);
            }
          }else{
            $(".message").html(resourceBundle.internetNotConnected);
          }
    }
  }
}

function retry(){
    onLoaded();
}

function openPreferenceScript(){
    var classMenuItem = charIDToTypeID('Mn  ');
    var typeMenuItem = charIDToTypeID('MnIt');
    var enumGeneralPreferences = charIDToTypeID('PlgS');
    var keyNull = charIDToTypeID('null');
    var eventSelect = charIDToTypeID('slct');
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(classMenuItem, typeMenuItem, enumGeneralPreferences);
    desc.putReference(keyNull, ref);
    var result = executeAction(eventSelect, desc, DialogModes.ALL);
}

function openPreferences(){
    csInterface.evalScript('var f = '+openPreferenceScript.toString()+'; f();',function(result){});
}

function resetUIColors()
{
    var skin = csInterface.getHostEnvironment().appSkinInfo;
    var WHITE = 0xFFFFFF, BLACK = 0x000000,
        DARK_LIGHT_SWITCH_COLOR = 0x888888,
        LIGHT1_2_SWITCH_COLOR   = 0xCCCCCC,
        DARK1_2_SWITCH_COLOR    = 0x444444;
    if(skin)
    {
        panelBgColor = parseInt( toHex(skin.panelBackgroundColor.color), 16);
        $('html').removeClass('light1 light2 dark1 dark2');
        if(panelBgColor > DARK_LIGHT_SWITCH_COLOR)
        {
            if(panelBgColor > LIGHT1_2_SWITCH_COLOR)
            {
                $('html').addClass("light1");
            }
            else
            {
                $('html').addClass("light2");
            }
        }
        else
        {
            if(panelBgColor > DARK1_2_SWITCH_COLOR)
            {
                $('html').addClass("dark1");
            }
            else
            {
                $('html').addClass("dark2");
            }
        }
    }
}

/**
 * Convert the Color object to string in hexadecimal format;
 */
function toHex(color, delta) {
    function computeValue(value, delta) {
        var computedValue = !isNaN(delta) ? value + delta : value;
        if (computedValue < 0) {
            computedValue = 0;
        } else if (computedValue > 255) {
            computedValue = 255;
        }

        computedValue = computedValue.toString(16);
        return computedValue.length == 1 ? "0" + computedValue : computedValue;
    }

    var hex = "";
    if (color) {
        with(color){
             hex = computeValue(red, delta) + computeValue(green, delta) + computeValue(blue, delta);
        }
    }
    return "0x" + hex;
}
