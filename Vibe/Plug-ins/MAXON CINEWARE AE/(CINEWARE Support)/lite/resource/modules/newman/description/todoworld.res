CONTAINER ToDoWorld
{
	NAME ToDoWorld;

	GROUP TODOWORLD_TASK_GROUP
	{
		SCALE_V;
		DEFAULT 1;
		COLUMNS 1;
		TODOWORLD TODOWORLD_TASK_TREE { CUSTOMGUI TODOWORLDGUI; ANIM OFF; SCALE_V; FIT_H; SCALE_H; }
		STRING TODOWORLD_TASK_NOTE { CUSTOMGUI MULTISTRING; ANIM OFF; }
		GROUP
		{
			COLUMNS 2;
			BUTTON TODOWORLD_DONE { ANIM OFF; }
			BUTTON TODOWORLD_TASK_DELETE { ANIM OFF; }
		}
	}

	GROUP TODOWORLD_DONE_GROUP
	{
		SCALE_V;
		DEFAULT 0;
		COLUMNS 1;

		TODOWORLD TODOWORLD_DONE_TREE { CUSTOMGUI TODOWORLDGUI; ANIM OFF; SCALE_V; FIT_H; SCALE_H; }
		STRING TODOWORLD_DONE_NOTE { CUSTOMGUI MULTISTRING; ANIM OFF; }

		GROUP
		{
			COLUMNS 2;
			BUTTON TODOWORLD_TASK { ANIM OFF; }
			BUTTON TODOWORLD_DONE_DELETE { ANIM OFF; }
		}
	}
}
