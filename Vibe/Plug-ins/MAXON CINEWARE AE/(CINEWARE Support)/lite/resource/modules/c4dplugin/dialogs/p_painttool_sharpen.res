// C4D-DialogResource

DIALOG P_PAINTTOOL_SHARPEN
{
	NAME TITLE;
	SCALE_H; SCALE_V;

	GROUP
	{
		COLUMNS 1;
		SCALE_H; SCALE_V;

		CHECKBOX PGD_FILL_MERGELAYER { NAME TMERGELAYERS; }

		GROUP
		{
			COLUMNS 2;
			SCALE_H;
			
			STATICTEXT { NAME TSHARPEN; }
			EDITSLIDER PGD_SHARPEN_STRENGTH { SCALE_H; SIZE 0,11; }
		}

		BRUSHEDITOR { SCALE_H; SCALE_V; }
	}
}
