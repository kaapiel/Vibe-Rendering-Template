var settingsObject = JSON.parse(jsonBlob);
var resultObject = {};

var buildDialog = function(settings, result) {
	result.dialogAction = "cancel";

	var okRes = """okButton: Button { text:'""" + localize(_strings.BTN_OK) + """', properties:{name:'ok'} }""";
	var cancelRes = """cancelButton: Button { text:'""" + localize(_strings.BTN_CANCEL) + """', properties:{name:'cancel'} }""";

    var dialogLayout =
    """dialog {
        settings: Panel { 
          orientation:'column',
          alignment: ['fill', 'fill'],
          minimumSize:[250, -1],
        	st: StaticText { text:'""" + localize(_strings.STR_HEADER) + """', properties:{ multiline:true }, size :[350,20], alignment: ['left', 'top'], },
					body: Group {
						margins: [0, 10, 0, 0],
						alignChildren:['fill', 'top'], 
						orientation:'column', 
						alignment:['fill', 'bottom'], 
						rb2 : RadioButton { 
							helpTip:'radiobutton', text:'""" + localize(_strings.STR_EXTRUDE_BUTTON) + """', value : 'true'
						}, 
						rb1 : RadioButton { 
							helpTip:'radiobutton', text:'""" + localize(_strings.STR_TEXT_BUTTON) + """'
						} 
					}
				},
        buttons: Group {
            margins: [0, 10, 0, 0], alignment: ['right', 'bottom'], """ + (($.os.indexOf("Windows") != -1) ? okRes + cancelRes : cancelRes + okRes) + """
        }
    }""";
    
	var dialog = new Window(dialogLayout, localize(_strings.STR_TITLE), undefined, {
		resizeable : false
	});

	dialog.buttons.okButton.onClick = function() {
		result.dialogAction = "ok";
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
		this.size[1] = this.minimumSize[1];
		this.layout.resize();
	};
	dialog.settings.body.rb1.onClick = function() { 
		result.settings = {
			selectedTextExport : 1
		};
	} 
	dialog.settings.body.rb2.onClick = function() { 
		result.settings = {
			selectedTextExport : 0
		};
	} 

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
