CONTAINER Tool_MGGrid
{
	NAME		Tool_MGGrid;
	INCLUDE ToolBase;
	//INCLUDE Tool_AxisHelper;

	GROUP		MDATA_MAINGROUP
	{
		VECTOR	MDATA_MGGRIDTOOL_CENTER
		{
			ANIM	OFF;
		}
		VECTOR	MDATA_MGGRIDTOOL_RADIUS
		{
			ANIM	OFF;
		}
		VECTOR	MDATA_MGGRIDTOOL_COUNT
		{
			MIN 1;
			STEP 1;
			ANIM	OFF;
		}
		SEPARATOR
		{
			LINE;
		}
		LONG	MDATA_MGGRIDTOOL_MODE
		{
			CYCLE
			{
				MDATA_MGGRIDTOOL_MODE_CLONE;
				MDATA_MGGRIDTOOL_MODE_INSTANCE;
			}
			ANIM	OFF;
		}
	}
}
