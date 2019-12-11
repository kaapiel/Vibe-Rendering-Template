CONTAINER Ocamuscle
{
	NAME Ocamuscle;
	INCLUDE Obase;
	
	GROUP ID_OBJECTPROPERTIES
	{
		LONG ID_CA_MUSCLE_OBJECT_MODE
		{
			SCALE_H; ANIM OFF; 
			
			CUSTOMGUI RADIOBUTTONS; COLUMNS 2;
			
			CYCLE
			{
				ID_CA_MUSCLE_OBJECT_MODE_EDIT;
				ID_CA_MUSCLE_OBJECT_MODE_ANIMATE;
			}
		}
		
		GROUP
		{
			COLUMNS 2;
			
			LONG ID_CA_MUSCLE_OBJECT_STATE
			{
				SCALE_H; ANIM OFF; PARENTCOLLAPSE;
				
				CUSTOMGUI QUICKTABRADIO;
							
				CYCLE
				{
					ID_CA_MUSCLE_OBJECT_STATE_RELAX;
					ID_CA_MUSCLE_OBJECT_STATE_COMPRESSED;
					ID_CA_MUSCLE_OBJECT_STATE_EXTENDED;
				}
			}
			
			BOOL ID_CA_MUSCLE_OBJECT_AUTO_COMPRESS { HIDDEN; }
			BOOL ID_CA_MUSCLE_OBJECT_AUTO_EXTEND { HIDDEN; }			
		}
		
		GROUP
		{
			COLUMNS 2;
			
			REAL ID_CA_MUSCLE_OBJECT_RELAX_LENGTH { UNIT METER; MIN 0.0; MAXSLIDER 1000; CUSTOMGUI REALSLIDER; SCALE_H; }
			REAL ID_CA_MUSCLE_OBJECT_COMPRESS_LENGTH { UNIT METER; MIN 0.0; MAXSLIDER 1000; CUSTOMGUI REALSLIDER; SCALE_H; HIDDEN; }
			REAL ID_CA_MUSCLE_OBJECT_EXTEND_LENGTH { UNIT METER; MIN 0.0; MAXSLIDER 1000; CUSTOMGUI REALSLIDER; SCALE_H; HIDDEN; }
			BUTTON ID_CA_MUSCLE_OBJECT_STATE_SET { }
		}
		
		SPLINE ID_CA_MUSCLE_OBJECT_SHAPE_RELAX
		{
			PARENTCOLLAPSE ID_CA_MUSCLE_OBJECT_STATE;
		}		

		SPLINE ID_CA_MUSCLE_OBJECT_SHAPE_COMPRESS
		{ 
			HIDDEN;
			PARENTCOLLAPSE ID_CA_MUSCLE_OBJECT_STATE;
		}		
		
		SPLINE ID_CA_MUSCLE_OBJECT_SHAPE_EXTEND
		{
			HIDDEN;
			PARENTCOLLAPSE ID_CA_MUSCLE_OBJECT_STATE;
		}		
				
		GROUP ID_CA_MUSCLE_OBJECT_ANCHORS_GROUP
		{	
			DEFAULT 1;
			
			GROUP
			{
				COLUMNS 3;
				
				BUTTON ID_CA_MUSCLE_OBJECT_ANCHORS_ADD { SCALE_H; }
				BUTTON ID_CA_MUSCLE_OBJECT_ANCHORS_REMOVE { SCALE_H; }
				BOOL ID_CA_MUSCLE_OBJECT_AUTO_ALIGN { ANIM OFF; }
			}
			
			SEPARATOR { }
			
			GROUP ID_CA_MUSCLE_OBJECT_ANCHORS_LIST_GROUP
			{
				COLUMNS 1;
			}	
		}
				
		GROUP ID_CA_MUSCLE_OBJECT_GEOM_GROUP
		{				
			LONG ID_CA_MUSCLE_OBJECT_TYPE
			{
				HIDDEN;
				
				CYCLE
				{
					ID_CA_MUSCLE_OBJECT_TYPE_LINEAR;
					ID_CA_MUSCLE_OBJECT_TYPE_CUBIC;
					ID_CA_MUSCLE_OBJECT_TYPE_AKIMA;
					ID_CA_MUSCLE_OBJECT_TYPE_BSPLINE;
				}
			}
									
			LONG ID_CA_MUSCLE_OBJECT_SEGMENTS_COUNT { MIN 1; ANIM OFF; }
			LONG ID_CA_MUSCLE_OBJECT_RADIAL_COUNT { MIN 3; ANIM OFF; }
			
			SEPARATOR { } 
			
			LONG ID_CA_MUSCLE_OBJECT_SUBD { MIN 0; MAX 6; ANIM OFF; }
			
			LONG ID_CA_MUSCLE_OBJECT_SEGMENTS_RES { MIN 1; HIDDEN; }
			LONG ID_CA_MUSCLE_OBJECT_RADIAL_RES { MIN 3; HIDDEN; }		
		}
				
		GROUP ID_CA_MUSCLE_OBJECT_TRANSITION_GROUP
		{
			SPLINE ID_CA_MUSCLE_OBJECT_SHAPE_TRANSITION
			{
			}		
		}
		
		GROUP ID_CA_MUSCLE_OBJECT_DEFORM_GROUP
		{
			LONG ID_CA_MUSCLE_OBJECT_SUBD_CALC { MIN 0; MAX 6; ANIM OFF; }
			
			LONG ID_CA_MUSCLE_OBJECT_DEFORM
			{
				CYCLE
				{
					ID_CA_MUSCLE_OBJECT_DEFORM_RADIAL;
					ID_CA_MUSCLE_OBJECT_DEFORM_NORMAL;
					ID_CA_MUSCLE_OBJECT_DEFORM_DIRECTION;
				}
			}
			
			REAL ID_CA_MUSCLE_OBJECT_FATOFFSET { UNIT METER; MIN 0.0; MAXSLIDER 100.0; CUSTOMGUI REALSLIDER; }
			
			LINK ID_CA_MUSCLE_OBJECT_DEFORM_DIRECTION_LINK { ACCEPT { Obase; } }
		}
	}
	
	GROUP ID_CA_MUSCLE_OBJECT_DYNAMICS_GROUP
	{
		SCALE_V;
		
		GROUP
		{
			GROUP
			{
				COLUMNS 2;
				
				BOOL ID_CA_MUSCLE_OBJECT_DYNAMICS { }
				BOOL ID_CA_MUSCLE_OBJECT_DYNAMICS_FRAME { }
			}
			
			REAL ID_CA_MUSCLE_OBJECT_STRENGTH { UNIT PERCENT; MIN 0.0; MAXSLIDER 100.0; CUSTOMGUI REALSLIDER; }
			REAL ID_CA_MUSCLE_OBJECT_STIFFNESS { UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER; }			
			REAL ID_CA_MUSCLE_OBJECT_STRUCTUAL_STIFFNESS { UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER;  }
			REAL ID_CA_MUSCLE_OBJECT_VOLUME_STIFFNESS { UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER;  }
			REAL ID_CA_MUSCLE_OBJECT_DRAG { UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER; }
			
			SPLINE ID_CA_MUSCLE_OBJECT_STIFFNESS_CURVE
			{
			}
		}
		
		GROUP ID_CA_MUSCLE_OBJECT_DYNAMICS_FORCES_GROUP
		{
			DEFAULT 1; SCALE_V;
			
			REAL ID_CA_MUSCLE_OBJECT_GRAVITY { UNIT METER; }
			
			IN_EXCLUDE  ID_CA_MUSCLE_OBJECT_FORCES
			{
				NUM_FLAGS 0; INIT_STATE 1; SEND_SELCHNGMSG 1; SCALE_V;
				ACCEPT { Obase; };
			}
		}
	
		GROUP ID_CA_MUSCLE_OBJECT_DYNAMICS_ADV_GROUP
		{
			COLUMNS 2;
			
			LONG ID_CA_MUSCLE_OBJECT_SPRINGS { MIN 0; MAX 100; }
			LONG ID_CA_MUSCLE_OBJECT_ITERATIONS { MIN 1; MAX 1000; }
		}
	}	
}