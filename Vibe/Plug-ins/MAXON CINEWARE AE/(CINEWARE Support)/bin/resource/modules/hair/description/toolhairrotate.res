CONTAINER ToolHairRotate
{
	NAME ToolHairRotate;
	INCLUDE ToolBase;

	HIDE MDATA_COMMANDGROUP;

	GROUP MDATA_MAINGROUP
	{
		LONG HAIR_ROTATE_AROUND
		{
			CYCLE
			{
				HAIR_ROTATE_AROUND_ROOT;
				HAIR_ROTATE_AROUND_CURSOR;
			}
		}

		BOOL HAIR_ROTATE_IK { }
		BOOL HAIR_ROTATE_COLLISIONS { }
		REAL HAIR_ROTATE_RADIUS { UNIT METER; MIN 0.0; }
	}
}
