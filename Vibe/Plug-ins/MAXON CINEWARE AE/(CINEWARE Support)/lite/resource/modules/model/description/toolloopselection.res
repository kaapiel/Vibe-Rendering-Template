CONTAINER ToolLoopSelection
{
	NAME ToolLoopSelection;
	INCLUDE ToolBase;

	GROUP MDATA_MAINGROUP
	{
		BOOL MDATA_LOOP_SEL_STOP_AT_BOUNDS { }
		BOOL MDATA_LOOP_SEL_SELECT_BOUNDS { }
		BOOL MDATA_LOOP_SEL_GREEDY_SEARCH { }
	}
	HIDE MDATA_COMMANDGROUP;
}
