CONTAINER Osphere
{
	NAME Osphere;
	INCLUDE Obase;

	GROUP ID_OBJECTPROPERTIES
	{
		REAL PRIM_SPHERE_RAD { UNIT METER; MIN 0.0; }
		LONG PRIM_SPHERE_SUB { MIN 3; MAX 1000; }
		LONG PRIM_SPHERE_TYPE
		{
			CYCLE
			{
				PRIM_SPHERE_TYPE_STANDARD;
				PRIM_SPHERE_TYPE_TETRA;
				PRIM_SPHERE_TYPE_HEXA;
				PRIM_SPHERE_TYPE_OCTA;
				PRIM_SPHERE_TYPE_ICOSA;
				PRIM_SPHERE_TYPE_HEMISPHERE;
			}
		}
		BOOL PRIM_SPHERE_PERFECT {}
	}
}
