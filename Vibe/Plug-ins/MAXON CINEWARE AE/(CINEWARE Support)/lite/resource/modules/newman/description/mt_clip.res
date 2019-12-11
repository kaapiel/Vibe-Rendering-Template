CONTAINER MT_CLIP
{
	NAME MT_CLIP;
	INCLUDE Obaselist;

	GROUP Obaselist
	{
		HIDE ID_LAYER_LINK;
		SEPARATOR { LINE; }

		GROUP
		{
			COLUMNS 2;

			COLOR ID_MT_CLIP_COLOR { FIT_H; ANIM OFF; } STATICTEXT { JOINEND; }
			BOOL ID_MT_CLIP_LOCK	 { ANIM OFF; } STATICTEXT { JOINEND; }
			BOOL ID_MT_CLIP_GHOST	 { ANIM OFF; } STATICTEXT { JOINEND; }
			LINK ID_MT_CLIP_SOURCE { FIT_H; ANIM OFF; FORBID_INLINE_FOLDING; ACCEPT { Obase; } } STATICTEXT { JOINEND; }

			SEPARATOR { LINE; } STATICTEXT { JOINENDSCALE; }

			BASETIME ID_MT_CLIP_VIEWSTART  {ANIM OFF;}          BASETIME ID_MT_CLIP_VIEWEND	 {ANIM OFF;}
			REAL ID_MT_CLIP_LOOP {ANIM OFF; UNIT REAL;MIN 0.0;} BOOL ID_MT_CLIP_LOOPRELATIVE {ANIM OFF; }

			SEPARATOR { LINE; } STATICTEXT { JOINENDSCALE; }
			
			BOOL ID_MT_CLIP_AUTO	{ANIM OFF; } 
			BOOL ID_MT_CLIP_AUTOGAP	{ANIM OFF; } 

			BASETIME ID_MT_CLIP_MIX_START  {ANIM OFF;}  BASETIME ID_MT_CLIP_MIX_END  {ANIM OFF;}

			LONG ID_MT_CLIP_TYPEFADEOUT
			{
				FIT_H;
				ANIM OFF;
				CYCLE
				{
					ID_MT_CLIP_FADEOFF;
					ID_MT_CLIP_FADEEASE;
					ID_MT_CLIP_FADELINEAR;
					ID_MT_CLIP_EASEIN;
					ID_MT_CLIP_EASEOUT;
					ID_MT_CLIP_FADESPLINE;
				}
			}
			STATICTEXT {JOINEND; }			

			SPLINE ID_MT_CLIP_FADESPLINEWND
			{
				FIT_H; 
				ANIM OFF;

				SHOWGRID_H;
				SHOWGRID_V;

				EDIT_H;
				EDIT_V;

				X_MIN 0;
				X_MAX 1;

				Y_MIN 0;
				Y_MAX 1;

				X_STEPS 0.1;
				Y_STEPS 0.1;
			}
			STATICTEXT {JOINEND; }			
		}
		DEFAULT	1;
	}

	GROUP ID_MT_CLIP_TREE_PAGE
	{
		SCALE_V;

		SOURCECLIP ID_MT_CLIP_SOURCEVIEW {CUSTOMGUI SOURCECLIPGUI; SCALE_V; SCALE_H;}

		DEFAULT	0;
	}

	GROUP ID_MT_CLIP_EXPERT_PAGE
	{

		GROUP ID_MT_TRIM
		{
			DEFAULT 1;
			LAYOUTGROUP; COLUMNS 2;
			GROUP { BASETIME ID_MT_CLIP_TRIMSTART	   {ANIM OFF; MIN 0.0;} }
			GROUP { BASETIME ID_MT_CLIP_TRIMEND		   {ANIM OFF; MIN 0.0;} }

		}

		SEPARATOR { LINE; }

		LINK ID_MT_CLIP_PIVOT { ACCEPT { 100004839; } } 

		GROUP
		{
			COLUMNS 2;
			
			BUTTON ID_MT_CLIP_CREATEPIVOT 	{} BUTTON ID_MT_CLIP_CREATEPIVOTK	{}
			STATICTEXT {} STATICTEXT {}
			BUTTON ID_MT_CLIP_SNAP1 {} STATICTEXT {}
			BUTTON ID_MT_CLIP_SNAP2 {} STATICTEXT {}
			BUTTON ID_MT_CLIP_SNAP3 {} STATICTEXT {}
		}

		SEPARATOR { LINE; }

		SPLINE ID_MT_CLIP_TIMWARPWND
		{
			ANIM OFF;

			SHOWGRID_H;
			SHOWGRID_V;

			EDIT_H;
			EDIT_V;

			X_MIN 0;
			X_MAX 1;

			Y_MIN 0;
			Y_MAX 1;

			X_STEPS 0.1;
			Y_STEPS 0.1;

		}


		DEFAULT	0;
	}
}
