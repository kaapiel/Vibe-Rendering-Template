CONTAINER Odeflector
{
	NAME Odeflector;
	INCLUDE Obase;

	GROUP ID_OBJECTPROPERTIES
	{
		REAL DEFLECTOROBJECT_ELASTICITY { UNIT PERCENT; MIN 0.0; }
		BOOL DEFLECTOROBJECT_SPLIT {}
		REAL DEFLECTOROBJECT_SIZEX { UNIT METER; MIN 0.0; }
		REAL DEFLECTOROBJECT_SIZEY { UNIT METER; MIN 0.0; }
	}
}
