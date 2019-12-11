CONTAINER Owrap
{
	NAME Owrap;
	INCLUDE Obase;

	GROUP ID_OBJECTPROPERTIES
	{
		REAL  WRAPOBJECT_WIDTH		{ MIN 0.0; UNIT METER; }
		REAL  WRAPOBJECT_HEIGHT   { MIN 0.0; UNIT METER; }
		REAL  WRAPOBJECT_RADIUS		{ MIN 0.0; UNIT METER; }
		SEPARATOR { LINE; }
		LONG  WRAPOBJECT_TYPE			{ CYCLE { WRAPTYPE_SPHERICAL; WRAPTYPE_CYLINDRICAL; } }
		REAL  WRAPOBJECT_XSANGLE	{ PARENTID WRAPOBJECT_TYPE; UNIT DEGREE; }
		REAL  WRAPOBJECT_XEANGLE	{ PARENTID WRAPOBJECT_TYPE; UNIT DEGREE; }
		REAL  WRAPOBJECT_YSANGLE	{ PARENTID WRAPOBJECT_TYPE; MIN -90; MAX 90; UNIT DEGREE; }
		REAL  WRAPOBJECT_YEANGLE	{ PARENTID WRAPOBJECT_TYPE; MIN -90; MAX 90; UNIT DEGREE; }
		SEPARATOR { LINE; }
		REAL  WRAPOBJECT_MOVE			{ UNIT METER; }
		REAL  WRAPOBJECT_ZSCALE		{ MIN 0.0; MAX 10000; UNIT PERCENT; }
		REAL  WRAPOBJECT_TENSION	{ MIN 0.0; MAX 100.0; UNIT PERCENT; }
		SEPARATOR		{ LINE; }
		BUTTON	WRAPOBJECT_FITTOPARENT	{  }
	}
}
