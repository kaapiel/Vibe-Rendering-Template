#ifndef OLIGHT_H__
#define OLIGHT_H__

enum
{
	LIGHT_COLOR										= 90000, // VECTOR
	LIGHT_BRIGHTNESS							= 90001, // REAL
	LIGHT_TYPE										= 90002, // LONG
		LIGHT_TYPE_OMNI									= 0,
		LIGHT_TYPE_SPOT									= 1,
		LIGHT_TYPE_SPOTRECT							= 2,
		LIGHT_TYPE_DISTANT							= 3,
		LIGHT_TYPE_PARALLEL							= 4,
		LIGHT_TYPE_PARSPOT							= 5,
		LIGHT_TYPE_PARSPOTRECT					= 6,
		LIGHT_TYPE_TUBE									= 7,
		LIGHT_TYPE_AREA									= 8,
		LIGHT_TYPE_PHOTOMETRIC								= 9,
	LIGHT_SHADOWTYPE							= 90003, // LONG
		LIGHT_SHADOWTYPE_NONE						= 0,
		LIGHT_SHADOWTYPE_SOFT						= 1,
		LIGHT_SHADOWTYPE_HARD						= 2,
		LIGHT_SHADOWTYPE_AREA						= 3,
	LIGHT_VLTYPE									= 90004, // LONG
		LIGHT_VLTYPE_NONE								= 0,
		LIGHT_VLTYPE_VISIBLE						= 1,
		LIGHT_VLTYPE_VOLUMETRIC					= 2,
		LIGHT_VLTYPE_INVERSEVOLUMETRIC	= 3,
	LIGHT_NOISETYPE 							= 90005, // LONG
		LIGHT_NOISETYPE_NONE						= 0,
		LIGHT_NOISETYPE_ILLUM						= 1,
		LIGHT_NOISETYPE_VISIBLE					= 2,
		LIGHT_NOISETYPE_BOTH						= 3,
	LIGHT_SHOWILLUMINATION				= 90006, // BOOL
	LIGHT_SHOWVISIBLELIGHT				= 90007, // BOOL
	LIGHT_SHOWCLIPPING						= 90008, // BOOL
	LIGHT_NOLIGHTRADIATION				= 90009, // BOOL
	LIGHT_MEMORYREQUIREMENT					= 1000,		// virtual ID
	LIGHT_RENDERTIME								= 1001,		// virtual ID
	LIGHT_SHADOW_MAPSIZE						= 1002,		// virtual ID
		LIGHT_SHADOW_MAPSIZE_250					= 0,
		LIGHT_SHADOW_MAPSIZE_500					= 1,
		LIGHT_SHADOW_MAPSIZE_750					= 2,
		LIGHT_SHADOW_MAPSIZE_1000					= 3,
		LIGHT_SHADOW_MAPSIZE_1250					= 4,
		LIGHT_SHADOW_MAPSIZE_1500					= 5,
		LIGHT_SHADOW_MAPSIZE_1750					= 6,
		LIGHT_SHADOW_MAPSIZE_2000					= 7,
		LIGHT_SHADOW_MAPSIZE_USER					= 8,
	LIGHT_SHADOW_MEMUSAGE						= 1003,		// virtual ID
	LIGHT_LENSEFFECTS_REFL_EDIT			= 1005,		// virtual ID
	LIGHT_LENSEFFECTS_PREVIEW				= 1006,   // virtual ID
	LIGHT_NOISE_PREVIEW							= 1007,   // virtual ID

