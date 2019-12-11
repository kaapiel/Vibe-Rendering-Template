CONTAINER OP_Size
{
	NAME OP_Size;
	INCLUDE GVbase;

	GROUP ID_GVPROPERTIES
	{
	}

	GROUP ID_GVPORTS
	{
		REAL				SIZE_SIZE		  { INPORT; EDITPORT; STEP 0.1;}
		REAL				SIZE_VAR	    { INPORT; EDITPORT; UNIT PERCENT; MIN 0.0; MAX 100.0; STEP 1.0;}
		BOOL				SIZE_OVERAGE	{ INPORT; EDITPORT; }
		GRADIENT		SIZE_AGEGRAD	{ INPORT; EDITPORT; ALPHA; }

	
		TP_PARTICLE	IN_SIZE_PARTICLE	{ INPORT; PORTONLY; STATICPORT; NEEDCONNECTION; CREATEPORT; }
		BOOL      	IN_SIZE_ON				{ INPORT; PORTONLY; }
		BASETIME   	IN_SIZE_ATIME			{ INPORT; PORTONLY; }
	}
}
