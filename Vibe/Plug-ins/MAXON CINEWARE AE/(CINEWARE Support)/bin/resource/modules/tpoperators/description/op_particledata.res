CONTAINER OP_ParticleData
{
	NAME OP_ParticleData;
	INCLUDE GVbase;

	GROUP ID_GVPROPERTIES
	{
	}

	GROUP ID_GVPORTS
	{
		VECTOR     	IN_PART_POSITION	{ INPORT; PORTONLY; }
		VECTOR     	IN_PART_VELOCITY	{ INPORT; PORTONLY; }
		BASETIME   	IN_PART_LIFE			{ INPORT; PORTONLY; }
		BASETIME   	IN_PART_AGE				{ INPORT; PORTONLY; }
		REAL      	IN_PART_SIZE			{ INPORT; PORTONLY; }
		VECTOR     	IN_PART_SCALE			{ INPORT; PORTONLY; }
		REAL      	IN_PART_MASS			{ INPORT; PORTONLY; }
		MATRIX     	IN_PART_ALIGNMENT	{ INPORT; PORTONLY; }
		TP_SPIN   	IN_PART_SPIN			{ INPORT; PORTONLY; }
		TP_SHAPE   	IN_PART_SHAPE			{ INPORT; PORTONLY; }
		TP_GROUP   	IN_PART_GROUP			{ INPORT; PORTONLY; }
		REAL				IN_PART_DTFAC			{ INPORT; PORTONLY; }
		LONG	    	IN_PART_RANDOMSEED{ INPORT; PORTONLY; }
		BOOL      	IN_PART_ON				{ INPORT; PORTONLY; }
		VECTOR     	IN_PART_COLOR			{ INPORT; PORTONLY; }
		TP_PARTICLE	IN_PART_PARTICLE	{ INPORT; PORTONLY; STATICPORT; NEEDCONNECTION; CREATEPORT; }
	}
}
