CONTAINER Oeinheritance
{
	NAME		Oeinheritance;

	INCLUDE Obase;

	GROUP		MGINHERITANCEEFFECTOR_GROUPEFFECTOR
	{
		DEFAULT 1;

		REAL	MGINHERITANCEEFFECTOR_STRENGTH
		{
			MINSLIDER 0.0;
			MAXSLIDER 100.0;
			UNIT			PERCENT;
			CUSTOMGUI REALSLIDER;
		}
		STRING MGINHERITANCEEFFECTOR_SELECTION
		{
		}
		SEPARATOR
		{
			LINE;
		}
		LONG	MGINHERITANCEEFFECTOR_MODE
		{
			CYCLE
			{
				MGINHERITANCEEFFECTOR_MODE_DIRECT;
				MGINHERITANCEEFFECTOR_MODE_ANIMATION;
			}
		}
		LINK	MGINHERITANCEEFFECTOR_OBJECT
		{
			ACCEPT
			{
				Obase;
			}
		}
		BOOL	MGINHERITANCEEFFECTOR_MORPHMG {}
		BOOL	MGINHERITANCEEFFECTOR_FALLOFFTIME {}
		GROUP
		{
			COLUMNS 2;

			LONG	MGINHERITANCEEFFECTOR_SPACEMODE
			{
				CYCLE
				{
					MGINHERITANCEEFFECTOR_SPACEMODE_GLOBAL;
					MGINHERITANCEEFFECTOR_SPACEMODE_NODE;
				}
			}
			LONG	MGINHERITANCEEFFECTOR_EASE
			{
				CYCLE
				{
					MGINHERITANCEEFFECTOR_EASE_IN;
					MGINHERITANCEEFFECTOR_EASE_OUT;
				}
			}
			BASETIME	MGINHERITANCEEFFECTOR_ANIMATEFROM {}
			BASETIME	MGINHERITANCEEFFECTOR_STEP {}
			BASETIME	MGINHERITANCEEFFECTOR_ANIMATETO {}
			BOOL	MGINHERITANCEEFFECTOR_LOOPANIMATION {}
		}
	}
	GROUP MGINHERITANCEEFFECTOR_GROUPPARAMETER
	{
		DEFAULT 1;

		GROUP MGINHERITANCEEFFECTOR_GROUPTRANSFORM
		{
			DEFAULT 1;

			GROUP
			{
				COLUMNS 3;

				BOOL	MGINHERITANCEEFFECTOR_POSITION_ACTIVE {}
				BOOL	MGINHERITANCEEFFECTOR_SCALE_ACTIVE {}
				BOOL	MGINHERITANCEEFFECTOR_ROTATION_ACTIVE {}
			}
		}
	}
	INCLUDE Oedeformer_panel;
	INCLUDE Ofalloff_panel;
}