	LIGHT_DETAILS_INNERANGLE			= 90010, // REAL
	LIGHT_DETAILS_OUTERANGLE			= 90011, // REAL
	LIGHT_DETAILS_INNERRADIUS			= 90012, // REAL
	LIGHT_DETAILS_OUTERRADIUS			= 90013, // REAL
	LIGHT_DETAILS_FALLOFF         = 90014, // LONG
		LIGHT_DETAILS_FALLOFF_NONE									= 0,
		LIGHT_DETAILS_FALLOFF_STEP									= 5,
		LIGHT_DETAILS_FALLOFF_INVERSE_CLAMPED				= 6,
		LIGHT_DETAILS_FALLOFF_INVERSESQUARE_CLAMPED	= 7,
		LIGHT_DETAILS_FALLOFF_LINEAR								= 8,
		LIGHT_DETAILS_FALLOFF_INVERSE								= 9,
		LIGHT_DETAILS_FALLOFF_INVERSESQUARE					= 10,
	LIGHT_DETAILS_AMBIENT					= 90015, // BOOL
	LIGHT_DETAILS_INNERCONE				= 90018, // BOOL
	LIGHT_DETAILS_USEINNERCOLOR		= 90019, // BOOL
	LIGHT_DETAILS_COLFALLOFF			= 90020, // BOOL
	LIGHT_DETAILS_CONTRAST				= 90021, // REAL
	LIGHT_DETAILS_ASPECTRATIO			= 90022, // REAL
	LIGHT_DETAILS_INNERDISTANCE		= 90024, // REAL
	LIGHT_DETAILS_OUTERDISTANCE		= 90025, // REAL
	LIGHT_DETAILS_NEARCLIP        = 90027, // BOOL
	LIGHT_DETAILS_FARCLIP					= 90028, // BOOL
	LIGHT_DETAILS_NEARFROM				= 90029, // REAL
	LIGHT_DETAILS_NEARTO					= 90030, // REAL
	LIGHT_DETAILS_FARFROM					= 90031, // REAL
	LIGHT_DETAILS_FARTO						= 90032, // REAL
	LIGHT_DETAILS_SEPARATEPASS		= 90033, // BOOL
	LIGHT_DETAILS_GI        		= 90034, // BOOL
	LIGHT_DETAILS_SKY_COLOR			= 90035, // VECTOR

	LIGHT_TEMPERATURE 			= 90038, // BOOL
	LIGHT_TEMPERATURE_MAIN  		= 90039, // REAL
	//LIGHT_TEMPERATURE_REF   		= 90040, // REAL
	LIGHT_ICONCOL = 90041, // BOOL

	LIGHT_VISIBILITY_CUSTOMCOLORS					= 70000, // BOOL
	LIGHT_VISIBILITY_USEFALLOFF						= 70001, // BOOL
	LIGHT_VISIBILITY_USEEDGEFALLOFF				= 70002, // BOOL
	LIGHT_VISIBILITY_COLOREDEDGEFALLOFF		= 70003, // BOOL
	LIGHT_VISIBILITY_FALLOFF							= 70004, // REAL
	LIGHT_VISIBILITY_EDGEFALLOFF					= 70005, // REAL
	LIGHT_VISIBILITY_DITHERING						= 70006, // REAL
	LIGHT_VISIBILITY_INNERCOLOR_EX				= 70007, // VECTOR
	LIGHT_VISIBILITY_OUTERCOLOR_EX				= 70008, // VECTOR
	LIGHT_VISIBILITY_INNERDISTANCE				= 70009, // REAL
	LIGHT_VISIBILITY_BRIGHTNESS						= 70019, // REAL
	LIGHT_VISIBILITY_SAMPLEDISTANCE				= 70020, // REAL
	LIGHT_VISIBILITY_DUST									= 70021, // REAL
	LIGHT_VISIBILITY_ADDITIVE							= 70022, // BOOL
	LIGHT_VISIBILITY_ADAPTBRIGHTNESS			= 70023, // BOOL
	LIGHT_VISIBILITY_OUTERDISTANCE				= 70027, // REAL
	LIGHT_VISIBILITY_OUTERDISTANCEREL			= 70028, // VECTOR

	LIGHT_SHADOW_RELATIVEBIAS		 = 50000, // REAL
	LIGHT_SHADOW_DENSITY		     = 50001, // REAL
	LIGHT_SHADOW_PARALLELWIDTH	 = 50002, // REAL
	LIGHT_SHADOW_CONEANGLE	     = 50003, // REAL
	LIGHT_SHADOW_AREAWIDTH			 = 50004, // REAL
	LIGHT_SHADOW_MAPSIZEX        = 50005, // LONG
	LIGHT_SHADOW_MAPSIZEY		     = 50006, // LONG
	LIGHT_SHADOW_SAMPLERADIUS    = 50007, // LONG
	LIGHT_SHADOW_TRANSPARENCY    = 50008, // BOOL
	LIGHT_SHADOW_ABSOLUTE			   = 50009, // BOOL
	LIGHT_SHADOW_OUTLINE			   = 50010, // BOOL
	LIGHT_SHADOW_USECONE				 = 50011, // BOOL
	LIGHT_SHADOW_SOFTCONE			   = 50012, // BOOL
	LIGHT_SHADOW_COLOR           = 50013, // VECTOR
	LIGHT_SHADOW_CLIPINFLUENCE	 = 50015, // BOOL
	LIGHT_SHADOW_ABSOLUTEBIAS		 = 50016, // REAL
	LIGHT_SHADOW_HIGHQUALITY		 = 50017, // BOOL
	LIGHT_SHADOW_SAMPLEBOOST		 = 50018, // LONG
		LIGHT_SHADOW_SAMPLEBOOST_NONE	= 0,
		LIGHT_SHADOW_SAMPLEBOOST_2		= 1,
		LIGHT_SHADOW_SAMPLEBOOST_4		= 2,
		LIGHT_SHADOW_SAMPLEBOOST_8		= 3,

