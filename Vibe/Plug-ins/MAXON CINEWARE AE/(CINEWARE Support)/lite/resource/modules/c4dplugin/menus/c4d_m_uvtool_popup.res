// Menudefinition for M_UVTOOL_POPUP

MENU M_UVTOOL_POPUP
{
  SUBMENU IDS_BPMENU_SELECTPOLYS
  {
    SUBMENU IDS_SELECTIONFILTER
    {
      IDM_SELECTIONFILTER;
    }
    PLUGIN_CMD_200000083;
    PLUGIN_CMD_200000084;
    PLUGIN_CMD_200000085;
    PLUGIN_CMD_200000086;
    SEPARATOR;
    PLUGIN_CMD_1011192;
    PLUGIN_CMD_1011180;
    PLUGIN_CMD_1011179;
    PLUGIN_CMD_1011178;
    PLUGIN_CMD_1012129;
    PLUGIN_CMD_1019730;
    SEPARATOR;
    IDM_SEL_ALL;
    IDM_SEL_NONE;
    IDM_SEL_INVERT;
    SEPARATOR;
    IDM_SEL_CONNECTED;
    IDM_SEL_GROW;
    IDM_SEL_SHRINK;
    SEPARATOR;
    IDM_HIDESEL;
    IDM_HIDEUNSEL;
    IDM_UNHIDE;
    IDM_HIDEINVERT;
    SEPARATOR;
    PLUGIN_CMD_1011181;
    IDM_GENERATESELECTION;
    PLUGIN_CMD_431000169;
    IDM_SETVERTEX_FROM_SELECTION;
  }
  SUBMENU IDS_BPMENU_UVTOOLS
  {
    IDP_UVEDIT_BAKE;
    IDP_UVEDIT_BAKE_RESTORE;
    IDP_UVEDIT_REMAP;
    SEPARATOR;
    PLUGIN_CMD_1011172;
    PLUGIN_CMD_1011160;
    PLUGIN_CMD_1011170;
    IDP_UVEDIT_FITCANVASTOUV;
    SEPARATOR;
    PLUGIN_CMD_1011167;
    PLUGIN_CMD_1011161;
    PLUGIN_CMD_1011162;
    IDP_UVEDIT_RESETUV;
    PLUGIN_CMD_1011166;
    PLUGIN_CMD_1011165;
    PLUGIN_CMD_1011164;
    PLUGIN_CMD_1011163;
    PLUGIN_CMD_1011169;
    SEPARATOR;
    IDP_UVEDIT_MIRRORX;
    IDP_UVEDIT_MIRRORY;
    PLUGIN_CMD_1011171;
    SEPARATOR;
    IDP_UVEDIT_INTERACTIVE_START;
    IDP_UVEDIT_INTERACTIVE_STOP;
  }
  SEPARATOR;
  PLUGIN_CMD_200000083;
  PLUGIN_CMD_200000084;
  PLUGIN_CMD_200000085;
  PLUGIN_CMD_200000086;
  SEPARATOR;
  PLUGIN_CMD_200000088;
  PLUGIN_CMD_200000089;
  IDM_UVEDIT_SCALE;
  PLUGIN_CMD_200000090;
  SEPARATOR;
  IDM_UVEDIT_SHEAR;
  IDM_UVEDIT_TAPER;
  IDM_UVEDIT_MAGNET;
  SEPARATOR;
  IDM_UVEDIT_POINTS;
  IDM_UVEDIT_POLYGONS;
}
