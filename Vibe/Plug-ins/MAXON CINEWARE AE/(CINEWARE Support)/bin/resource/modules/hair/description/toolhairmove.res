CONTAINER ToolHairMove
{
	NAME ToolHairMove;
	INCLUDE ToolBase;

	HIDE MDATA_COMMANDGROUP;

	GROUP MDATA_MAINGROUP
	{
		BOOL HAIR_MOVE_IK { }
		BOOL HAIR_MOVE_COLLISIONS { }
		REAL HAIR_MOVE_RADIUS { UNIT METER; MIN 0.0; }
	}
}
