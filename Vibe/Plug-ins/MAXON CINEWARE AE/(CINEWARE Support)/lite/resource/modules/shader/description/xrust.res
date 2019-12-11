CONTAINER Xrust
{
	NAME Xrust;

	INCLUDE Mpreview;
	INCLUDE Xbase;

	GROUP ID_SHADERPROPERTIES
	{
		GRADIENT RUSTSHADER_COLOR { ICC_BASEDOCUMENT; }
		REAL  RUSTSHADER_LEVEL { UNIT PERCENT; MIN 0.0; MAX 100.0; }
		REAL  RUSTSHADER_FREQUENCY { MIN 0.0; STEP 0.01; }
	}
}