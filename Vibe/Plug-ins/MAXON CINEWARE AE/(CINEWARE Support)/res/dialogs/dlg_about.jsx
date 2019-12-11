var settingsObject = JSON.parse(jsonBlob);
var resultObject = {};

var basePath = settingsObject.PLUGIN_PATH + "/res/";

var buildDialog = function(settings, result) {
	result.dialogAction = "ok";
	
	dialogLayout =
    """dialog {
        settings: Panel { orientation:'column',
            alignment: ['fill', 'fill']
        },
        buttons: Group {
		orientation: 'row', alignment: ['middle', 'bottom'], 
		okButton: Button { text:'""" + localize(_strings.BTN_CLOSE) + """', properties:{name:'ok'}}
        }
    }""";

	var dialog = new Window(dialogLayout, localize(_strings.STR_TITLE), undefined, {
		resizeable : true
	});

	dialog.settings.add("statictext", undefined, localize(_strings.STR_VERSION, settingsObject.MAJOR_VERSION, settingsObject.MINOR_VERSION, settingsObject.BUG_VERSION));
	dialog.minimumSize = [325, 350];

	dialog.player = dialog.settings.add("image", undefined, File(basePath + "images/CINEWARE_BANNER.png"));
	dialog.player.alignment = 'fill';
	dialog.player.maximumSize = [325, 45];
	dialog.player.minimumSize = [325, 45];

	dialog.webBtn = dialog.settings.add("button", undefined, localize(_strings.STR_ONLINE));
	dialog.webBtn.alignment = ['fill', 'top'];
	dialog.webBtn.maximumSize = [270, 30];

	dialog.webBtn.onClick = function() {
		File(basePath + "html/redirect.html").execute();
	};

	dialog.sct = dialog.settings.add("edittext", undefined, localize(_strings.STR_ABOUTTXT), {
		multiline : true,
		scrolling : true,
		readonly : true
	});

	dialog.sct.alignment = ['fill', 'fill'];
	dialog.sct.scrolling = true;
	dialog.sct.size = [270, 150];

	dialog.buttons.okButton.onClick = function() {
		result.dialogAction = "ok";
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

	return dialog;
};

var dialog = buildDialog(settingsObject, resultObject);

dialog.show();
