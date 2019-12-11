CONTAINER GVdegree
{
	NAME GVdegree;
	INCLUDE GVbase;

	GROUP ID_GVPROPERTIES
	{
		LONG GV_DEGREE_FUNCTION_ID 
		{ 
			CYCLE 
			{ 
				GV_RAD2DEGREE_NODE_FUNCTION; 
				GV_DEGREE2RAD_NODE_FUNCTION;
			}
		}
	}

	GROUP ID_GVPORTS
	{
		REAL GV_DEGREE_INPUT  { INPORT; STATICPORT; CREATEPORT; }
		REAL GV_DEGREE_OUTPUT { OUTPORT; STATICPORT; CREATEPORT; }
	}
}
