var settingsObject = JSON.parse(jsonBlob);
var resultObject = {};

var buildDialog = function(settings, result) {
	result.dialogAction = "cancel";
	
	var okRes = """okButton: Button { text:'""" + localize(_strings.BTN_OK) + """', properties:{name:'ok'} },""";
    var cancelRes = """cancelButton: Button { text:'""" + localize(_strings.BTN_CANCEL) + """', properties:{name:'cancel'} },""";
    
    var maxItems = 10;
    var sbMax = (settings.layers.length - maxItems) < 0 ? 0 : settings.layers.length - maxItems;

    dialogLayout =
    """dialog { 
        st: StaticText { text:'""" + localize(_strings.STR_HEADER) + """', alignment: ['left', 'top']},
        settings: Panel { 
            orientation:'column',
            alignment: ['fill', 'fill'],
            body: Group {
                margins: [0, 10, 0, 0]
                alignment:['fill','fill'],
                lb: Group { 
                    orientation:'column', alignment:['fill','fill'], spacing:5,
                }, 
                sb: Scrollbar {
                    alignment:['right','fill'], preferredSize:[20,-1], value:0, minvalue:0, maxvalue:""" + sbMax.toString() + """
                }
            }
        },
        buttons: Group {
            margins: [0, 10, 0, 0], alignment: ['right', 'bottom'], """ + (($.os.indexOf("Windows") != -1) ? okRes + cancelRes : cancelRes + okRes) + """
        }
    }"""; 

	var dialog = new Window(dialogLayout, localize(_strings.STR_TITLE), undefined, {
		resizeable : true
	});

	var viewable = (settings.layers.length > maxItems) ? maxItems : settings.layers.length;
	if (viewable == settings.layers.length)
		dialog.settings.body.sb.visible = false;

	var layerResArr = [];
	for (var i = 0; i < settings.layers.length; i++) {
		var value = false;
		for (var j = 0; j < settings.settings.selectedLayers.length; j++) {
			if (settings.settings.selectedLayers[j] == i) {
				value = true;
				break;
			}
		}

		layerResArr.push({
			"text" : settings.layers[i],
			"value" : value
		});
	}

	dialog.settings.body.lb.listItems = [];
	for (var i = 0; i < viewable; i++) {
		var cb = dialog.settings.body.lb.add("checkbox", undefined, layerResArr[i]["text"]);
		cb.value = layerResArr[i]["value"];
		cb.alignment = ['fill', 'top'];
		cb.preferredSize = [200, -1];
		cb.checkboxIndex = i;

		dialog.settings.body.lb.listItems.push(cb);

		cb.onClick = function() {
			layerResArr[dialog.settings.body.sb.value + this.checkboxIndex]["value"] = this.value;
		};
	}

	dialog.settings.body.sb.onChange = dialog.settings.body.sb.onChanging = function() {
		var sbPos = parseInt(this.value);
		this.value = sbPos;

		for (var i = 0; i < viewable; i++) {
			var cbText = layerResArr[sbPos+i]["text"];
			this.parent.lb.listItems[i].text = cbText;
			this.parent.lb.listItems[i].value = layerResArr[sbPos+i]["value"];
		}
	};

	dialog.buttons.okButton.onClick = function() {
		result.dialogAction = "ok";

		var selectedLayers = [];
		for (var i = 0; i < layerResArr.length; i++) {
			if (layerResArr[i]["value"])
				selectedLayers.push(i);
		}

		result.settings = {
			selectedLayers : selectedLayers
		};

		dialog.close(0);
	};

	dialog.buttons.cancelButton.onClick = function() {
		dialog.close(0);
	};

	dialog.layout.layout(true);

	dialog.minimumSize = dialog.size;
	dialog.settings.minimumSize = dialog.settings.size;

	dialog.onResizing = dialog.onResize = function() {

		if (this.size[0] < this.minimumSize[0]) {
			this.size[0] = this.minimumSize[0];
		}

		if (this.size[1] < this.minimumSize[1]) {
			this.size[1] = this.minimumSize[1];
		}
		this.layout.resize();

	};

	dialog.settings.body.sb.notify("onChange");

	return dialog;
};

var dialog = buildDialog(settingsObject, resultObject);
dialog.show();

var returnResult = function(resultObject) {
	if (resultObject.dialogAction == "cancel")
		return "cancel";

	return JSON.stringify(resultObject);
};

returnResult(resultObject);
