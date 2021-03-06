CONTAINER ToolSplineRound
{
  NAME ToolSplineRound;
	INCLUDE ToolBase;

  GROUP MDATA_MAINGROUP
  {
		LONG MDATA_SPLINEROUND_POINTS { MIN 3; MAX 10000; }
		LONG MDATA_SPLINEROUND_TYPE
		{
			CYCLE
			{
				MDATA_SPLINEROUND_TYPE_LINEAR;
				MDATA_SPLINEROUND_TYPE_CUBIC;
				MDATA_SPLINEROUND_TYPE_AKIMA;
				MDATA_SPLINEROUND_TYPE_BSPLINE;
				MDATA_SPLINEROUND_TYPE_BEZIER;
			}
		}
  }
}