	LIGHT_PHOTOMETRIC_FILE 			= 90036, // FILE
	LIGHT_PHOTOMETRIC_DATA			= 90042, // BOOL
	LIGHT_PHOTOMETRIC_INTENSITY		= 90043, // REAL
	LIGHT_PHOTOMETRIC_SIZE 			= 90044, // BOOL
	LIGHT_PHOTOMETRIC_PREVIEW 		= 90045, // BITMAP
	LIGHT_PHOTOMETRIC_UNITS			= 90046, // BOOL

	LIGHT_PHOTOMETRIC_UNIT 			= 90037, // LONG
		LIGHT_PHOTOMETRIC_UNIT_LUMEN		= 0,
		LIGHT_PHOTOMETRIC_UNIT_CANDELA		= 1,
		LIGHT_PHOTOMETRIC_UNIT_LUX		= 2,

	LIGHT_PHOTOMETRIC_INFO_MANUFAC		= 90050,
	LIGHT_PHOTOMETRIC_INFO_LUMCAT		= 90051,
	LIGHT_PHOTOMETRIC_INFO_LUMINAIRE	= 90052,
	LIGHT_PHOTOMETRIC_INFO_LAMPCAT		= 90053,
	LIGHT_PHOTOMETRIC_INFO_LAMP		= 90054,

	LIGHT_CAUSTIC_ENABLE				 = 91000, // BOOL
	LIGHT_CAUSTIC_ENERGY				 = 91001, // REAL
	LIGHT_CAUSTIC_PHOTONS				 = 91002, // LONG
	LIGHT_VOLCAUSTIC_ENABLE		   = 91003, // BOOL
	LIGHT_VOLCAUSTIC_ENERGY			 = 91004, // REAL
	LIGHT_VOLCAUSTIC_PHOTONS     = 91005, // LONG
	LIGHT_VOLCAUSTIC_FALLOFF		 = 91006, // LONG
		LIGHT_VOLCAUSTIC_FALLOFF_NONE						= 0,
		LIGHT_VOLCAUSTIC_FALLOFF_LINEAR					= 1,
		LIGHT_VOLCAUSTIC_FALLOFF_INVERSE				= 2,
		LIGHT_VOLCAUSTIC_FALLOFF_INVERSESQUARE	= 3,
		LIGHT_VOLCAUSTIC_FALLOFF_INVERSECUBIC		= 4,
		LIGHT_VOLCAUSTIC_FALLOFF_STEP						= 5,
	LIGHT_VOLCAUSTIC_INNERDISTANCE = 91007, // REAL
	LIGHT_VOLCAUSTIC_OUTERDISTANCE = 91008, // REAL

	LIGHT_NOISE_TYPE								= 60000, // LONG
		LIGHT_NOISE_TYPE_NOISE					= 0,
		LIGHT_NOISE_TYPE_SOFTTURBULENCE	= 1,
		LIGHT_NOISE_HARDTURBULENCE			= 2,
		LIGHT_NOISE_WAVYTURBULENCE			= 3,
	LIGHT_NOISE_OCTAVES							= 60001, // LONG
	LIGHT_NOISE_VELOCITY						= 60002, // REAL
	LIGHT_NOISE_BRIGHTNESS					= 60006, // REAL
	LIGHT_NOISE_CONTRAST						= 60004, // REAL
	LIGHT_NOISE_LOCAL								= 60008, // BOOL

	LIGHT_NOISE_SCALE								= 60009, // VECTOR
	LIGHT_NOISE_SCALEILLUMINATION		= 60003, // REAL

	LIGHT_NOISE_WIND								= 60007, // VECTOR
	LIGHT_NOISE_WINDVELOCITY				= 60005, // REAL

