#ifndef C4D_SYMBOLS_H__
#define C4D_SYMBOLS_H__

enum
{
	IDS_DBLUR_NAME = 1500,
	IDS_GLOW_NAME,
	IDS_HLIGHT_NAME,
	IDS_SPECTRAL_NAME,
	IDS_ADVREND_NAME,
	STR_PREPARING_PHOTONTREE,
	STR_FREEING_PHOTONTREE,
	STR_CASTING_PHOTONS,
	STR_CONVERTHDRCROSS,
	STR_CONVERTHDRPROBE,
	IDS_MENU_ABOUT,
	IDS_MENU_THANKS,
	IDS_SAVE_ERROR,
	IDS_MBLUR_NAME,
	STR_STAT_MOTIONBLUR,
	IDS_GLOW_NAME2,
	IDS_MBLUR_NAME2,
	IDS_SSS_NAME,
	IDS_OBJECTGI,
	IDS_COLORMAPPING,
	IDS_AO_NAME,
	IDS_CYLINDERLENS,

	// --- GI Main
	IDS_GI_RENDER_FINISHED_PREFIX,
	IDS_GI_RENDER_FINISHED_SUFIX,
	IDS_GI_RENDER_FRAME,
	IDS_GI_RENDER_CACHE_LOAD,
	IDS_GI_RENDER_CACHE_SAVE,
	IDS_GI_RENDER_RADIANCE_LOAD,
	IDS_GI_RENDER_RADIANCE_SAVE,
	IDS_GI_RENDER_LIGHT_MAPPING_LOAD,
	IDS_GI_RENDER_LIGHT_MAPPING_SAVE,
	IDS_GI_RENDER_AO_LOAD,
	IDS_GI_RENDER_AO_SAVE,
	IDS_GI_RENDER_INCORRECT_GI,
	IDS_GI_RENDER_INCORRECT_RADIANCE,
	IDS_GI_RENDER_INCORRECT_LIGHT_MAPPING,
	IDS_GI_RENDER_INCORRECT_AO,
	IDS_GI_RENDER_RADIANCE_MISMATCH,
	IDS_GI_RENDER_USED_RECORDS_1,
	IDS_GI_RENDER_USED_RECORDS_2,
	IDS_GI_RENDER_USED_RECORDS_3,
	IDS_GI_RENDER_USED_RECORDS_4,
	IDS_GI_RENDER_USED_RECORDS_5,
	IDS_GI_RENDER_USED_RECORDS_6,
	IDS_GI_RENDER_USED_RECORDS_7,
	IDS_GI_RENDER_USED_RECORDS_8,
	IDS_GI_RENDER_USED_RECORDS_AO,
	IDS_GI_RENDER_ERROR_ALLOCATE,
	IDS_GI_RENDER_CACHE_NONWRITABLE,
	IDS_GI_RENDER_RADIANCE_NONWRITABLE,
	IDS_GI_RENDER_LIGHT_MAPPING_NONWRITABLE,
	IDS_GI_RENDER_AO_NONWRITABLE,
	IDS_GI_RENDER_LOADING_IRRADIANCE,
	IDS_GI_RENDER_LOADING_RADIANCE,
	IDS_GI_RENDER_LOADING_LIGHT_MAPPING,
	IDS_GI_RENDER_LOADING_AO,
	IDS_GI_RENDER_SAVING_IRRADIANCE,
	IDS_GI_RENDER_SAVING_RADIANCE,
	IDS_GI_RENDER_SAVING_LIGHT_MAPPING,
	IDS_GI_RENDER_SAVING_AO,

	// --- GI Prepass
	IDS_GI_PREPASS_TITLE,
	IDS_GI_PREPASS_PRESAMPLING,
	IDS_GI_PREPASS_QUICK,
	IDS_GI_PREPASS_MAIN,
	IDS_GI_PREPASS_LEAST_SQUARES,
	IDS_GI_PREPASS_PROXIMITY,
	IDS_GI_PREPASS_PROXIMITY_COLOR,
	IDS_GI_PREPASS_RADIANCE_MAPS,
	IDS_GI_PREPASS_SAMPLES_EXISTING,
	IDS_GI_PREPASS_SAMPLES_ESTIMATING,
	IDS_GI_PREPASS_SAMPLES_COUNT_ACCURACY,
	IDS_GI_PREPASS_SAMPLES_COUNT_THRESHOLD,
	IDS_GI_PREPASS_SAMPLES_COUNT_ESTIMATE,
	IDS_GI_PREPASS_SAMPLES_COUNT_TIME,
	IDS_GI_PREPASS_SAMPLES_COUNT_TIME_SUFIX,
	IDS_GI_PREPASS_SAMPLES_COUNT,
	IDS_GI_PREPASS_RENDERING,
	IDS_GI_PREPASS_FINISHED_PREFIX,
	IDS_GI_PREPASS_FINISHED_SUFIX,
	IDS_GI_PREPASS_ERROR_MT_INIT,
	IDS_GI_PREPASS_ERROR_MT_START,

	// --- Light Mapping Prepass
	IDS_LM_PREPASS_TITLE,
	IDS_LM_PREPASS_MAIN,

	// --- AO Prepass
	IDS_AO_PREPASS_TITLE,
	IDS_AO_PREPASS_MAIN,
	IDS_AO_PREPASS_RENDERING,
	IDS_AO_PREPASS_FINISHED_PREFIX,
	IDS_AO_PREPASS_FINISHED_SUFIX,

	// --- GI Setup
	IDS_GI_ANIMATION_SETUP_INIT_RECORDS,
	IDS_GI_ANIMATION_SETUP_INIT_BYTES,
	IDS_GI_ANIMATION_SETUP_RECORDS,
	IDS_GI_ANIMATION_SETUP_BYTES,
	IDS_GI_ANIMATION_SETUP_OBJECTS,

	// --- TR Mimatch
	IDS_GI_TR_CACHE_MISMATCH,

	IDS_OLDGI,
	IDS_NEWGI,
	IDS_OLDCAUSTICS,

	IDS_PYRO_DUMMY,
	IDS_PYRO_NAME,
	IDS_PYRO_NAME2,
	IDS_PYRO_VTNAME,
	IDS_PYRO_VPNAME,
	IDS_PREVIEW,
	IDS_PARAM_RESET,
	IDS_PARAM_CONVERT,
	IDS_REND_BSP,
	IDS_REND_IMAGE,
	IDS_REND_DEEPSHAD,

	IDD_PREVIEW,

	IDC_PREVIEW,
	IDC_CHESS,
	IDC_COLOR,
	IDC_AGE,

	IDS_TEAMRENDER,
	IDS_SAVINGAOCACHES,
	IDS_SAVINGGICACHES,
	IDS_SAVINGLMCACHES,
	IDS_SAVINGRMCACHES,

	// Dummy
	___DEFDUMMY_
};


#endif // C4D_SYMBOLS_H__
