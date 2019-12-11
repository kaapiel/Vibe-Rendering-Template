CONTAINER Oepushapart
{
	NAME		Oepushapart;

	INCLUDE Obase;

	GROUP		MGPUSHAPARTEFFECTOR_GROUPEFFECTOR
	{
		DEFAULT 1;

		REAL	MGPUSHAPARTEFFECTOR_STRENGTH
		{
			MINSLIDER 0.0;
			MAXSLIDER 100.0;
			UNIT			PERCENT;
			CUSTOMGUI REALSLIDER;
		}
		STRING MGPUSHAPARTEFFECTOR_SELECTION
		{
		}
		SEPARATOR
		{
			LINE;
		}
		LONG	MGPUSHAPARTEFFECTOR_MODE
		{
			CYCLE
			{
				MGPUSHAPARTEFFECTOR_MODE_HIDE;
				MGPUSHAPARTEFFECTOR_MODE_PUSHAPART;
				MGPUSHAPARTEFFECTOR_MODE_SCALEAPART;
				MGPUSHAPARTEFFECTOR_MODE_ALONGX;
				MGPUSHAPARTEFFECTOR_MODE_ALONGY;
				MGPUSHAPARTEFFECTOR_MODE_ALONGZ;
			}
			FIT_H;
		}

		REAL MGPUSHAPARTEFFECTOR_RADIUS { MIN 0.0; UNIT METER; }
		LONG MGPUSHAPARTEFFECTOR_ITERATIONS { MIN 0; MAX 1000; }
	}
	INCLUDE Oedeformer_panel;
	
}
