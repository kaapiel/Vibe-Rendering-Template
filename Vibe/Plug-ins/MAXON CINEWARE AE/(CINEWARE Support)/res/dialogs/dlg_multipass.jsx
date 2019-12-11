var settingsObject = JSON.parse(jsonBlob);
var resultObject = {};

var buildDialog = function(settings, result) {
	result.dialogAction = "cancel";
	
	var okRes = """okButton: Button { text:'""" + localize(_strings.BTN_OK) + """', properties:{name:'ok'} },""";
    var cancelRes = """cancelButton: Button { text:'""" + localize(_strings.BTN_CANCEL) + """', properties:{name:'cancel'} },""";

	dialogLayout =
    """dialog {
        st: StaticText { text:'""" + localize(_strings.STR_HEADER) + """', alignment: ['left', 'top'], },
        settings: Panel { 
            orientation:'column',
            alignment: ['fill', 'fill'],
            minimumSize:[250, -1],
            body: Group {
                margins: [0, 10, 0, 0],
                alignment: ['fill', 'fill'],
                multipasses: DropDownList { 
                    alignment: ['fill', 'top']
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

	for (var i = 0; i < settings.multipasses.length; i++)
		dialog.settings.body.multipasses.add("item", settings.multipasses[i]);

	dialog.settings.body.multipasses.selection = dialog.settings.body.multipasses.items[settings.settings.selectedPass];

	dialog.buttons.okButton.onClick = function() {
		result.dialogAction = "ok";

		result.settings = {
			selectedPass : dialog.settings.body.multipasses.selection.index
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
		this.size[1] = this.minimumSize[1];
		this.layout.resize();
	};

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
