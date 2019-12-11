// C4D-DialogResource
DIALOG IDD_SCULPT_RESYM
{
	NAME IDS_DIALOG;  SCALE_H; 
	GROUP
	{
		SCALE_H;
		BORDERSIZE 4, 4, 4, 4; 
		SPACE 4, 4;
		COLUMNS 1;
		BORDERSTYLE BORDER_GROUP_IN;
		CHECKBOX IDC_SCULPT_RESYM_FINDNEAREST { NAME IDS_SCULPT_RESYM_FINDNEAREST; }
	}

  GROUP
  {
	  BORDERSIZE 4, 4, 4, 4; 
	  COLUMNS 1;
	  SPACE 4, 4;
	  SCALE_H; 
	  NAME IDS_SCULPT_RESYM_MIRROR;
	  BORDERSTYLE BORDER_GROUP_IN;

	  GROUP
	  {
		  BORDERSIZE 4, 4, 4, 4; 
		  COLUMNS 2;
		  SPACE 4, 4;
		  SCALE_H; 
	        
			STATICTEXT { NAME IDS_SCULPT_RESYM_MIRROR_MODE; CENTER_V; ALIGN_LEFT; }
  			RADIOGROUP IDC_SCULPT_RESYM_MIRROR_MODE
			{
				GROUP
				{
					COLUMNS 6;
					RADIOGADGET IDC_SCULPT_RESYM_MIRROR_MODE_XMIN { NAME IDS_SCULPT_RESYM_MIRROR_MODE_XMIN; }
					RADIOGADGET IDC_SCULPT_RESYM_MIRROR_MODE_XMAX { NAME IDS_SCULPT_RESYM_MIRROR_MODE_XMAX; }
					RADIOGADGET IDC_SCULPT_RESYM_MIRROR_MODE_YMIN { NAME IDS_SCULPT_RESYM_MIRROR_MODE_YMIN; }
					RADIOGADGET IDC_SCULPT_RESYM_MIRROR_MODE_YMAX { NAME IDS_SCULPT_RESYM_MIRROR_MODE_YMAX; }
					RADIOGADGET IDC_SCULPT_RESYM_MIRROR_MODE_ZMIN { NAME IDS_SCULPT_RESYM_MIRROR_MODE_ZMIN; }
					RADIOGADGET IDC_SCULPT_RESYM_MIRROR_MODE_ZMAX { NAME IDS_SCULPT_RESYM_MIRROR_MODE_ZMAX; }
				}
			}
	  }
   
	  GROUP
	  {
		ALIGN_TOP; SCALE_H; 
		BORDERSIZE 4, 4, 4, 4; 
		COLUMNS 3;
		SPACE 4, 4;
		BUTTON IDC_SCULPT_RESYM_MIRROR_LAYER { NAME IDS_SCULPT_RESYM_MIRROR_LAYER; }
		BUTTON IDC_SCULPT_RESYM_MIRROR_MASK { NAME IDS_SCULPT_RESYM_MIRROR_MASK; }
		BUTTON IDC_SCULPT_RESYM_MIRROR_OBJECT { NAME IDS_SCULPT_RESYM_MIRROR_OBJECT; }
	  }
	}

  GROUP
  {
	  BORDERSIZE 4, 4, 4, 4; 
	  COLUMNS 1;
	  SPACE 4, 4;
	  SCALE_H; 
	  NAME IDS_SCULPT_RESYM;
	  BORDERSTYLE BORDER_GROUP_IN;

	  GROUP
	  {
		  BORDERSIZE 4, 4, 4, 4; 
		  COLUMNS 2;
		  SPACE 4, 4;
		  SCALE_H; SCALE_V;
	        
			STATICTEXT { NAME IDS_SCULPT_RESYM_MODE; CENTER_V; ALIGN_LEFT; }
  			RADIOGROUP IDC_SCULPT_RESYM_MODE
			{
				GROUP
				{
					COLUMNS 3;
					RADIOGADGET IDC_SCULPT_RESYM_MODE_X { NAME IDS_SCULPT_RESYM_MODE_X; }
					RADIOGADGET IDC_SCULPT_RESYM_MODE_Y { NAME IDS_SCULPT_RESYM_MODE_Y; }
					RADIOGADGET IDC_SCULPT_RESYM_MODE_Z { NAME IDS_SCULPT_RESYM_MODE_Z; }
				}
			}
	  }
   
	  GROUP
	  {
		ALIGN_TOP; SCALE_H; 
		BORDERSIZE 4, 4, 4, 4; 
		COLUMNS 3;
		SPACE 4, 4;
		BUTTON IDC_SCULPT_RESYM_LAYER { NAME IDS_SCULPT_RESYM_LAYER; }
		BUTTON IDC_SCULPT_RESYM_OBJECT { NAME IDS_SCULPT_RESYM_OBJECT; }
		BUTTON IDC_SCULPT_RESYM_SMART { NAME IDS_SCULPT_RESYM_SMART; }
	  }
	}
}