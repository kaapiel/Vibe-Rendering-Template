CONTAINER GVmatrixmulvect
{
	NAME GVmatrixmulvect;
	INCLUDE GVbase;

	GROUP ID_GVPROPERTIES
	{
		BOOL GV_MATRIXMULVECT_NORMAL { }
	}

	GROUP ID_GVPORTS
	{
		MATRIX GV_MATRIXMULVECT_INPUT1   { INPORT;  STATICPORT; CREATEPORT; }
		VECTOR GV_MATRIXMULVECT_INPUT2   { INPORT;  STATICPORT; CREATEPORT; }

		VECTOR GV_MATRIXMULVECT_OUTPUT { OUTPORT; STATICPORT; CREATEPORT; }
	}
}