	LIGHT_LENSEFFECTS_GLOWSV								= 80000, // REAL
	LIGHT_LENSEFFECTS_REFLSV								= 80001, // REAL
	LIGHT_LENSEFFECTS_GLOWSTRENGTH					= 80002, // REAL
	LIGHT_LENSEFFECTS_REFLSTRENGTH					= 80003, // REAL
	LIGHT_LENSEFFECTS_SCALE									= 80004, // REAL
	LIGHT_LENSEFFECTS_ROTATION							= 80005, // REAL
	LIGHT_LENSEFFECTS_REFERENCE							= 80006, // REAL
	LIGHT_LENSEFFECTS_USELIGHTPARAMETER			= 80007, // BOOL
	LIGHT_LENSEFFECTS_FADEBEHINDOBJECT			= 80008, // BOOL
	LIGHT_LENSEFFECTS_FADEAPPROACHINGOBJECT	= 80009, // BOOL
	LIGHT_LENSEFFECTS_FADENEARBORDER				= 80010, // BOOL
	LIGHT_LENSEFFECTS_SCALEGLOW							= 80011, // BOOL
	LIGHT_LENSEFFECTS_SCALEREFLEXES					= 80012, // BOOL
	LIGHT_LENSEFFECTS_LENSGLOW							= 80014, // LONG
		LIGHT_LENSEFFECTS_LENSGLOW_INACTIVE			=  0,
		LIGHT_LENSEFFECTS_LENSGLOW_CUSTOM				=  1,
		LIGHT_LENSEFFECTS_LENSGLOW_DEFAULT			=  2,
		LIGHT_LENSEFFECTS_LENSGLOW_CINEMAR4			=  3,
		LIGHT_LENSEFFECTS_LENSGLOW_WIDEANGLE		=  4,
		LIGHT_LENSEFFECTS_LENSGLOW_ZOOM					=  5,
		LIGHT_LENSEFFECTS_LENSGLOW_HI8					=  6,
		LIGHT_LENSEFFECTS_LENSGLOW_CAMCORDER		=  7,
		LIGHT_LENSEFFECTS_LENSGLOW_SEARCHLIGHT	=  8,
		LIGHT_LENSEFFECTS_LENSGLOW_ARTIFACT			=  9,
		LIGHT_LENSEFFECTS_LENSGLOW_STAR1				= 10,
		LIGHT_LENSEFFECTS_LENSGLOW_STAR2				= 11,
		LIGHT_LENSEFFECTS_LENSGLOW_STAR3				= 12,
		LIGHT_LENSEFFECTS_LENSGLOW_PURPLE				= 13,
		LIGHT_LENSEFFECTS_LENSGLOW_FLASHLIGHT		= 14,
		LIGHT_LENSEFFECTS_LENSGLOW_SUN1					= 15,
		LIGHT_LENSEFFECTS_LENSGLOW_SUN2					= 16,
		LIGHT_LENSEFFECTS_LENSGLOW_GREY					= 17,
		LIGHT_LENSEFFECTS_LENSGLOW_BLUE1				= 18,
		LIGHT_LENSEFFECTS_LENSGLOW_BLUE2				= 19,
		LIGHT_LENSEFFECTS_LENSGLOW_RED					= 20,
		LIGHT_LENSEFFECTS_LENSGLOW_YELLOWGREEN1 = 21,
		LIGHT_LENSEFFECTS_LENSGLOW_YELLOWGREEN2 = 22,
		LIGHT_LENSEFFECTS_LENSGLOW_CANDLE				= 23,

	LIGHT_LENSEFFECTS_LENSREFL							= 80015, // LONG
		LIGHT_LENSEFFECTS_LENSREFL_INACTIVE			=  0,
		LIGHT_LENSEFFECTS_LENSREFL_CUSTOM				=  1,
		LIGHT_LENSEFFECTS_LENSREFL_DEFAULT			=  2,
		LIGHT_LENSEFFECTS_LENSREFL_CINEMAR4			=  3,
		LIGHT_LENSEFFECTS_LENSREFL_WIDEANGLE		=  4,
		LIGHT_LENSEFFECTS_LENSREFL_ZOOM					=  5,
		LIGHT_LENSEFFECTS_LENSREFL_HI8					=  6,
		LIGHT_LENSEFFECTS_LENSREFL_CAMCORDER		=  7,
		LIGHT_LENSEFFECTS_LENSREFL_SEARCHLIGHT	=  8,
		LIGHT_LENSEFFECTS_LENSREFL_ARTIFACT			=  9,
		LIGHT_LENSEFFECTS_LENSREFL_STAR1				= 10,
		LIGHT_LENSEFFECTS_LENSREFL_STAR2				= 11,
		LIGHT_LENSEFFECTS_LENSREFL_STAR3				= 12,
		LIGHT_LENSEFFECTS_LENSREFL_PURPLE				= 13,
		LIGHT_LENSEFFECTS_LENSREFL_FLASHLIGHT1	= 14,
		LIGHT_LENSEFFECTS_LENSREFL_FLASHLIGHT2	= 15,
		LIGHT_LENSEFFECTS_LENSREFL_FLASHLIGHT3	= 16,

