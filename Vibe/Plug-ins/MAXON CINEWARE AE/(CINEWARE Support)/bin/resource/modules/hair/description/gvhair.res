CONTAINER GVhair
{
	NAME GVhair;
	INCLUDE GVbase;

	GROUP ID_GVPROPERTIES
	{
		LINK GV_HAIR_OBJECT { ACCEPT { 1017305; } }

		LONG GV_HAIR_OBJECT_MODE
		{ 
			CYCLE 
			{  
				GV_HAIR_OBJECT_MODE_GUIDE; 
				GV_HAIR_OBJECT_MODE_DYNAMIC_GUIDE;
				GV_HAIR_OBJECT_MODE_HAIR;
			} 
		}
	}

	GROUP ID_GVPORTS
	{
		GVGENERALOBJECT GV_HAIR_INPUT_OBJECT { INPORT; STATICPORT; CREATEPORT; }

		LONG GV_HAIR_OUTPUT_GUIDE_COUNT { OUTPORT; STATICPORT; CREATEPORT; }
		LONG GV_HAIR_OUTPUT_GUIDE_SEGMENTS { OUTPORT; STATICPORT; CREATEPORT; }
	}
}
