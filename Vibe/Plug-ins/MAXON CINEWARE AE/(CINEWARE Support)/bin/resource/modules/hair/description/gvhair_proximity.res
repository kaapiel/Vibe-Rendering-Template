CONTAINER GVhair_proximity
{
	NAME GVhair_proximity;
	INCLUDE GVbase;

	GROUP ID_GVPROPERTIES
	{
		LINK GV_HAIR_PROXIMITY_OBJECT { ACCEPT { 1017305; } }

		LONG GV_HAIR_PROXIMITY_MODE
		{ 
			CYCLE 
			{ 
				GV_HAIR_PROXIMITY_MODE_GUIDE; 
				GV_HAIR_PROXIMITY_MODE_DYNAMIC_GUIDE;
				GV_HAIR_PROXIMITY_MODE_HAIR;
			} 
		}
	}

	GROUP ID_GVPORTS
	{
		GVGENERALOBJECT GV_HAIR_PROXIMITY_INPUT_OBJECT { INPORT; STATICPORT; CREATEPORT; }
		VECTOR GV_HAIR_PROXIMITY_INPUT_POINT { INPORT; STATICPORT; CREATEPORT; }

		LONG GV_HAIR_PROXIMITY_POINT_INT { OUTPORT; STATICPORT; CREATEPORT; }
		LONG GV_HAIR_PROXIMITY_POINT_GUIDE { OUTPORT; }
		LONG GV_HAIR_PROXIMITY_POINT_SEGMENT { OUTPORT; }
		VECTOR GV_HAIR_PROXIMITY_POINT_VEC { OUTPORT; STATICPORT; CREATEPORT; }
		REAL GV_HAIR_PROXIMITY_POINT_T { OUTPORT; }
	}
}
