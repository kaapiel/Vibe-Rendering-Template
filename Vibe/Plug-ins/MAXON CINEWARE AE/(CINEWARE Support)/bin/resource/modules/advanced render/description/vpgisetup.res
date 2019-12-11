CONTAINER VPgisetup
{
	NAME VPgisetup;
	INCLUDE VPbase;
	
	GROUP GI_GROUP_GENERAL
	{
		DEFAULT 1;
		COLUMNS 2;

		// **************************************************************************************************
		// --- Presets ---
		GROUP
		{
		LONG GI_SETUP_DATA_PRESETS
		{ 
			ANIM OFF;
			CYCLE 
			{
				GI_SETUP_PRESET_CUSTOM;
				GI_SETUP_PRESET_DEFAULT;
				0;
				GI_SETUP_PRESET_INTERIOR_PREVIEW;
				GI_SETUP_PRESET_INTERIOR_PREVIEW_DIFFUSE;
				GI_SETUP_PRESET_INTERIOR_PREVIEW_AREA;
				GI_SETUP_PRESET_INTERIOR_HIGH;
				GI_SETUP_PRESET_INTERIOR_HIGH_DIFFUSE;
				GI_SETUP_PRESET_INTERIOR_HIGH_AREA;
				0;
				GI_SETUP_PRESET_EXTERIOR_PREVIEW;
				GI_SETUP_PRESET_EXTERIOR_SKY;
				GI_SETUP_PRESET_EXTERIOR_HDR;
				0;
				GI_SETUP_PRESET_OBJECT_PREVIEW;
				GI_SETUP_PRESET_OBJECT_HIGH;
				0;
				GI_SETUP_PRESET_PROGRESSIVE;
				GI_SETUP_PRESET_PROGRESSIVE_PREPASS;
			} 
		}
		}

		SEPARATOR { LINE; }
		STATICTEXT { JOINENDSCALE; }		

		// **************************************************************************************************
		// --- Methods ---
		LONG GI_SETUP_DATA_PRIMARY_METHOD
		{
			PARENTCOLLAPSE;
			ANIM OFF;
			CYCLE 
			{
				GI_SETUP_METHOD_QMC;
				GI_SETUP_METHOD_IC2;
				0;
				GI_SETUP_METHOD_IRRADIANCE_CACHE;
			}
		}

		STATICTEXT {}

		REAL GI_SETUP_DATA_PRIMARY_INTENSITY
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_PRIMARY_METHOD;
			ANIM OFF;
			MIN 0.1; 
			MAX 10000.0; 
			UNIT PERCENT;
		}

		STATICTEXT 
		{
			PARENTCOLLAPSE GI_SETUP_DATA_PRIMARY_METHOD;
		}

		REAL GI_SETUP_DATA_PRIMARY_SATURATION
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_PRIMARY_METHOD;
			ANIM OFF;
			MIN 0.0; 
			MAX 1000.0; 
			STEP 1.0; 
			UNIT PERCENT;
		}

		STATICTEXT 
		{
			PARENTCOLLAPSE GI_SETUP_DATA_PRIMARY_METHOD;
		}

		LONG GI_SETUP_DATA_SECONDARY_METHOD
		{
			PARENTCOLLAPSE;
			ANIM OFF;
			CYCLE 
			{
				GI_SETUP_METHOD_QMC;
				GI_SETUP_METHOD_CACHE;
				GI_SETUP_METHOD_RADIANCE;
				GI_SETUP_METHOD_LIGHT_MAPPING;
				GI_SETUP_METHOD_NONE;
			}
		}

		STATICTEXT {}

		REAL GI_SETUP_DATA_SECONDARY_INTENSITY
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_SECONDARY_METHOD;
			ANIM OFF;
			MIN 0.1; 
			MAX 10000.0; 
			UNIT PERCENT;
		}

		STATICTEXT 
		{
			PARENTCOLLAPSE GI_SETUP_DATA_SECONDARY_METHOD;
		}

		REAL GI_SETUP_DATA_SECONDARY_SATURATION
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_SECONDARY_METHOD;
			ANIM OFF;
			MIN 0.0; 
			MAX 1000.0; 
			STEP 1.0; 
			UNIT PERCENT;
		}

		STATICTEXT 
		{
			PARENTCOLLAPSE GI_SETUP_DATA_SECONDARY_METHOD;
		}

		LONG GI_SETUP_DATA_DIFFUSE_DEPTH
		{
			ANIM OFF;
			MIN 2; 
			MAX 8; 
		}

		LONG GI_SETUP_DATA_LIGHT_MAPPING_PATH_DEPTH
		{
			ANIM OFF;
			MIN 1; 
			MAX 128; 
		}	

		STATICTEXT GI_SETUP_DATA_STATIC_DEPTH {}

		REAL GI_SETUP_DATA_GAMMA_VALUE
		{ 
			ANIM OFF;
			MIN 0.1; 
			MAX 10.0; 
			STEP 0.1; 
		}

		STATICTEXT {}

		SEPARATOR { LINE; }
		STATICTEXT { JOINENDSCALE; }	
	//}

	// **************************************************************************************************
	// --- QMC ---
	//GROUP GI_GROUP_QMC			
	//{
		//COLUMNS 2;
		//DEFAULT 1;

		LONG GI_SETUP_DATA_QMC_COUNT_METHOD
		{ 
			PARENTCOLLAPSE;
			ANIM OFF;
			CYCLE 
			{
				GI_SETUP_COUNT_USER;
				GI_SETUP_COUNT_CUSTOM;
				GI_SETUP_COUNT_LOW;
				GI_SETUP_COUNT_MEDIUM;
				GI_SETUP_COUNT_HIGH;
			}
		}
			
		STATICTEXT {}

		REAL GI_SETUP_DATA_QMC_COUNT_THRESHOLD
		{
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_COUNT_METHOD;
			ANIM OFF;
			MIN 0.0; 
			MAX 200.0; 
			UNIT PERCENT;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_COUNT_METHOD; }

		LONG GI_SETUP_DATA_QMC_COUNT
		{
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_COUNT_METHOD;
			ANIM OFF;
			MIN 1; 
			MAX 16384; 
			STEP 1; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_COUNT_METHOD; }

		BOOL GI_SETUP_DATA_QMC_ENABLED
		{
			ANIM OFF;
		}

		STATICTEXT { }

		// **************************************************************************************************
		// --- Area Section ---
		BOOL GI_SETUP_DATA_QMC_AREA_ENABLED
		{
			ANIM OFF;
			PARENTCOLLAPSE;
		}

		STATICTEXT { }

		BOOL GI_SETUP_DATA_QMC_AREA_FORCE
		{
			ANIM OFF;
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_AREA_ENABLED;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_AREA_ENABLED; }

		BOOL GI_SETUP_DATA_QMC_AREA_CUSTOM
		{
			ANIM OFF;
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_AREA_ENABLED;
		}		

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_AREA_ENABLED; }

		LONG GI_SETUP_DATA_QMC_AREA_COUNT
		{
			ANIM OFF;
			MIN 1; 
			MAX 16384; 
			STEP 1; 
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_AREA_ENABLED;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_AREA_ENABLED; }

		// **************************************************************************************************
		// --- Sky Section ---
		BOOL GI_SETUP_DATA_QMC_SKY_ENABLED
		{
			ANIM OFF;
			PARENTCOLLAPSE;
		}

		STATICTEXT { }

		BOOL GI_SETUP_DATA_QMC_SKY_FORCE
		{
			ANIM OFF;
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_SKY_ENABLED;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_SKY_ENABLED; }

		BOOL GI_SETUP_DATA_QMC_SKY_CUSTOM
		{
			ANIM OFF;
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_SKY_ENABLED;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_SKY_ENABLED; }

		LONG GI_SETUP_DATA_QMC_SKY_COUNT
		{
			PARENTCOLLAPSE GI_SETUP_DATA_QMC_SKY_ENABLED;
			ANIM OFF;
			MIN 1; 
			MAX 16384; 
			STEP 1; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_QMC_SKY_ENABLED; }
	}

	// **************************************************************************************************
	// --- Irradiance Cache 2.0 ---
	GROUP GI_GROUP_IC2
	{
		COLUMNS 2;

		LONG GI_SETUP_DATA_IC2_QUALITY
		{ 
			ANIM OFF;
			PARENTCOLLAPSE;
			CYCLE 
			{ 
				GI_SETUP_QUALITY_CUSTOM;
				GI_SETUP_QUALITY_PREVIEW;
				GI_SETUP_QUALITY_LOW;
				GI_SETUP_QUALITY_MEDIUM;
				GI_SETUP_QUALITY_HIGH;
			} 
		}

		STATICTEXT { SCALE_H; } 

		LONG GI_SETUP_DATA_IC2_RATE_MIN
		{
			PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY;
			ANIM OFF;
			MIN -8; 
			MAX 4; 
		}
		
		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY; }

		LONG GI_SETUP_DATA_IC2_RATE_MAX
		{
			PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY;
			ANIM OFF;
			MIN -8; 
			MAX 4; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY; }

		REAL GI_SETUP_DATA_IC2_DENSITY
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY;
			ANIM OFF;
			MIN 10.0; 
			MAX 1000.0; 
			UNIT PERCENT;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY; } 

		REAL GI_SETUP_DATA_IC2_DETAILS
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY;
			ANIM OFF;
			MIN 0.0; 
			MAX 1000.0; 
			UNIT PERCENT;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY; } 

		REAL GI_SETUP_DATA_IC2_MAX_LIMIT
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY;
			ANIM OFF;
			MIN 0.0; 
			MAX 1000.0; 
			UNIT PERCENT;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IC2_QUALITY; } 	

		REAL GI_SETUP_DATA_IC2_SMOOTHING
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 1000.0; 
			UNIT PERCENT;
		}

		STATICTEXT { } 

		REAL GI_SETUP_DATA_IC2_COLOR
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 1000.0; 
			UNIT PERCENT;
		}

		STATICTEXT { }

		BOOL GI_SETUP_DATA_IC2_SCALE
		{ 
			ANIM OFF;
		}

		STATICTEXT { }



		REAL GI_SETUP_DATA_IC2_DETAIL_REDUCTION
		{ 
			HIDDEN;
			ANIM OFF;
			MIN 0.0; 
			MAX 1000.0; 
			UNIT PERCENT;
		}

		BOOL GI_SETUP_DATA_IC2_OVERTURE
		{ 
			HIDDEN;
			ANIM OFF;
		}

		REAL GI_SETUP_DATA_IC2_A
		{ 
			HIDDEN;
			ANIM OFF;
		}

		REAL GI_SETUP_DATA_IC2_B
		{ 
			HIDDEN;
			ANIM OFF;
		}

		BOOL GI_SETUP_DATA_IC2_FLAG_A
		{ 
			HIDDEN;
			ANIM OFF;
		}

		BOOL GI_SETUP_DATA_IC2_FLAG_B
		{ 
			HIDDEN;
			ANIM OFF;
		}

		LONG GI_SETUP_DATA_IC2_MODE
		{ 
			HIDDEN;
			ANIM OFF;
			CYCLE 
			{ 
				GI_SETUP_DATA_IC2_MODE_NORMAL;
				GI_SETUP_DATA_IC2_MODE_WEIGHTED;
				GI_SETUP_DATA_IC2_MODE_SIMPLE;
				GI_SETUP_DATA_IC2_MODE_SECONDARY;
			} 
		}			
	}

	// **************************************************************************************************
	// --- Irradiance Cache ---
	GROUP GI_GROUP_IRRADIANCE				
	{
		COLUMNS 2;
		
		// **************************************************************************************************
		// --- Cache Density Section ---
		LONG GI_SETUP_DATA_IR_DENSITY_QUALITY
		{ 
			PARENTCOLLAPSE;
			ANIM OFF;
			CYCLE 
			{ 
				GI_SETUP_QUALITY_CUSTOM;
				GI_SETUP_QUALITY_PREVIEW;
				GI_SETUP_QUALITY_LOW;
				GI_SETUP_QUALITY_MEDIUM;
				GI_SETUP_QUALITY_HIGH;
				GI_SETUP_QUALITY_HIGH_DETAILS;
			} 
		}

		STATICTEXT { SCALE_H; } 

		LONG GI_SETUP_DATA_IR_DENSITY_RATE_MIN
		{
			ANIM OFF;
			MIN -8; 
			MAX 4; 
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY;
		}
		
		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; }

		LONG GI_SETUP_DATA_IR_DENSITY_RATE_MAX
		{

			ANIM OFF;
			MIN -8; 
			MAX 4; 
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; }

		REAL GI_SETUP_DATA_IR_DENSITY_RADIUS_MAX
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 100.0; 
			UNIT PERCENT;
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; } 

		REAL GI_SETUP_DATA_IR_DENSITY_RADIUS_MIN
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 100.0; 
			UNIT PERCENT;
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY;
		}


		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; } 

		REAL GI_SETUP_DATA_IR_DENSITY_CONTROL
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 100.0; 
			UNIT PERCENT;
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; }

		BOOL GI_SETUP_DATA_IR_DENSITY_PROXIMITY
		{
			ANIM OFF;
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DENSITY_QUALITY; }

		// **************************************************************************************************
		// --- Interpolation and Smoothing Properties ---
		LONG GI_SETUP_DATA_IR_INTERPOLATION_METHOD
		{ 
			ANIM OFF;
			CYCLE 
			{ 
				GI_SETUP_INTERPOLATION_LEAST_SQUARES;
				GI_SETUP_INTERPOLATION_WEIGHTED;
				GI_SETUP_INTERPOLATION_NONE;
			}
		}

		STATICTEXT {}

		LONG GI_SETUP_DATA_IR_INTERPOLATION_SMOOTHING
		{ 
			PARENTCOLLAPSE; 
			ANIM OFF;
			CYCLE 
			{ 
				GI_SETUP_SMOOTHING_CUSTOM;			
				GI_SETUP_SMOOTHING_MINIMAL;
				GI_SETUP_SMOOTHING_WEAK;
				GI_SETUP_SMOOTHING_MEDIUM;
				GI_SETUP_SMOOTHING_HEAVY;
				GI_SETUP_SMOOTHING_VERY_HEAVY;
			}
		}
		
		STATICTEXT { }

		LONG GI_SETUP_DATA_IR_INTERPOLATION_MAX_SAMPLES
		{
			PARENTCOLLAPSE GI_SETUP_DATA_IR_INTERPOLATION_SMOOTHING; 
			ANIM OFF;
			MIN 8; 
			MAX 256; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_INTERPOLATION_SMOOTHING; }
	
		REAL GI_SETUP_DATA_IR_INTERPOLATION_MAX_RADIUS_SCALE
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_IR_INTERPOLATION_SMOOTHING; 
			ANIM OFF;
			MIN 1.6; 
			MAX 8.0; 
			STEP 0.1; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_INTERPOLATION_SMOOTHING; }
		
		// **************************************************************************************************
		// --- Color Correction ---
		LONG GI_SETUP_DATA_IR_COLOR_QUALITY
		{ 
			PARENTCOLLAPSE;
			ANIM OFF;
			CYCLE 
			{
				GI_SETUP_COLOR_CUSTOM;	
				GI_SETUP_COLOR_NONE;				
				GI_SETUP_COLOR_LOW;
				GI_SETUP_COLOR_MEDIUM;
				GI_SETUP_COLOR_HIGH;
				GI_SETUP_COLOR_VERY_HIGH;
			}
		}

		STATICTEXT { } 

		LONG GI_SETUP_DATA_IR_COLOR_PASSES
		{
			ANIM OFF;
			MIN 0; 
			MAX 4; 
			PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; }

		REAL GI_SETUP_DATA_IR_COLOR_THRESHOLD
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 100.0; 
			UNIT PERCENT;
			PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; }

		REAL GI_SETUP_DATA_IR_COLOR_CUTOFF
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 100.0; 
			UNIT PERCENT;
			PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; } 

		REAL GI_SETUP_DATA_IR_COLOR_COOEF
		{ 
			ANIM OFF;
			MIN 0.0; 
			MAX 200.0; 
			UNIT PERCENT;
			PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_COLOR_QUALITY; }


		// **************************************************************************************************
		// --- Cache Secondary ---
		BOOL GI_SETUP_DATA_IR_CACHE_SECONDARY
		{ 
			HIDDEN;
			ANIM OFF;
		}

		STATICTEXT { HIDDEN; } 	

		// **************************************************************************************************
		// --- Distance Map ---
		BOOL GI_SETUP_DATA_IR_DISTANCE_MAP_ENABLED
		{
			ANIM OFF;
		}

		STATICTEXT {}
		
		// **************************************************************************************************
		// --- Visibility Check ---
		BOOL GI_SETUP_DATA_IR_VISIBILITY_CHECK_ENABLED
		{
			ANIM OFF;
		}

		STATICTEXT {}

		// **************************************************************************************************
		// --- Details Enhancement ---

		BOOL GI_SETUP_DATA_IR_DETAILS_ENABLE
		{ 
			PARENTCOLLAPSE; 
			ANIM OFF;
		}

		STATICTEXT { }

		BOOL GI_SETUP_DATA_IR_DETAILS_ADAPTIVE
		{
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; 
			ANIM OFF;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; }

		BOOL GI_SETUP_DATA_IR_DETAILS_ESTIMATE
		{
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; 
			ANIM OFF;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; }

		REAL GI_SETUP_DATA_IR_DETAILS_RADIUS
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; 
			ANIM OFF;
			MIN 0.05; 
			MAX 0.25; 
			STEP 0.01; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; }

		REAL GI_SETUP_DATA_IR_DETAILS_RATIO
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; 
			ANIM OFF;
			MIN 5.0; 
			MAX 1000.0; 
			STEP 5.0;
			UNIT PERCENT;
		}
		
		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; }			
		
		LONG GI_SETUP_DATA_IR_DETAILS_MODE
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_IR_DETAILS_ENABLE; 
			ANIM OFF;
			CYCLE 
			{ 
				GI_SETUP_DETAILS_COMBINE;
				GI_SETUP_DETAILS_DETAILS;
				GI_SETUP_DETAILS_GLOBAL;
			} 
		}
	}


	// **************************************************************************************************
	// --- Radiosity Maps ---
	GROUP GI_GROUP_RADIANCE
	{
		COLUMNS 2;

		REAL GI_SETUP_DATA_RADIANCE_SCALE
		{ 
			ANIM OFF;
			UNIT PERCENT;
			MIN 10.0;
			MAX 1000.0;
		}

		STATICTEXT { }

		LONG GI_SETUP_DATA_RADIANCE_SAMPLES
		{ 
			ANIM OFF;
			MIN 1;
			MAX 16;
		}

		STATICTEXT { }

		LONG GI_SETUP_DATA_RADIANCE_MODE
		{
			FIT_H;
			ANIM OFF;
			CYCLE
			{
				GI_SETUP_RADIANCE_MODE_NORMAL;
				GI_SETUP_RADIANCE_MODE_POINTS;
				GI_SETUP_RADIANCE_MODE_SHADED;
				GI_SETUP_RADIANCE_MODE_SHADED_FRONT;
				GI_SETUP_RADIANCE_MODE_SHADED_BACK;
			}
		}

		STATICTEXT { }

		SEPARATOR { LINE; }

		STATICTEXT { JOINENDSCALE; }

		BOOL GI_SETUP_DATA_RADIANCE_AREA_ENABLE
		{
			ANIM OFF;
		}

		STATICTEXT { }

		LONG GI_SETUP_DATA_RADIANCE_AREA_SAMPLES			
		{ 
			ANIM OFF;
			MIN 1;
			MAX 4096;
		}

		STATICTEXT { }

		SEPARATOR { LINE; }

		STATICTEXT { JOINENDSCALE; }

		BOOL GI_SETUP_DATA_RADIANCE_SKY_ENABLE
		{
			ANIM OFF;
		}

		STATICTEXT { }

		LONG GI_SETUP_DATA_RADIANCE_SKY_SAMPLES			
		{ 
			ANIM OFF;
			MIN 1;
			MAX 4096;
		}

		STATICTEXT { }
	}

	// **************************************************************************************************
	// --- Light Mapping  ---
	GROUP GI_GROUP_LIGHT_MAPPING
	{
		COLUMNS 2;

		LONG GI_SETUP_DATA_LIGHT_MAPPING_PATH_COUNT
		{
			ANIM OFF;
			MIN 1; 
			MAX 100000; 
		}

		STATICTEXT { }

		REAL GI_SETUP_DATA_LIGHT_MAPPING_PATH_SCALE_SCREEN
		{ 
			ANIM OFF;
			MIN 0.001; 
			MAX 1.0; 
			STEP 0.001; 
		}

		REAL GI_SETUP_DATA_LIGHT_MAPPING_PATH_SCALE_WORLD
		{ 
			ANIM OFF;
			UNIT METER; 
			MIN 0.001; 
			MAX 100000.0; 
			STEP 1.0; 
		}

		STATICTEXT { }

		LONG GI_SETUP_DATA_LIGHT_MAPPING_PATH_SCALE_MODE
		{ 
			FIT_H;
			ANIM OFF;
			CYCLE 
			{
				GI_SETUP_LIGHT_MAPPING_SCALE_SCREEN;
				GI_SETUP_LIGHT_MAPPING_SCALE_WORLD;
			} 
		}

		STATICTEXT { }

		BOOL GI_SETUP_DATA_LIGHT_MAPPING_PATH_DIRECT
		{ 
			ANIM OFF;
		}

		STATICTEXT { }

		BOOL GI_SETUP_DATA_LIGHT_MAPPING_PATH_CAMERA
		{
			ANIM OFF;
		}

		STATICTEXT { }

		BOOL GI_SETUP_DATA_LIGHT_MAPPING_PATH_SHOW_PATHS
		{ 
			ANIM OFF;
		}

		STATICTEXT { }

		SEPARATOR { LINE; }

		STATICTEXT { JOINENDSCALE; }

		BOOL GI_SETUP_DATA_LIGHT_MAPPING_RADIANCE
		{ 
			PARENTCOLLAPSE; 
			ANIM OFF;
		}

		STATICTEXT { }
		
		REAL GI_SETUP_DATA_LIGHT_MAPPING_RADIANCE_SCALE
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_RADIANCE;
			ANIM OFF;
			UNIT PERCENT;
			MIN 10.0;
			MAX 1000.0;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_RADIANCE; }

		LONG GI_SETUP_DATA_LIGHT_MAPPING_RADIANCE_SAMPLES
		{ 
			PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_RADIANCE;
			ANIM OFF;
			MIN 1;
			MAX 16;
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_RADIANCE; }


		BOOL GI_SETUP_DATA_LIGHT_MAPPING_PREFILTER
		{ 
			PARENTCOLLAPSE;
			ANIM OFF;
		}

		STATICTEXT { }

		LONG GI_SETUP_DATA_LIGHT_MAPPING_PREFILTER_COUNT
		{
			PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_PREFILTER;
			ANIM OFF;
			MIN 1; 
			MAX 64; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_PREFILTER; }

		LONG GI_SETUP_DATA_LIGHT_MAPPING_FILTER
		{ 
			PARENTCOLLAPSE;
			FIT_H;
			ANIM OFF;
			CYCLE 
			{
				GI_SETUP_LIGHT_MAPPING_FILTER_NONE;
				GI_SETUP_LIGHT_MAPPING_FILTER_NEAREST;
				GI_SETUP_LIGHT_MAPPING_FILTER_FIXED;
			} 
		}

		STATICTEXT { }

		LONG GI_SETUP_DATA_LIGHT_MAPPING_FILTER_COUNT
		{
			PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_FILTER;
			ANIM OFF;
			MIN 1; 
			MAX 256; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_FILTER; }

		REAL GI_SETUP_DATA_LIGHT_MAPPING_FILTER_SCALE
		{
			PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_FILTER;
			ANIM OFF;
			UNIT PERCENT;
			MIN 100.0; 
			MAX 1600.0; 
		}

		STATICTEXT { PARENTCOLLAPSE GI_SETUP_DATA_LIGHT_MAPPING_FILTER; }

		SEPARATOR { LINE; }

		STATICTEXT { JOINENDSCALE; }

		LONG GI_SETUP_DATA_LIGHT_MAPPING_MODE
		{
			FIT_H;
			ANIM OFF;
			CYCLE
			{
				GI_SETUP_LIGHT_MAPPING_MODE_NORMAL;
				GI_SETUP_LIGHT_MAPPING_MODE_VISUALIZE;
			}
		}

		STATICTEXT { }
	}

	// **************************************************************************************************
	// --- Irradiance Cache Files ---
	GROUP GI_GROUP_CACHES
	{
		GROUP GI_GROUP_CACHES_IRRADIANCE
		{	
			DEFAULT 1;
			COLUMNS 2;

			BUTTON GI_SETUP_DATA_CACHE_FLUSH 
			{ 
				FIT_H;
			}

			STATICTEXT GI_SETUP_DATA_CACHE_SIZE_RECORDS
			{
				SCALE_H;
			}

			BOOL GI_SETUP_DATA_CACHE_PREPASS
			{
				ANIM OFF;
			}

			STATICTEXT { }

			BOOL GI_SETUP_DATA_CACHE_LOCK
			{
				ANIM OFF;
			}

			STATICTEXT { }
		
			BOOL GI_SETUP_DATA_CACHE_AUTOLOAD
			{
				ANIM OFF;
			}

			STATICTEXT { }
				
			BOOL GI_SETUP_DATA_CACHE_AUTOSAVE
			{
				ANIM OFF;
			}

			STATICTEXT { }

			BOOL GI_SETUP_DATA_CACHE_ANIMATION
			{
				ANIM OFF;
			}

			STATICTEXT { }
		}

		GROUP GI_GROUP_CACHES_RADIANCE
		{	
			DEFAULT 1;
			COLUMNS 2;

			BUTTON GI_SETUP_DATA_RADIANCE_FLUSH 
			{ 
				FIT_H;
			}

			STATICTEXT GI_SETUP_DATA_RADIANCE_MEMORY
			{
				SCALE_H;
			}

		
			BOOL GI_SETUP_DATA_RADIANCE_AUTOLOAD
			{
				ANIM OFF;
			}

			STATICTEXT { }
				
			BOOL GI_SETUP_DATA_RADIANCE_AUTOSAVE
			{
				ANIM OFF;
			}

			STATICTEXT { }

			BOOL GI_SETUP_DATA_RADIANCE_ANIMATION
			{
				ANIM OFF;
			}

			STATICTEXT { }
		}

		GROUP GI_GROUP_CACHES_LIGHT_MAPPING
		{	
			DEFAULT 1;
			COLUMNS 2;

			BUTTON GI_SETUP_DATA_LIGHT_MAPPING_FLUSH 
			{ 
				FIT_H;
			}

			STATICTEXT GI_SETUP_DATA_LIGHT_MAPPING_MEMORY
			{
				SCALE_H;
			}

		
			BOOL GI_SETUP_DATA_LIGHT_MAPPING_AUTOLOAD
			{
				ANIM OFF;
			}

			STATICTEXT { }
				
			BOOL GI_SETUP_DATA_LIGHT_MAPPING_AUTOSAVE
			{
				ANIM OFF;
			}

			STATICTEXT { }

			BOOL GI_SETUP_DATA_LIGHT_MAPPING_ANIMATION
			{
				ANIM OFF;
			}

			STATICTEXT { }
		}

		GROUP GI_GROUP_CACHES_LOCATION
		{
			DEFAULT 1;

			BOOL GI_SETUP_DATA_CACHE_CUSTOM_PATH_ENABLED
			{
				ANIM OFF;
			}

			FILENAME GI_SETUP_DATA_CACHE_CUSTOM_PATH
			{
				ANIM OFF;
				SAVE;
			}
		}
	}

	// **************************************************************************************************
	// --- Extra Options
	GROUP GI_GROUP_OPTIONS
	{
		LONG GI_SETUP_DATA_EXTRA_DEBUG_LEVEL
		{
			ANIM OFF;
			CYCLE 
			{ 
				GI_SETUP_DEBUG_NONE;
				GI_SETUP_DEBUG_MINIMAL;
				GI_SETUP_DEBUG_COMPLETE;
			} 

		}

		REAL GI_SETUP_DATA_EXTRA_NON_DIFFUSE_CUTOFF
		{ 
			ANIM OFF;
			MIN 50.0; 
			MAX 100.0; 
			UNIT PERCENT;
		}

		BOOL GI_SETUP_DATA_EXTRA_REFRACTIVECAUSTICS 
		{ 
			ANIM OFF; 
		}

		BOOL GI_SETUP_DATA_EXTRA_REFLECTIVECAUSTICS 
		{ 
			ANIM OFF; 
		}

		BOOL GI_SETUP_DATA_EXTRA_DIFFUSE_ONLY
		{
			ANIM OFF;
		}

		BOOL GI_SETUP_DATA_EXTRA_HIDE_PREPASS
		{
			ANIM OFF;
		}

		BOOL GI_SETUP_DATA_EXTRA_SHOW_SAMPLES
		{
			ANIM OFF;
		}
	}
}
