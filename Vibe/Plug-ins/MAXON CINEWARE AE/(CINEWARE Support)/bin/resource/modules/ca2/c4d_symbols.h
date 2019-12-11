#ifndef C4D_SYMBOLS_H__
#define C4D_SYMBOLS_H__

enum
{
	// string table definitions
	IDS_MORPHTAG	= 10000,
	IDS_MORPH_TARGET,
	IDS_MORPH_BASE,
	IDS_MORPH_ACTIVE,
	IDS_DRIVERTAG,
	IDS_TENSIONTAG,
	IDS_MORPHDEFORMER_OBJECT,
	IDS_SHRINKWRAP_OBJECT,
	IDS_DATATYPE_MOPPHLIST,
	IDS_IMPORTMORPHMESH,

	IDS_MORPH_TAGNAME,
	IDS_MORPH_SAVEMORPHS,
	IDS_MORPH_SAVEMORPH,

	IDS_TENSION_FOLDS,
	IDS_TENSION_STRETCH,

	IDS_VPFILMGRAIN,
	IDS_DEPTHSHADER,

	IDS_VMAPMANAGER,

	IDS_TRANMAP_MORPHS,
	IDS_TRANMAP_VMAP,
	IDS_TRANMAP_POLYSELECTION,
	IDS_TRANMAP_EDGESELECTION,
	IDS_TRANMAP_VERTSELECTION,
	IDS_TRANMAP_UVW,
	IDS_TRANMAP_TEXTURETAG,
	IDS_TRANMAP_BONES,

	// Dialog definitions of vmapmanager start here
	vmapmanager,
	ID_VM_OPERATIONSGROUP,
	ID_VM_SOURCELINK,
	ID_VM_TARGETLINK,
	ID_VM_VTYPESGROUP,
	ID_VM_TRANSFERMETHOD,
	ID_VM_FLIPDIRECTION,
	ID_VM_SPACE,
	ID_VM_TRANSFERBUTTON,
	// Dialog definitions of vmapmanager end here

	IDS_VM_TRANSFERING,
	IDS_VM_UVSMOOTHING,
	IDS_BASELIST_FLIPX,
	IDS_BASELIST_FLIPY,
	IDS_BASELIST_FLIPZ,
	// visual Selector
	IDS_VISUAL_SELECTOR			= 11000,
	IDS_VS_TAG,
	IDS_VS_OPTIONS,
	IDS_VS_UPDATE_MANAGER,
	IDS_VS_FORCE_ACTIONS,
	IDS_VS_ACTIVATE_CAMERAS,
	IDS_VS_GRID_ACTIVE,
	IDS_VS_NO_TAGS,
	IDS_VS_FRAME_ACTIVE,
	IDS_VS_TAG_EDIT,
	IDS_ICON_SELECTOR,
	IDS_VS_CHOOSE_ICON,
	IDS_VS_CHOOSE_COLOR,
	IDS_CURRENT_TAG,
	IDS_VS_TAB_IMAGE,
	IDS_VS_TAB_TAG,
	// muscles
	IDS_MUSCLE_OBJECT		= 12000,
	IDS_MUSCLE_DEFORMER,
	// morph brush
	IDS_MORPH_BRUSH,

	// End of symbol definition
	_DUMMY_ELEMENT_
};

#endif // C4D_SYMBOLS_H__