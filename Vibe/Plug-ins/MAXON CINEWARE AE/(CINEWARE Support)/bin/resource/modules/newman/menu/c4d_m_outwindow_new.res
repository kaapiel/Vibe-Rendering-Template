// Menudefinition for new PICTUREVIEWER

MENU M_PICTURE_VIEWER_NEW
{
  SUBMENU IDS_PV_FILE
  {
    IDM_PV_OPEN;
		IDM_PV_SAVEAS;
    IDM_PV_STOP;
    SEPARATOR;
    IDM_PV_CM_CLOSEWINDOW;
  }
  SUBMENU IDS_PV_EDIT
  {
    PLUGIN_CMD_300001019;
    PLUGIN_CMD_300001020;
    SEPARATOR;
    PLUGIN_CMD_430000402;
	IDM_PV_RAMPLAYER;
    SEPARATOR;	
    IDM_PV_IMAGELOCK;
    IDM_PV_PREV;
	IDM_PV_NEXT;
	SEPARATOR;
	IDM_PLAY_FORWARDS; 
	IDM_PV_PLAY_STOP;
	IDM_PV_PLAY_BACKWARDS;
	SEPARATOR;
	IDM_PV_CLEARIMAGE;
	IDM_PV_CLEARIMAGEALL;

	
  }
  SUBMENU IDS_PV_CHANNELS
  {
		IDM_PV_SINGLECHANNEL;
		SEPARATOR;
		IDM_PV_CHANNELS;
	}
	SUBMENU IDS_PV_COMPONENTS
	{
	  IDM_PV_ORED;
	  IDM_PV_OGREEN;
	  IDM_PV_OBLUE;
		SEPARATOR;
	  IDM_PV_SW;
		SEPARATOR;
	  IDM_PV_DIFFERENCE;
	}
  SUBMENU IDS_PV_VIEW
  {
    PLUGIN_CMD_200000108;
    SEPARATOR;
    IDM_PV_FITTOSIZE;
    SEPARATOR;
    IDM_PV_12;
    IDM_PV_25;
    IDM_PV_50;
    IDM_PV_100;
    IDM_PV_200;
    IDM_PV_400;
    IDM_PV_800;
    SEPARATOR;
    IDM_PV_O_GROESSER;
    IDM_PV_O_KLEINER;
    SEPARATOR;
	IDM_PV_SCANLINE;
  }
  SUBMENU IDS_PV_PLUGINS
  {
	IDM_PV_PLUGINS;
  }
  
}