	LIGHT_LENSEFFECTS_GLOW							  = 80016,

	LIGHT_LENSEFFECTS_LENSCOUNT						= 80013, // LONG
	LIGHT_LENS_POS	             = 10000, // REAL
	LIGHT_LENS_SIZE              = 10001, // REAL
	LIGHT_LENS_COL               = 10002, // VECTOR
	LIGHT_LENS_TYPE              = 10003, // LONG

	LIGHT_GROUP_DETAILS					 = 1010,
	LIGHT_GROUP_VISIBILITY			 = 1011,
	LIGHT_GROUP_SHADOW					 = 1012,
	LIGHT_GROUP_CAUSTICS				 = 1013,
	LIGHT_GROUP_NOISE						 = 1014,
	LIGHT_GROUP_LENSEFFECTS			 = 1015,
	LIGHT_GROUP_EXCLUSION				 = 1016,
	LIGHT_GROUP_GENERAL					 = 1017,
	LIGHT_GROUP_PHOTOMETRIC				= 1018,
	LIGHT_GROUP_PHOTOMETRIC_INFO			= 1019,

	LIGHT_EXCLUSION_LIST         		= 100000,
	LIGHT_EXCLUSION_MODE				 		= 100001, // include or exclude mode
		LIGHT_EXCLUSION_MODE_INCLUDE		= 0,
		LIGHT_EXCLUSION_MODE_EXCLUDE		= 1,
	LIGHT_PYROCLUSTER_ILLUMINATION	= 100002,
	LIGHT_PYROCLUSTER_SHADOW				= 100003,

	LIGHT_SHADOW_ACCURACY						= 100004,
	LIGHT_SHADOW_MINSAMPLES					= 100005,
	LIGHT_SHADOW_MAXSAMPLES					= 100006,

	LIGHT_DETAILS_ONLYZ							= 100007,

	LIGHT_AREADETAILS										= 100009,
	LIGHT_AREADETAILS_SIZEX							= 100010,
	LIGHT_AREADETAILS_SIZEY							= 100011,
	LIGHT_AREADETAILS_SIZEZ							= 100012,
	LIGHT_AREADETAILS_OBJECT						= 100014,
	LIGHT_AREADETAILS_SHAPE							= 100015,
		LIGHT_AREADETAILS_SHAPE_DISC					= 0,
		LIGHT_AREADETAILS_SHAPE_RECTANGLE			= 1,
		LIGHT_AREADETAILS_SHAPE_SPHERE				= 2,
		LIGHT_AREADETAILS_SHAPE_CYLINDER			= 3,
		LIGHT_AREADETAILS_SHAPE_CUBE					= 4,
		LIGHT_AREADETAILS_SHAPE_HEMISPHERE		= 5,
		LIGHT_AREADETAILS_SHAPE_OBJECT				= 6,
		LIGHT_AREADETAILS_SHAPE_LINE					= 7,
		LIGHT_AREADETAILS_SHAPE_PCYLINDER			= 8,
	LIGHT_AREADETAILS_SAMPLES						= 100016,
	LIGHT_AREADETAILS_ADDGRAIN					= 100017,

	LIGHT_DETAILS_DIFFUSE								= 100018,
	LIGHT_DETAILS_SPECULAR							= 100019,
	LIGHT_DETAILS_SHADOWCASTER					= 100020,

	LIGHT_AREADETAILS_SHOWINRENDER			= 100021,
	LIGHT_AREADETAILS_SHOWINREFLECTION  = 100022,
	LIGHT_AREADETAILS_FALLOFF_ANGLE			= 100023,
	LIGHT_AREADETAILS_INFINITE_ANGLE		= 100024,

	LIGHT_DETAILS_GRADIENT							= 100025,
	LIGHT_VISIBILITY_GRADIENT						= 100026,
	LIGHT_SHADOWTYPE_VIRTUAL						= 100027,
	LIGHT_AREADETAILS_BRIGHTNESS				= 100028,
	LIGHT_AREADETAILS_LOCK_NOISE_EX 		= 100029,

	LIGHT_AFX				 										= 100030, //needed for AFX
	LIGHT_SUN_GI_FLAG										= 100031,

	LIGHT_AREADETAILS_SHOWINSPECULAR		= 100032,
	LIGHT_AREADETAILS_SHOWASSOLIDINVIEWPORT = 1038203,

	LIGHT_INC = 100,

	LIGHT_END_
};

#endif // OLIGHT_H__
