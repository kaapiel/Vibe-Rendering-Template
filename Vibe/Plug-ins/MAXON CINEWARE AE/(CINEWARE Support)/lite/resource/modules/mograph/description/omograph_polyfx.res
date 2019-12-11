CONTAINER Omograph_polyfx
{
	NAME		Omograph_polyfx;
	INCLUDE Obasemogen;

	GROUP		ID_OBJECTPROPERTIES
	{
		LONG	MGPOLYFX_MODE
		{
			CYCLE
			{
				MGPOLYFX_MODE_FULL;
				MGPOLYFX_MODE_PART;
			}
			FIT_H;
		}
		
		BOOL	MGPOLYFX_PRESERVE_PHONG { }
	}
	
	HIDE ID_MG_TRANSFORM_COLOR;
	HIDE ID_MG_TRANSFORM_DISPLAYMODE;
	HIDE ID_MG_TRANSFORM_TIME;
}
