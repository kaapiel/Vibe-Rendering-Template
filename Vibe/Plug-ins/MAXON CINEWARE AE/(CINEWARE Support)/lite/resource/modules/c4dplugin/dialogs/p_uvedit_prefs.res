// C4D-DialogResource

DIALOG P_UVEDIT_PREFS
{
  NAME TITLE;

	SCALE_H;
	SCALE_V;

	TAB IDC_TAB
	{
		SCALE_H;
		SCALE_V;

		GROUP IDC_GET1
		{
			SCALE_H;
			SCALE_V;

			BORDERSIZE 4,4,4,4;

			NAME TOPTIONS;
			COLUMNS 1;

			CHECKBOX IDC_X3 { NAME TLINKMODE; }
			CHECKBOX IDC_Y1 { NAME TCLIPMODE; }

			GROUP
			{
				COLUMNS 2;

				GROUP
				{
					COLUMNS 1;
					SPACE 4,4;
					NAME TSELECT;
					BORDERSIZE 4,4,4,4;
					BORDERSTYLE BORDER_GROUP_IN;
					SCALE_V;

					CHECKBOX IDC_X2 { NAME TTOLERANT; }
					CHECKBOX IDC_SELECTLIVE_VISIBLE { NAME TVISIBLE; }
					GROUP
					{
						STATICTEXT IDC_SELECT_RADIUS_TEXT { NAME TLIVESELECTION; SIZE 80,15; }
						EDITNUMBERARROWS IDC_X1 { SIZE 80,0; }
					}
				}

				GROUP IDC_UV_MAGNET_GROUP
				{
					COLUMNS 1;
					SPACE 4,4;
					NAME TDRAGNET;
					BORDERSIZE 4,4,4,4;
					BORDERSTYLE BORDER_GROUP_IN;
					SCALE_V;

					CHECKBOX IDC_X4 { NAME TUSE; }

					GROUP
					{
						STATICTEXT { NAME TRADIUS; }
						EDITNUMBERARROWS IDC_X5 { SIZE 80,0; }
					}
				}
			}
		}

		GROUP IDC_GET2
		{
			BORDERSIZE 4,4,4,4;
			NAME TSNAPQUANT;
			COLUMNS 2;

			GROUP
			{
				COLUMNS 1;
				SPACE 4,4;
				NAME TSNAP;
				BORDERSIZE 4,4,4,4;
				BORDERSTYLE BORDER_GROUP_IN;
				SCALE_H;
				SCALE_V;

				CHECKBOX IDC_SNAP_POINT { NAME TPOINT; }
				CHECKBOX IDC_SNAP_EDGE  { NAME TEDGE; }

				GROUP
				{
					STATICTEXT { NAME TRADIUS; }
					EDITNUMBERARROWS IDC_SNAP_RADIUS { SIZE 80,0; }
				}
			}

			GROUP
			{
				COLUMNS 2;
				SPACE 4,1;
				NAME TQUANTIZE;
				BORDERSIZE 4,4,4,4;
				BORDERSTYLE BORDER_GROUP_IN;
				SCALE_H;
				SCALE_V;

				CHECKBOX IDC_SNAP_LOCAL_MOVEENABLE { NAME TMOVE; }
				EDITNUMBERARROWS IDC_SNAP_LOCAL_MOVE { SIZE 80,0; }

				CHECKBOX IDC_SNAP_LOCAL_SCALEENABLE { NAME TSCALE; }
				EDITNUMBERARROWS IDC_SNAP_LOCAL_SCALE { SIZE 80,0; }

				CHECKBOX IDC_SNAP_LOCAL_ROTATEENABLE { NAME TROTATE; }
				EDITNUMBERARROWS IDC_SNAP_LOCAL_ROTATE { SIZE 80,0; }
			}
		}

		GROUP IDC_GET3
		{
			COLUMNS 1;
			SPACE 4,4;
			NAME TM_MAGNET;
			BORDERSIZE 4,4,4,4;

			CHECKBOX IDP_UVEDIT_MAGNET_NEAREST { NAME TM_NEAREST; SIZE 0,15; }

			GROUP
			{
				COLUMNS 2;
				
				STATICTEXT { NAME TM_RADIUS; SIZE 80,15; }
				EDITNUMBERARROWS IDP_UVEDIT_MAGNET_RADIUS { SIZE 80,0; }

				STATICTEXT { NAME TM_TYPE; SIZE 80,15; }
				COMBOBOX IDP_UVEDIT_MAGNET_TYPE
				{
					ALIGN_LEFT;
					CHILDS
					{
						0,T6;
						1,T7;
						2,T8;
						3,T9;
						4,T10;
						5,T11;
					}
				}

				STATICTEXT { NAME TM_WIDTH; SIZE 80,15; }
				EDITNUMBERARROWS IDP_UVEDIT_MAGNET_WIDTH  { SIZE 80,0; }
			}
		}
	}
}
