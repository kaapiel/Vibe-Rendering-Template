CONTAINER dmodeling
{
  NAME dmodeling;

	GROUP SNAP_SETTINGS
	{
		BOOL SNAP_SETTINGS_ENABLED { ANIM OFF; }
		BOOL SNAP_SETTINGS_TOOL { ANIM OFF; }
		
		LONG SNAPMODE_COMBO
		{
		//ANIM OFF;
		CYCLE

			{


			}
		}

			
		SEPARATOR { LINE; }

		REAL SNAP_SETTINGS_RADIUS { UNIT REAL; MIN 0.1; MAX 100; ANIM OFF; }
		REAL SNAP_SETTINGS_GUIDEANGLE { UNIT DEGREE; MIN 0.1; MAX 180.0; STEP 1.0; ANIM OFF; }

		SEPARATOR { LINE; }
		
		BOOL SNAPMODE_POINT { ANIM OFF; }
		BOOL SNAPMODE_EDGE	{ ANIM OFF; }
		BOOL SNAPMODE_POLYGON { ANIM OFF; }
		BOOL SNAPMODE_SPLINE { ANIM OFF; }
		BOOL SNAPMODE_AXIS  { ANIM OFF; }
		BOOL SNAPMODE_INTERSECTION { ANIM OFF; }
		BOOL SNAPMODE_MIDPOINT { ANIM OFF; }
		
		SEPARATOR { LINE; }

		BOOL SNAPMODE_WORKPLANE { PARENTCOLLAPSE; ANIM OFF; }
		BOOL SNAPMODE_GRIDPOINT  { PARENTCOLLAPSE SNAPMODE_WORKPLANE; ANIM OFF; }
		BOOL SNAPMODE_GRIDLINE  { PARENTCOLLAPSE SNAPMODE_WORKPLANE; ANIM OFF; }

		BOOL SNAPMODE_GUIDE { PARENTCOLLAPSE; ANIM OFF; }
		BOOL SNAPMODE_DYNAMICGUIDE { PARENTCOLLAPSE SNAPMODE_GUIDE; ANIM OFF; }
		BOOL SNAPMODE_ORTHO  { PARENTCOLLAPSE SNAPMODE_GUIDE; ANIM OFF; }

		SEPARATOR { LINE; }

		GROUP SNAP_LIST
		{
		}
	}

	GROUP QUANTIZE_SETTINGS
	{
		BOOL QUANTIZE_ENABLED { ANIM OFF; }
		SEPARATOR { LINE; }
		REAL QUANTIZE_MOVE { UNIT METER; MIN 0.001; MAXSLIDER 1000.0; STEP 1.0; ANIM OFF; }
		REAL QUANTIZE_SCALE { UNIT PERCENT; MIN 0.01; MAXSLIDER 100.0; STEP 1.0; ANIM OFF; }
		REAL QUANTIZE_ROTATE { UNIT DEGREE; MIN 0.1; MAX 180.0; STEP 1.0; ANIM OFF; }
		REAL QUANTIZE_TEXTURE { UNIT REAL; MIN 0.01; MAXSLIDER 1.0; STEP 0.01; ANIM OFF; }
	}

	GROUP GUIDES_SETTINGS
	{
		REAL SNAP_SETTINGS_GUIDEANGLE { UNIT DEGREE; MIN 0.1; MAX 180.0; STEP 1.0; ANIM OFF; }
	}

	GROUP MESH_CHECK
	{
		BOOL MESH_CHECK_ENABLED { ANIM OFF; }
		SEPARATOR { LINE; }

		GROUP
		{
		LAYOUTGROUP; COLUMNS 4;
		GROUP
		{
			BOOL MESH_CHECK_POINT { ANIM OFF; }
			BOOL MESH_CHECK_EDGEPOINT { ANIM OFF; }
			REAL MESH_CHECK_EDGEPOINT_THRESHOLD { ANIM OFF; MIN 0.0; MAX 180.0; STEP 0.01; UNIT DEGREE; }
			BOOL MESH_CHECK_POLEPOINT { ANIM OFF; }
			LONG MESH_CHECK_POLE_MIN { ANIM OFF; MIN 5;}
			BOOL MESH_CHECK_MANIFOLD { ANIM OFF; }
			BOOL MESH_CHECK_BOUNDARY { ANIM OFF; }
			BOOL MESH_CHECK_POLY { ANIM OFF; }
			BOOL MESH_CHECK_NORMAL { ANIM OFF; }
			REAL MESH_CHECK_NORMAL_THRESHOLD { ANIM OFF; MIN 0.0; MAX 180.0; STEP 0.01; UNIT DEGREE; }
		}

		GROUP
		{
			COLOR MESH_CHECK_POINT_COLOR  { ANIM OFF; }
			COLOR MESH_CHECK_EDGEPOINT_COLOR { ANIM OFF; }
			STATICTEXT {}
			COLOR MESH_CHECK_POLEPOINT_COLOR { ANIM OFF; }
			STATICTEXT {}
			COLOR MESH_CHECK_MANIFOLD_COLOR  { ANIM OFF; }
			COLOR MESH_CHECK_BOUNDARY_COLOR  { ANIM OFF; }
			COLOR MESH_CHECK_POLY_COLOR  { ANIM OFF; }
			COLOR MESH_CHECK_NORMAL_COLOR { ANIM OFF; }
			STATICTEXT {}
		}

		GROUP
		{
			BUTTON MESH_CHECK_POINT_SELECT { }
			BUTTON MESH_CHECK_EDGEPOINT_SELECT { }
			STATICTEXT {}
			BUTTON MESH_CHECK_POLEPOINT_SELECT { }
			STATICTEXT {}
			BUTTON MESH_CHECK_MANIFOLD_SELECT { }
			BUTTON MESH_CHECK_BOUNDARY_SELECT { }
			BUTTON MESH_CHECK_POLY_SELECT {}
			BUTTON MESH_CHECK_NORMAL_SELECT {}
			STATICTEXT {}
		}

		GROUP
		{
			STATICTEXT MESH_CHECK_POINT_TEXT  { ANIM OFF; }
			STATICTEXT MESH_CHECK_EDGEPOINT_TEXT { ANIM OFF; }
			STATICTEXT {}
			STATICTEXT MESH_CHECK_POLEPOINT_TEXT { ANIM OFF; }
			STATICTEXT {}
			STATICTEXT MESH_CHECK_MANIFOLD_TEXT  { ANIM OFF; }
			STATICTEXT MESH_CHECK_BOUNDARY_TEXT  { ANIM OFF; }
			STATICTEXT MESH_CHECK_POLY_TEXT  { ANIM OFF; }
			STATICTEXT MESH_CHECK_NORMAL_TEXT { ANIM OFF; }
			STATICTEXT {}
		}
		}
	} 

	GROUP MODELING_OPTION
	{
		HIDDEN;
		BOOL MODELING_OPTION_SOLO { ANIM OFF; }
	}
}