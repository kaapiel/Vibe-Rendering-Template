CONTAINER Opolyreduxgen
{
	NAME Opolyreduxgen;
	INCLUDE Obase;

	GROUP ID_OBJECTPROPERTIES
	{
		BOOL POLYREDUXOBJECT_REDUCE_ALL_AS_ONE			{ ANIM OFF; }
		REAL POLYREDUXOBJECT_STRENGTH								{ MIN 0.0; MAX 100.0; UNIT PERCENT; CUSTOMGUI REALSLIDER; }
		LONG POLYREDUXOBJECT_TRIANGLE_COUNT					{ MIN 0; }
		LONG POLYREDUXOBJECT_VERTEX_COUNT						{ MIN 0; }
		LONG POLYREDUXOBJECT_REMAINING_EDGES_COUNT	{ MIN 0; }

		BOOL POLYREDUXOBJECT_PRESERVE_3D_BOUNDARY		{ ANIM OFF; }
		BOOL POLYREDUXOBJECT_PRESERVE_UV_BOUNDARY		{ ANIM OFF; }
		REAL POLYREDUXOBJECT_REDUCE_BOUNDARY_ANGLE	{ UNIT DEGREE; MIN 0.0; MAX 180.0; ANIM OFF; }

		GROUP
		{
			STATICTEXT POLYREDUXOBJECT_NO_REDUCTION		{ ANIM OFF; }
		}
	}
}
