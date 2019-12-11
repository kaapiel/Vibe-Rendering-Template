#ifndef PREFSUNITS_H__
#define PREFSUNITS_H__

enum
{
	PREF_UNITS_MAIN_GROUP			= 999,
	PREF_UNITS_DISPLAY				= 1000,
	PREF_UNITS_AUTOCONVERT		= 1001,
	PREF_UNITS_BASIC					= 1002,
		PREF_UNITS_BASIC_KM						= 1,
		PREF_UNITS_BASIC_M						= 2,
		PREF_UNITS_BASIC_CM						= 3,
		PREF_UNITS_BASIC_MM						= 4,
		PREF_UNITS_BASIC_MICRO				= 5,
		PREF_UNITS_BASIC_NM						=	6,
		PREF_UNITS_BASIC_MILE					= 7,
		PREF_UNITS_BASIC_YARD					= 8,
		PREF_UNITS_BASIC_FOOT					= 9,
		PREF_UNITS_BASIC_INCH					= 10,

	PREF_UNITS_ANIMATION			= 1003,
			PREF_UNITS_ANIM_FPS			= 0,
			PREF_UNITS_ANIM_SEC			= 1,
			PREF_UNITS_ANIM_SMPTE		= 2,
	PREF_UNITS_RGBRANGE				= 1011,
	PREF_UNIT_RANGE_PERCENT			= 0,
	PREF_UNIT_RANGE_255					= 1,
	PREF_UNIT_RANGE_65535				= 2,
	PREF_UNITS_COLORMODE_RGB									= 1014,
	PREF_UNITS_COLORMODE_HEX									= 1015,
	PREF_UNITS_COLORMODE_OLD_RGB_SLIDERS			= 1016,
	PREF_UNITS_COLORMODE_HSV									= 1017,
	PREF_UNITS_COLORMODE_KELVIN								= 1018,
	PREF_UNITS_COLORMODE_MIXER								= 1019,
	PREF_UNITS_COLORMODE_SWATCHES							= 1020,
	PREF_UNITS_COLORMODE_SWATCHES_SHOWNAMES		= 1021,
	PREF_UNITS_COLORMODE_SWATCHES_SWATCH_SIZE	= 1022,
	PREF_UNITS_COLORMODE_SPECIAL							= 1023,
		PREF_UNITS_COLORMODE_SPECIAL_DISABLED			= 0,
		PREF_UNITS_COLORMODE_SPECIAL_COLORWHEEL		= 1,
		PREF_UNITS_COLORMODE_SPECIAL_SPECTRUM			= 2,
		PREF_UNITS_COLORMODE_SPECIAL_PICTURE			= 3,
	PREF_UNITS_COLORMODE_WHEEL_SIZE						= 1024,
	PREF_UNITS_COLORMODE_WHEEL_SWATCH_SIZE		= 1025,
	PREF_UNITS_COLORMODE_SPECTRUM_SIZE				= 1026,
	PREF_UNITS_COLORMODE_PICTURE_SWATCH_SIZE	= 1027,
	PREF_UNITS_COLORMODE_SIZE_SMALL						= 0, // Shared with all sizes
	PREF_UNITS_COLORMODE_SIZE_MEDIUM					= 1, // Shared with all sizes
	PREF_UNITS_COLORMODE_SIZE_LARGE						= 2, // Shared with all sizes
	PREF_UNITS_COLORMODE_INFO									= 1028,
	PREF_UNITS_COLORMODE_COMPACT							= 1029,
	PREF_UNITS_COLORMODE_SWATCHES_REMEMBER_GLOBAL			= 1031,
	PREF_UNITS_COLORMODE_REMEMBER_LAST_LAYOUT	=	1032,

	//groups
	PREFS_UNITS_COLORGROUP					= 2000,
	PREFS_UNITS_BASICGR							= 2001,
	PREF_UNITS_COLORMODEGROUP				= 2002,


	PREFS_UNITS_DUMMY
};

#endif // PREFSUNITS_H__
