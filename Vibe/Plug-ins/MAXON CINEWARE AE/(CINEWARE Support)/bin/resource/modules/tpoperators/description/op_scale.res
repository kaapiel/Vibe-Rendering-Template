CONTAINER OP_Scale
{
	NAME OP_Scale;
	INCLUDE GVbase;

	GROUP ID_GVPROPERTIES
	{
	}

	GROUP ID_GVPORTS
	{
		REAL				SCALE_SCALE   { INPORT; EDITPORT; UNIT PERCENT; STEP 1.0;}
		REAL				SCALE_VAR     { INPORT; EDITPORT; UNIT PERCENT; MIN 0.0; MAX 100.0; STEP 1.0;}
		REAL				SCALE_XSCALE  { INPORT; EDITPORT; UNIT PERCENT; STEP 1.0;}
		REAL				SCALE_YSCALE  { INPORT; EDITPORT; UNIT PERCENT; STEP 1.0;}
		REAL				SCALE_ZSCALE  { INPORT; EDITPORT; UNIT PERCENT; STEP 1.0;}
		BOOL				SCALE_OVERAGE	{ INPORT; EDITPORT; }
		GRADIENT		SCALE_AGEGRAD	{ INPORT; EDITPORT; ALPHA; }

	
		BOOL      	IN_SCALE_ON				{ INPORT; PORTONLY; }
		BASETIME   	IN_SCALE_ATIME		{ INPORT; PORTONLY; }
		TP_PARTICLE	IN_SCALE_PARTICLE	{ INPORT; PORTONLY; STATICPORT; NEEDCONNECTION; CREATEPORT; }
	}
}
