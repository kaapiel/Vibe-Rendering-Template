CONTAINER Xstar
{
	NAME Xstar;

	INCLUDE Mpreview;
	INCLUDE Xbase;

	GROUP ID_SHADERPROPERTIES
	{
		COLOR STARSHADER_COLOR1 {}
		COLOR STARSHADER_COLOR2 {}
		LONG  STARSHADER_STREAKS { MIN 4; MAX 12; }
		REAL  STARSHADER_INNERRADIUS { UNIT PERCENT; MIN 0.0; MAX 1000.0; }
		REAL  STARSHADER_OUTERRADIUS { UNIT PERCENT; MIN 0.0; MAX 1000.0; }
		REAL  STARSHADER_DENSITY { MIN 1.0; MAX 100.0; STEP 0.1; }
	}
}