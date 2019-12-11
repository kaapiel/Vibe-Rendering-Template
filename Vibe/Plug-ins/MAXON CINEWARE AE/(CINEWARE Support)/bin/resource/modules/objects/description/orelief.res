CONTAINER Orelief
{
	NAME Orelief;
	INCLUDE Obase;

	GROUP ID_OBJECTPROPERTIES
	{
		TEXTURE PRIM_RELIEF_TEXTURE {}
		VECTOR PRIM_RELIEF_LEN { UNIT METER; MIN 0.0; }
		LONG PRIM_RELIEF_SUBW { MIN 4; MAX 1000; }
		LONG PRIM_RELIEF_SUBH	{ MIN 4; MAX 1000; }
		REAL PRIM_RELIEF_BLEVEL { UNIT PERCENT; MIN 0.0; MAX 100.0; }
		REAL PRIM_RELIEF_TLEVEL { UNIT PERCENT; MIN 0.0; MAX 100.0; }
		INCLUDE Oprimitiveaxis;
		BOOL PRIM_RELIEF_SPHERICAL {}
	}
}
