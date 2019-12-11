var settingsObject = JSON.parse(jsonBlob);
var resultObject = {};

var basePath = settingsObject.PLUGIN_PATH + "/res/";

var buildDialog = function(settings, result) {
		result.dialogAction = "cancel";
	
		var okRes = """okButton: Button { text:'""" + localize(_strings.BTN_OK) + """', properties:{name:'ok'} },""";
    var cancelRes = """cancelButton: Button { text:'""" + localize(_strings.BTN_CANCEL) + """', properties:{name:'cancel'} },""";

    dialogLayout =
    """dialog {
        img: Image { helpTip:'image', alignment:['fill','fill'],  maximumSize : [325, 45], minimumSize : [325, 45] },
        settings: Panel { 
            orientation:'column',
            alignment: ['fill', 'fill'],
            preferredSize:[400, 200]
            c4dsettings: Group {
                margins: [0, 10, 0, 0],
                orientation:'column', 
                alignment:['fill','top'], 
                alignChildren:['fill','top'], 
                spacing:5, 
                st: StaticText { text:'""" + localize(_strings.STR_EXEPATH) + """' },
                exec: Group { 
                    orientation: 'row', 
                    alignment: ['fill', 'middle'],
                    path: EditText { helpTip:'""" + localize(_strings.STR_EXEPATH_TIP) + """', text:"path", alignment:['fill','middle'], minimumSize:[-1, 25], preferredSize:[400, 25]}, 
                    browseGrp: Group {
                        alignment:['right','top'], 
                        browseButton: Button { text:'""" + localize(_strings.BTN_BROWSE) + """', helpTip:'""" + localize(_strings.BTN_BROWSE_TIP) + """', properties:{name:'browse'}},
                    }
                },
                st: StaticText { text:'""" + localize(_strings.STR_LITEPATH) + """' },
                execlite: Group { 
                    orientation: 'row', 
                    alignment: ['fill', 'middle'],
                    lite: EditText { helpTip:'""" + localize(_strings.STR_LITEPATH_TIP) + """', text:"lite", alignment:['fill','middle'], minimumSize:[-1, 25], preferredSize:[400, 25]}, 
                    browseLiteGrp: Group {
                        alignment:['right','top'],
                        browseLiteButton: Button { text:'""" + localize(_strings.BTN_BROWSE) + """', helpTip:'""" + localize(_strings.BTN_BROWSE_TIP) + """', properties:{name:'litebrowse'}},
                    }
                 },
                 st: StaticText { text:'' },
								 stml: StaticText { text:'""" + localize(_strings.STR_HELP) + """', properties:{ multiline:true }, alignment:['fill','middle'], preferredSize:[600,50] } 
                 st: StaticText { text:'""" + localize(_strings.STR_COMPORT) + """' },
								 param: Group { 
										orientation: 'row', 
										alignment: ['fill', 'middle'],
										port: EditText { helpTip:'""" + localize(_strings.STR_COMPORT_TIP) + """', text:'2043', alignment:['left','middle'], minimumSize:[50, 25]} 
									  resetButton: Button { text:'""" + localize(_strings.BTN_DEFAULT) + """', helpTip:'""" + localize(_strings.BTN_DEFAULT_TIP) + """', properties:{name:'reset'}, alignment:['right','middle']},
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

	dialog.img.image = File(basePath + "images/CINEMA4D_BANNER.png");

	dialog.settings.c4dsettings.exec.path.text = File(settingsObject.C4D_RENDERPATH).fsName;
	dialog.settings.c4dsettings.execlite.lite.text = File(settingsObject.C4D_LITEPATH).fsName;
	dialog.settings.c4dsettings.param.port.text = settingsObject.C4D_PORT;

	dialog.settings.c4dsettings.param.port.onChanging = function() {
		if (this.text.match(/[^\d]/))
			this.text = this.text.replace(/[^\d]/g, '');

		if (this.text.length > 4)
			this.text = this.text.substring(0, 4);
	};

	dialog.settings.c4dsettings.exec.browseGrp.browse.onClick = function() {
		var f = File.openDialog(localize(_strings.STR_POINTTOEXE), "*.exe");
		if (f != null && f.exists)
			dialog.settings.c4dsettings.exec.path.text = f.fsName;
	};

	dialog.settings.c4dsettings.execlite.browseLiteGrp.litebrowse.onClick = function() {
		var f = File.openDialog(localize(_strings.STR_POINTTOEXE), "*.exe");
		if (f != null && f.exists)
			dialog.settings.c4dsettings.execlite.lite.text = f.fsName;
	};

	dialog.settings.c4dsettings.param.reset.onClick = function() {
		if (confirm(localize(_strings.STR_REALLYRESET), true, localize(_strings.STR_REALLYRESET))) {
			dialog.settings.c4dsettings.exec.path.text = File(settingsObject.C4D_RENDERPATH_DEFAULT).fsName;
			dialog.settings.c4dsettings.execlite.lite.text = File(settingsObject.C4D_LITEPATH_DEFAULT).fsName;
			dialog.settings.c4dsettings.param.port.text = settingsObject.C4D_PORT_DEFAULT;
		}
	};

	dialog.buttons.okButton.onClick = function() {
		if (!File(dialog.settings.c4dsettings.exec.path.text).exists && !File(dialog.settings.c4dsettings.execlite.lite.text).exists) {
			alert(localize(_strings.STR_INVALIDEXE), " ");
		} else {
			if (dialog.settings.c4dsettings.param.port.text.length > 0 && dialog.settings.c4dsettings.param.port.text != "0") {
				result.dialogAction = "ok";

				result.settings = {
					C4D_RENDERPATH : File(dialog.settings.c4dsettings.exec.path.text).fsName,
					C4D_LITEPATH : File(dialog.settings.c4dsettings.execlite.lite.text).fsName,
					C4D_PORT : dialog.settings.c4dsettings.param.port.text
				};

				alert(localize(_strings.STR_CHANGEAPPLY), " ");
			}
			dialog.close(0);
		}
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
