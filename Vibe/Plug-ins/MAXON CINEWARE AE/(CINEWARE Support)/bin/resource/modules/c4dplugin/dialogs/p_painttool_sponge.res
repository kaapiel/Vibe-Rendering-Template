// C4D-DialogResource

DIALOG P_PAINTTOOL_SPONGE
{
	NAME TITLE;
	SCALE_H; SCALE_V;

	GROUP
	{
		COLUMNS 1;
		SCALE_H; SCALE_V;

		RADIOGROUP PGD_SPECIALBRUSH_MODE
		{
			GROUP
			{
				ROWS 1;
				RADIOGADGET PGD_SPECIALBRUSH_MODE_DESAT	{ NAME TDESAT; }
				RADIOGADGET PGD_SPECIALBRUSH_MODE_SAT		{ NAME TSAT; }
			}
		}

		GROUP
		{
			SCALE_H;
			ROWS 1;
			STATICTEXT { NAME TEXP; }
			EDITSLIDER PGD_SPECIALBRUSH_STRENGTH { NAME TEXP; SCALE_H; }
		}

		BRUSHEDITOR { SCALE_H; SCALE_V; }
	}
}
