CONTAINER Xcheckerboard
{
	NAME Xcheckerboard;

	INCLUDE Mpreview;
	INCLUDE Xbase;

	GROUP ID_SHADERPROPERTIES
	{
		COLOR CHECKERBOARDSHADER_COLOR1 {}
		COLOR CHECKERBOARDSHADER_COLOR2 {}
		REAL  CHECKERBOARDSHADER_SCALEX { MIN 0.0; STEP 0.01; }
		REAL  CHECKERBOARDSHADER_SCALEY { MIN 0.0; STEP 0.01; }
	}
}