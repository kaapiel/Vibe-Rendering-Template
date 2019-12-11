// C4D Menu Resource

MENU M_MATERIAL_MANAGER
{
  SUBMENU IDS_MATERIAL_MANAGER_FILE
  {
    IDM_MNEU_PBR;
    IDM_MNEU;
    SEPARATOR;
    SUBMENU IDS_SHADER
	  {
	    IDM_VOLUMESHADER;
	  }
    SEPARATOR;
    IDM_MHINZULADEN;
    SEPARATOR;
    IDM_MSPEICHERN;
    IDM_SPEICHERNALL;
    SEPARATOR;
    SUBMENU IDS_LOADMATERIALPRESET
    {
    	PLUGIN_CMD_300000109;
    }
    PLUGIN_CMD_300000110;
  }
  SUBMENU IDS_MATERIAL_MANAGER_EDIT
  {
    IDM_UNDO;
    IDM_REDO;
    SEPARATOR;
    PLUGIN_CMD_300001021;
    PLUGIN_CMD_300001022;
    PLUGIN_CMD_300001023;
    PLUGIN_CMD_300001024;
    SEPARATOR;
    PLUGIN_CMD_300001025;
    PLUGIN_CMD_300001026;
    SEPARATOR;
    IDM_MM_MATERIAL_ONLY;
    IDM_MM_MATERIAL_LIST_ONLY;
    IDM_MM_LAYERS_COMPACT;
    IDM_MM_LAYERS_EXPANDED;
    IDM_MM_LAYERS_EXPANDED2;
    IDM_MM_LAYERS_ACTIVE;
    SEPARATOR;
    IDM_MATERIAL_LEFTLIST_NO;
    IDM_MATERIAL_LEFTLIST_SMALL;
    IDM_MATERIAL_LEFTLIST_MEDIUM;
    IDM_MATERIAL_LEFTLIST_LARGE;
    SEPARATOR;
    IDM_MATERIAL_ONELINELAYERS;
  }
  SUBMENU IDS_MATERIAL_MANAGER_FUNCTION
  {
    IDM_EDITAKTUMAT;
    IDM_AKTUZUWEISEN;
    IDM_MNAME;
    SEPARATOR;
    IDM_SELECTMATFROMOBJECT;
    IDM_MATERIALSHOWACTIVE;
    IDM_SELECTALLTEXTURETAGS;
		IDM_SELECTMATSWITHSAMEREFLECTANCE;
    SEPARATOR;
    IDM_RENDERAKTUMAT;
    IDM_RENDERALLMAT;
    IDM_SORTMATS;
    SEPARATOR;
    PLUGIN_CMD_200000148;
    PLUGIN_CMD_200000146;
    PLUGIN_CMD_200000147;
    PLUGIN_CMD_100004704;
    SEPARATOR;
    PLUGIN_CMD_1015650;
    SEPARATOR;
    IDM_DELUNUSED;
    IDM_DOPPELTEMATERIALIEN;
    SEPARATOR;
    PLUGIN_CMD_200000273;
  }
  SUBMENU IDS_MATMAN_TEXTURE
  {
    SUBMENU IDS_MATERIAL_CHANNELS
    {
      IDM_MATERIAL_COLOR;
      IDM_MATERIAL_DIFFUSION;
      IDM_MATERIAL_LUMINANCE;
      IDM_MATERIAL_TRANSPARENCY;
      IDM_MATERIAL_ENVIRONMENT;
      IDM_MATERIAL_BUMP;
      IDM_MATERIAL_ALPHA;
      IDM_MATERIAL_DISPLACEMENT;
      IDM_MATERIAL_NORMAL;
      SEPARATOR;
      IDM_MATERIAL_CUSTOM;
      SEPARATOR;
      SUBMENU IDS_MATERIAL_REFLECTION_LAYERS
      {
         IDM_REFLECTION_LAYERS;
      }
    }
    SEPARATOR;
    IDM_LOADTEXTURES;
    IDM_UNLOADTEXTURES;
    SEPARATOR;
    IDM_PM_ENABLE;
    IDM_PM_DISABLE;
    SEPARATOR;
    IDP_NEWLAYER;
    IDP_NEWLAYERSET;
    IDP_DUPLICATELAYER;
    IDP_CHANNEL_DELETE;
    SEPARATOR;
    IDP_MERGEDOWN;
    IDP_MERGELINKED;
    IDP_CHANNEL_FLATTEN_VISIBLE;
    IDP_CHANNEL_FLATTEN;
    SEPARATOR;
    IDP_CHANNEL_ADDLAYERMASK;
    IDP_LAYERMASKADDSELECTION;
    IDP_LAYERMASKSUBSELECTION;
    IDP_SELECTIONFROMLAYER;
    IDP_SELECTIONFROMLAYERADD;
    IDP_SELECTIONFROMLAYERSUB;
    SEPARATOR;
    IDP_NEWALPHACHANNEL;
    SEPARATOR;
    IDP_CONVERTTOGRAY;
    IDP_CONVERTTORGB;
    SEPARATOR;
    IDP_CONVERTTO_UCHAR;
    IDP_CONVERTTO_UWORD;
    IDP_CONVERTTO_FLOAT;
    SEPARATOR;
    IDP_PAINT_ASSIGNPROFILE;
    IDP_PAINT_CONVERTTOPROFILE;
    SEPARATOR;
    IDP_BITMAPINFO;
    PLUGIN_CMD_1029486;
  }
}

MENU M_MATERIAL_POPUP1
{
	SUBMENU IDS_MATERIAL_CHANNELS
	{
		IDM_MATERIAL_COLOR;
		IDM_MATERIAL_DIFFUSION;
		IDM_MATERIAL_LUMINANCE;
		IDM_MATERIAL_TRANSPARENCY;
		IDM_MATERIAL_ENVIRONMENT;
		IDM_MATERIAL_BUMP;
		IDM_MATERIAL_ALPHA;
		IDM_MATERIAL_DISPLACEMENT;
		IDM_MATERIAL_NORMAL;
		SEPARATOR;
		IDM_MATERIAL_CUSTOM;
		SEPARATOR;
		SUBMENU IDS_MATERIAL_REFLECTION_LAYERS
		{
			IDM_REFLECTION_LAYERS;
		}
	}
  SEPARATOR;
	IDM_LOADTEXTURES;
	IDM_UNLOADTEXTURES;
  SEPARATOR;
	IDM_PM_ENABLE;
	IDM_PM_DISABLE;
	SEPARATOR;
  IDM_EDITAKTUMAT;
  IDM_AKTUZUWEISEN;
  IDM_MNAME;
  SEPARATOR;
	IDM_SELECTMATFROMOBJECT;
	IDM_MATERIALSHOWACTIVE;
	IDM_SELECTALLTEXTURETAGS;
	IDM_SELECTMATSWITHSAMEREFLECTANCE;
  SEPARATOR;
  IDM_RENDERAKTUMAT;
  IDM_RENDERALLMAT;
  IDM_SORTMATS;
  SEPARATOR;
	PLUGIN_CMD_200000148;
	PLUGIN_CMD_200000146;
	PLUGIN_CMD_200000147;
	PLUGIN_CMD_100004704;
  SEPARATOR;
  PLUGIN_CMD_431000143;
  PLUGIN_CMD_431000147;
	PLUGIN_CMD_431000154;
  PLUGIN_CMD_431000053;
  SEPARATOR;
  IDM_DELUNUSED;
  IDM_DOPPELTEMATERIALIEN;
}
