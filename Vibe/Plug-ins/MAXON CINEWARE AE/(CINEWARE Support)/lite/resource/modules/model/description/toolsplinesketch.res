CONTAINER ToolSplineSketch
{
	NAME ToolSplineSketch;
	INCLUDE ToolBase;

	HIDE MDATA_COMMANDGROUP;

	GROUP MDATA_MAINGROUP
	{
		REAL MDATA_SPLINESKETCH_RADIUS { MIN 0.0; MAXSLIDER 100.0; STEP 1.0; CUSTOMGUI REALSLIDER; ANIM OFF; }
		REAL MDATA_SPLINESKETCH_SMOOTHING { UNIT PERCENT; MIN 0.0; MAX 100.0; STEP 1.0; CUSTOMGUI REALSLIDER;  ANIM OFF;}
		REAL MDATA_SPLINESKETCH_BLEND { UNIT PERCENT; MIN 0.0; MAX 100.0; STEP 1.0; CUSTOMGUI REALSLIDER;  ANIM OFF; }
		BOOL MDATA_SPLINESKETCH_NEWSPLINE { ANIM OFF; }
	//	BOOL MDATA_SPLINESKETCH_SMOOTH { ANIM OFF; }
	}
}
