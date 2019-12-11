CONTAINER Dbasedraw
{
	NAME Dbasedraw;

	GROUP BASEDRAW_GROUP_DISPLAY
	{
		DEFAULT 1;

		STRING BASEDRAW_TITLE { ANIM OFF; }

		GROUP BASEDRAW_GROUP_ACTIVEOBJECT
		{
			DEFAULT 1;

			LONG BASEDRAW_DATA_SDISPLAYACTIVE
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_SDISPLAY_GOURAUD					;
					BASEDRAW_SDISPLAY_GOURAUD_WIRE		;
					BASEDRAW_SDISPLAY_QUICK						;
					BASEDRAW_SDISPLAY_QUICK_WIRE			;
					BASEDRAW_SDISPLAY_FLAT						;
					BASEDRAW_SDISPLAY_FLAT_WIRE				;
					BASEDRAW_SDISPLAY_HIDDENLINE			;
					BASEDRAW_SDISPLAY_NOSHADING				;
				}
			}
			LONG BASEDRAW_DATA_WDISPLAYACTIVE
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_WDISPLAY_WIREFRAME				;
					BASEDRAW_WDISPLAY_ISOPARMS				;
					BASEDRAW_WDISPLAY_BOX							;
					BASEDRAW_WDISPLAY_SKELETON				;
				}
			}

			GROUP
			{
				COLUMNS 2;
				
				BOOL BASEDRAW_DATA_USEPROPERTIESACTIVE { ANIM OFF; }
				BOOL BASEDRAW_DATA_XRAY { ANIM OFF;}
				//STATICTEXT { JOINEND; }

				BOOL BASEDRAW_DATA_SHOWNORMALS { ANIM OFF;}
				//STATICTEXT { JOINEND; }
				BOOL BASEDRAW_DATA_SELECTED_NORMALS { ANIM OFF;}

				BOOL BASEDRAW_DATA_SHOW_VERTEX_NORMALS { ANIM OFF;}
				BOOL BASEDRAW_DATA_SELECTED_VERTEX_NORMALS { ANIM OFF;}

				BOOL BASEDRAW_DATA_SHOWPATH { ANIM OFF;}
				//STATICTEXT { JOINEND; }

				//BOOL BASEDRAW_DATA_TINT_POLYGON_SELECTION { ANIM OFF;}
				//BOOL BASEDRAW_DATA_TINT_POLYGON_NORMALS { ANIM OFF;}

				BOOL BASEDRAW_DATA_SDSEDIT { ANIM OFF;}
				BOOL BASEDRAW_DATA_DEFORMEDEDIT { ANIM OFF;}

				BOOL BASEDRAW_DATA_EDGE_POINTS { ANIM OFF;}
				//BOOL BASEDRAW_DATA_SHADE_HANDLES { ANIM OFF;}

				//BOOL BASEDRAW_DATA_ACTIVE_STEMS { ANIM OFF;}
				BOOL BASEDRAW_DATA_ROTATION_BANDS { ANIM OFF;}
				//STATICTEXT { JOINEND; }

				BOOL BASEDRAW_DATA_USE_LAYERCOLOR { ANIM OFF; }
				
				BOOL BASEDRAW_DATA_BOUNDINGBOXSELECTION	{ ANIM OFF;}
				BOOL BASEDRAW_DATA_BOUNDINGBOXSELECTION_CHILDREN { ANIM OFF;}
				BOOL BASEDRAW_DATA_WIREFRAMESELECTION	{ ANIM OFF;}
				BOOL BASEDRAW_DATA_WIREFRAMESELECTION_CHILDREN { ANIM OFF;}
				BOOL BASEDRAW_DATA_OUTLINE { ANIM OFF;}
			}
		}

		GROUP BASEDRAW_GROUP_INACTIVEOBJECT
		{
			DEFAULT 1;

			BOOL BASEDRAW_DATA_DISPLAYINACTIVE_ENABLED { ANIM OFF; }

			LONG BASEDRAW_DATA_SDISPLAYINACTIVE
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_SDISPLAY_GOURAUD					;
					BASEDRAW_SDISPLAY_GOURAUD_WIRE		;
					BASEDRAW_SDISPLAY_QUICK						;
					BASEDRAW_SDISPLAY_QUICK_WIRE			;
					BASEDRAW_SDISPLAY_FLAT						;
					BASEDRAW_SDISPLAY_FLAT_WIRE				;
					BASEDRAW_SDISPLAY_HIDDENLINE			;
					BASEDRAW_SDISPLAY_NOSHADING				;
				}
			}
			LONG BASEDRAW_DATA_WDISPLAYINACTIVE
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_WDISPLAY_WIREFRAME				;
					BASEDRAW_WDISPLAY_ISOPARMS				;
					BASEDRAW_WDISPLAY_BOX							;
					BASEDRAW_WDISPLAY_SKELETON				;
				}
			}

			BOOL BASEDRAW_DATA_USEPROPERTIESINACTIVE { ANIM OFF;}
		}
	}

	GROUP BASEDRAW_GROUP_FILTER
	{
		COLUMNS 2;

		BOOL BASEDRAW_DISPLAYFILTER_NULL { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_POLYGON { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_SPLINE { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_GENERATOR { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_HYPERNURBS { ANIM OFF;}
		//BOOL BASEDRAW_DISPLAYFILTER_BONE { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_JOINT { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_DEFORMER { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_CAMERA { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_LIGHT { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_SCENE { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_PARTICLE { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_OTHER { ANIM OFF;}
		//BOOL BASEDRAW_DISPLAYFILTER_NULLBONES { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_GRID { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_BASEGRID { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_HORIZON { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_WORLDAXIS { ANIM OFF;} 
		BOOL BASEDRAW_DISPLAYFILTER_BOUNDS { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_HUD { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_SDS { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_HIGHLIGHTING { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_OBJECTHIGHLIGHTING { ANIM OFF; }
		BOOL BASEDRAW_DISPLAYFILTER_HIGHLIGHTING_HANDLES { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_MULTIAXIS { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_OBJECTHANDLES { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_HANDLEBANDS { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_SDSCAGE { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_NGONLINES { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_ONION { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_GUIDELINES { ANIM OFF;}
		BOOL BASEDRAW_DISPLAYFILTER_GRADIENT { ANIM OFF; }
		BOOL BASEDRAW_DISPLAYFILTER_POI { ANIM OFF; }
	}

	GROUP BASEDRAW_GROUP_VIEW
	{
		LONG BASEDRAW_DATA_PROJECTION
		{
			ANIM OFF;
			CYCLE
			{
				BASEDRAW_PROJECTION_PERSPECTIVE;
				BASEDRAW_PROJECTION_PARALLEL;
				BASEDRAW_PROJECTION_LEFT;
				BASEDRAW_PROJECTION_RIGHT;
				BASEDRAW_PROJECTION_FRONT;
				BASEDRAW_PROJECTION_BACK;
				BASEDRAW_PROJECTION_TOP;
				BASEDRAW_PROJECTION_BOTTOM;
				BASEDRAW_PROJECTION_MILITARY;
				BASEDRAW_PROJECTION_FROG;
				BASEDRAW_PROJECTION_BIRD;
				BASEDRAW_PROJECTION_GENTLEMAN;
				BASEDRAW_PROJECTION_ISOMETRIC;
				BASEDRAW_PROJECTION_DIMETRIC;
			}
		}

		LINK BASEDRAW_DATA_CAMERA { ACCEPT { Obase; } ANIM OFF;}

		BOOL BASEDRAW_DATA_TEXTURES { ANIM OFF;}
		BOOL BASEDRAW_DATA_BACKCULL { ANIM OFF;}

		BOOL BASEDRAW_DATA_SHOWSAFEFRAME { ANIM OFF;}

		GROUP
		{
			COLUMNS 3;

			BOOL BASEDRAW_DATA_RENDERSAFE { ANIM OFF;}
			STATICTEXT { JOINEND; }
			BOOL BASEDRAW_DATA_RENDERSAFE_CENTER { ANIM OFF;}

			BOOL BASEDRAW_DATA_TITLESAFE { ANIM OFF;}
			REAL BASEDRAW_DATA_TITLESAFE_SIZE { UNIT PERCENT; MIN 0.0; MAX 100.0; ANIM OFF;}
			BOOL BASEDRAW_DATA_TITLESAFE_CENTER { ANIM OFF;}

			BOOL BASEDRAW_DATA_ACTIONSAFE { ANIM OFF;}
			REAL BASEDRAW_DATA_ACTIONSAFE_SIZE { UNIT PERCENT; MIN 0.0; MAX 100.0; ANIM OFF;}
			BOOL BASEDRAW_DATA_ACTIONSAFE_CENTER { ANIM OFF;}

			BOOL BASEDRAW_DATA_TINTBORDER { ANIM OFF;}
			REAL BASEDRAW_DATA_TINTBORDER_OPACITY { UNIT PERCENT; MIN 0.0; MAX 100.0; ANIM OFF;}
			COLOR BASEDRAW_DATA_TINTBORDER_COLOR { ANIM OFF;}
		}

		GROUP
		{
			COLUMNS 2;
			
			REAL BASEDRAW_DATA_OBJECTAXIS_SCALE { UNIT PERCENT; MIN 0.0; MAX 400.0; ANIM OFF;}
			STATICTEXT { JOINEND; }

			REAL BASEDRAW_DATA_NORMALS_SCALE { UNIT PERCENT; MIN 0.0; MAX 400.0; ANIM OFF;}
			REAL BASEDRAW_DATA_ROTBAND_SCALE { UNIT PERCENT; MIN 0.0; MAX 400.0; ANIM OFF;}

			LONG BASEDRAW_DATA_POINT_HANDLE_SIZE { MIN 0; MAX 10; ANIM OFF;}
			REAL BASEDRAW_DATA_ROTATION_CIRCLE { UNIT PERCENT; MIN 0.0; MAX 300.0; ANIM OFF;}
			
			LONG BASEDRAW_DATA_POINT_SELECTED_SIZE { MIN 0; MAX 10; ANIM OFF;}
			LONG BASEDRAW_DATA_EDGE_SELECTED_SIZE { MIN 0; MAX 10; ANIM OFF;}

			REAL BASEDRAW_DATA_OUTLINE_WIDTH			{ MIN 1.0; MAX 10.0; ANIM OFF; }
		}

		LONG BASEDRAW_DATA_EDITOR_AXIS_POS { ANIM OFF;CYCLE { BASEDRAW_AXIS_POS_OFF; BASEDRAW_AXIS_POS_BL; BASEDRAW_AXIS_POS_TL; BASEDRAW_AXIS_POS_TR; BASEDRAW_AXIS_POS_BR; } }
		LONG BASEDRAW_DATA_EDITOR_AXIS_TYPE { ANIM OFF;CYCLE { BASEDRAW_AXIS_TYPE_WORLD; BASEDRAW_AXIS_TYPE_OBJECT; } }
		REAL BASEDRAW_DATA_EDIT_AXIS_SCALE { ANIM OFF;UNIT PERCENT; MIN 0.0; MAX 400.0; }
		BOOL BASEDRAW_DATA_EDIT_AXIS_TEXT { ANIM OFF;}
		
		//LONG BASEDRAW_DATA_NAVIGAION_POS { ANIM OFF;CYCLE { BASEDRAW_AXIS_POS_OFF; BASEDRAW_AXIS_POS_BL; BASEDRAW_AXIS_POS_TL; BASEDRAW_AXIS_POS_TR; BASEDRAW_AXIS_POS_BR; } }
		//REAL BASEDRAW_DATA_NAVIGAION_OPACITY { ANIM OFF;UNIT PERCENT; MIN 0; MAX 100; }
		//REAL BASEDRAW_DATA_NAVIGAION_SIZE { ANIM OFF;UNIT PERCENT; MIN 0; MAX 1000; }
		
		SEPARATOR BASEDRAW_DATA_HQ_SEP { LINE; }

		GROUP
		{
			COLUMNS 2;

			BOOL BASEDRAW_DATA_ENABLE_LWF { ANIM OFF; } 	
		}
	}

	GROUP BASEDRAW_GROUP_BACKGROUND
	{
		BOOL BASEDRAW_DATA_SHOWPICTURE { ANIM OFF;}
		FILENAME BASEDRAW_DATA_PICTURE { ANIM OFF;}
		LONG BASEDRAW_DATA_BACKIMAGEMODE
		{
			ANIM OFF;
			CYCLE
			{
				BASEDRAW_DATA_BACKIMAGEMODE_NEAREST;
				BASEDRAW_DATA_BACKIMAGEMODE_LINEAR;
			}
		}
		BOOL BASEDRAW_DATA_KEEP_ASEPECT { ANIM OFF;}

		GROUP
		{
			COLUMNS 2;

			REAL BASEDRAW_DATA_OFFSETX { ANIM OFF;}
			REAL BASEDRAW_DATA_SIZEX { ANIM OFF;}

			REAL BASEDRAW_DATA_OFFSETY { ANIM OFF;}
			REAL BASEDRAW_DATA_SIZEY { ANIM OFF;}
			REAL BASEDRAW_DATA_PICTURE_ROTATION { ANIM OFF;UNIT DEGREE; }
		}

		GROUP
		{
			COLUMNS 1;
			REAL BASEDRAW_DATA_PICTURE_TRANSPARENCY { ANIM OFF;MIN 0.0; MAX 99.0; UNIT PERCENT; CUSTOMGUI REALSLIDER; }
			LONG BASEDRAW_DATA_PICTURE_USEALPHA { ANIM OFF;CYCLE { BASEDRAW_ALPHA_NONE; BASEDRAW_ALPHA_NORMAL; BASEDRAW_ALPHA_INVERTED; } }
		}

		SEPARATOR BASEDRAW_DATA_PLANE_SEP { ANIM OFF;}

		GROUP
		{
			BOOL BASEDRAW_DATA_PLANE_LEGACY_MODE { ANIM OFF; } 
			REAL BASEDRAW_DATA_SNAP_PLANE_SPACING { ANIM OFF;UNIT METER; MIN 0.0; }
			LONG BASEDRAW_DATA_SNAP_PLANE_SUB { ANIM OFF;MIN 0; }
			LONG BASEDRAW_DATA_SNAP_PLANE_ROUGHSUB { ANIM OFF;MIN 1; }
			LONG BASEDRAW_DATA_SNAP_PLANE_DYNAMICGRID { ANIM OFF;CYCLE { SNAP_PLANE_DYNAMICGRID_0; SNAP_PLANE_DYNAMICGRID_1; SNAP_PLANE_DYNAMICGRID_2; SNAP_PLANE_DYNAMICGRID_3; SNAP_PLANE_DYNAMICGRID_4; } }
		}

	}

	GROUP BASEDRAW_GROUP_HUD
	{
		GROUP BASEDRAW_GROUP_HUD_INFORMATION
		{
			DEFAULT 1;

			GROUP
			{
				COLUMNS 2;

				BOOL BASEDRAW_HUD_CAMERADISTANCE { ANIM OFF;}
				BOOL BASEDRAW_HUD_FRAME { ANIM OFF;}
				BOOL BASEDRAW_HUD_FRAMETIME { ANIM OFF;}
				BOOL BASEDRAW_HUD_CAMERA_NAME { ANIM OFF;}
				BOOL BASEDRAW_HUD_PROJECTION_NAME { ANIM OFF;}
				BOOL BASEDRAW_HUD_ACTIVE_OBJECT { ANIM OFF;}
				BOOL BASEDRAW_HUD_ROOT_OBJECT { ANIM OFF;}
				BOOL BASEDRAW_HUD_PARENT_OBJECT { ANIM OFF;}

				BOOL BASEDRAW_HUD_TOTAL_OBJECTS { ANIM OFF;}
				BOOL BASEDRAW_HUD_SELECTED_OBJECTS { ANIM OFF;}

				BOOL BASEDRAW_HUD_TOTAL_POINTS { ANIM OFF;}
				BOOL BASEDRAW_HUD_SELECTED_POINTS { ANIM OFF;}

				BOOL BASEDRAW_HUD_TOTAL_EDGES { ANIM OFF;}
				BOOL BASEDRAW_HUD_SELECTED_EDGES { ANIM OFF;}

				BOOL BASEDRAW_HUD_TOTAL_POLYGONS { ANIM OFF;}
				BOOL BASEDRAW_HUD_SELECTED_POLYGONS { ANIM OFF;}

				BOOL BASEDRAW_HUD_TOTAL_NGONS { ANIM OFF;}
				BOOL BASEDRAW_HUD_SELECTED_NGONS { ANIM OFF;}

				BOOL BASEDRAW_HUD_FPS { ANIM OFF;}
				BOOL BASEDRAW_HUD_DRAW_STATISTICS { ANIM OFF; }
				BOOL BASEDRAW_HUD_TOOL { ANIM OFF;}

				BOOL BASEDRAW_HUD_SCULPT_STATISTICS { ANIM OFF; }
				BOOL BASEDRAW_HUD_WORKPLANE_STATISTICS {ANIM OFF;}
				BOOL BASEDRAW_HUD_TAKE { ANIM OFF;}
				BOOL BASEDRAW_HUD_RENDERSETTINGS { ANIM OFF;}
				
				BOOL BASEDRAW_HUD_PREVIEWRENDERER_START { ANIM OFF;}
				BOOL BASEDRAW_HUD_PREVIEWRENDERER_QUALITY { ANIM OFF; } 

				BOOL BASEDRAW_HUD_PREVIEWRENDERER_STATUS { ANIM OFF; } 
				BOOL BASEDRAW_HUD_PREVIEWRENDERER_STATISTICS { ANIM OFF; } 
				
			}
		}

		GROUP BASEDRAW_GROUP_HUD_CONTROLS
		{
			DEFAULT 1;

			COLOR BASEDRAW_HUD_BACKCOLOR { ANIM OFF;}
			REAL BASEDRAW_HUD_BACKOPACITY { UNIT PERCENT; MIN 0.0; MAX 100.0; ANIM OFF;}

			COLOR BASEDRAW_HUD_TEXTCOLOR { ANIM OFF;}
			REAL BASEDRAW_HUD_TEXTOPACITY { UNIT PERCENT; MIN 0.0; MAX 100.0; ANIM OFF;}

			COLOR BASEDRAW_HUD_SELECTCOLOR { ANIM OFF;}

			BOOL BASEDRAW_HUD_ALWAYSACTIVE { ANIM OFF;}
		}
	}
	
	GROUP BASEDRAW_GROUP_STEREO
	{
		GROUP 
		{
			COLUMNS 2;
			BOOL BASEDRAW_STEREO_ENABLE{ ANIM OFF; }
			STATICTEXT {}
			BOOL BASEDRAW_STEREO_USE_RENDERSETTINGS{ ANIM OFF; }
			STATICTEXT {}
			
			LONG BASEDRAW_STEREO_MODE
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_STEREO_MODE_MONO;
					BASEDRAW_STEREO_MODE_ANAGLYPH;
					BASEDRAW_STEREO_MODE_INTERLACED;
					BASEDRAW_STEREO_MODE_SHUTTER;
					BASEDRAW_STEREO_MODE_SIDE_BY_SIDE;
				}
			}
			STATICTEXT {}
				BOOL BASEDRAW_STEREO_MULTI_CHANNEL_SWAP{ ANIM OFF; }
			STATICTEXT BASEDRAW_STEREO_STR1 {}
				LONG BASEDRAW_STEREO_MULTI_CHANNEL_PARALLAX{ MIN 0; ANIM OFF; }
			STATICTEXT BASEDRAW_STEREO_STR2 {}
				
		}
		
// 		GROUP BASEDRAW_STEREO_MODE_MONO_GROUP
// 		{
// 			DEFAULT 1;
// 		}
		
		GROUP BASEDRAW_STEREO_MODE_ANAGLYPH_GROUP
		{
			DEFAULT 1;
			COLUMNS 3;
			GROUP
			{
				LONG BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_FULL
				{
					ANIM OFF;
					CYCLE
					{
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_F_RB;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_F_RG;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_F_RC;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_F_YB;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_F_GM;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_F_C;
					}
				}
				LONG BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_NON_FULL
				{
					ANIM OFF;
					CYCLE
					{
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_NF_R;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_NF_G;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_NF_B;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_NF_Y;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_NF_M;
						BASEDRAW_STEREO_MODE_ANAGLYPH_SYSTEM_NF_C;
					}
				}
			}
			STATICTEXT { JOINEND; }
			COLOR BASEDRAW_STEREO_MODE_ANAGLYPH_CUSTOM_LEFT{ ANIM OFF; }
			COLOR BASEDRAW_STEREO_MODE_ANAGLYPH_CUSTOM_RIGHT{ ANIM OFF; }
			STATICTEXT { }
			
			LONG BASEDRAW_STEREO_MODE_ANAGLYPH_METHOD
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_STEREO_MODE_ANAGLYPH_METHOD_FULL;
					BASEDRAW_STEREO_MODE_ANAGLYPH_METHOD_GRAY;
					BASEDRAW_STEREO_MODE_ANAGLYPH_METHOD_HALF;
					BASEDRAW_STEREO_MODE_ANAGLYPH_METHOD_COLOR;
					BASEDRAW_STEREO_MODE_ANAGLYPH_METHOD_OPTIMIZED;
				}
			}
			STATICTEXT { JOINEND; }
			STATICTEXT { }
		}
		
		GROUP BASEDRAW_STEREO_MODE_SIDEBYSIDE_GROUP
		{
			DEFAULT 1;
			COLUMNS 2;
			LONG BASEDRAW_STEREO_MODE_SIDEBYSIDE_ALIGN
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_STEREO_MODE_SIDEBYSIDE_ALIGN_HORZ;
					BASEDRAW_STEREO_MODE_SIDEBYSIDE_ALIGN_VERT;
				}
			}
			STATICTEXT {}

			BOOL BASEDRAW_STEREO_MODE_SIDEBYSIDE_L_MIRROR_X { ANIM OFF;}
			BOOL BASEDRAW_STEREO_MODE_SIDEBYSIDE_L_MIRROR_Y { ANIM OFF;}

			BOOL BASEDRAW_STEREO_MODE_SIDEBYSIDE_R_MIRROR_X { ANIM OFF;}
			BOOL BASEDRAW_STEREO_MODE_SIDEBYSIDE_R_MIRROR_Y { ANIM OFF;}
		}

		GROUP BASEDRAW_STEREO_MODE_INTERLACED_GROUP
		{
			DEFAULT 1;
			COLUMNS 2;
			LONG BASEDRAW_STEREO_MODE_INTERLACED_TYPE
			{
				ANIM OFF;
				CYCLE
				{
					BASEDRAW_STEREO_MODE_INTERLACED_TYPE_H;
					BASEDRAW_STEREO_MODE_INTERLACED_TYPE_V;
					BASEDRAW_STEREO_MODE_INTERLACED_TYPE_C;
				}
			}
			STATICTEXT {}
		}
		
		GROUP BASEDRAW_STEREO_MONO_CHANNEL_GROUP
		{
			DEFAULT 1;
			COLUMNS 2;
			LONG BASEDRAW_STEREO_MONO_CHANNEL{ ANIM OFF; }
			STATICTEXT {}
		}
		
		//GROUP BASEDRAW_STEREO_MULTI_CHANNEL_GROUP
		//{
			
			//LONG BASEDRAW_STEREO_MULTI_CHANNEL_LEFT { }
			//LONG BASEDRAW_STEREO_MULTI_CHANNEL_RIGHT { }
		//}
	}

	GROUP BASEDRAW_GROUP_EFFECTS
	{
		COLUMNS 1; DEFAULT 1;

		BOOL BASEDRAW_DATA_HQ_OPENGL { ANIM OFF;}
		BOOL BASEDRAW_DATA_HQ_SHADOWS { ANIM OFF;}
		BOOL BASEDRAW_DATA_HQ_POST_EFFECTS { ANIM OFF;}
		BOOL BASEDRAW_DATA_HQ_TRANSPARENCY { ANIM OFF;}
		BOOL BASEDRAW_DATA_HQ_NOISES { ANIM OFF;}

		BOOL BASEDRAW_DATA_HQ_REFLECTIONS { ANIM OFF; PARENTCOLLAPSE; }
		FILENAME BASEDRAW_DATA_REFLECTIONS_ENV_OVERRIDE { ANIM OFF; PARENTCOLLAPSE BASEDRAW_DATA_HQ_REFLECTIONS; }
		VECTOR BASEDRAW_DATA_REFLECTIONS_ENV_ROTATION { ANIM OFF; UNIT DEGREE; PARENTCOLLAPSE BASEDRAW_DATA_HQ_REFLECTIONS; }	
		
		BOOL BASEDRAW_DATA_REFLECTIONS_SSR										{ ANIM OFF; PARENTCOLLAPSE BASEDRAW_DATA_HQ_REFLECTIONS; }
		REAL BASEDRAW_DATA_REFLECTIONS_SSR_RAY_DISTANCE 			{ ANIM OFF; MIN 0; MAX 1000; PARENTCOLLAPSE BASEDRAW_DATA_HQ_REFLECTIONS; }
		REAL BASEDRAW_DATA_REFLECTIONS_SSR_GEOMETRY_THICKNESS	{ ANIM OFF; MIN 0.02; MAX 1; STEP 0.01; PARENTCOLLAPSE BASEDRAW_DATA_HQ_REFLECTIONS; }
	
		BOOL BASEDRAW_DATA_HQ_SSAO { ANIM OFF; PARENTCOLLAPSE; }       
		REAL BASEDRAW_DATA_SSAO_RADIUS { UNIT METER; ANIM OFF; MIN 0.0; PARENTCOLLAPSE BASEDRAW_DATA_HQ_SSAO; }
		REAL BASEDRAW_DATA_SSAO_THRESHOLD { UNIT METER; ANIM OFF; MIN 0.0; PARENTCOLLAPSE BASEDRAW_DATA_HQ_SSAO; }
		REAL BASEDRAW_DATA_SSAO_POWER { ANIM OFF; MIN 1.0; MAX 19.0; PARENTCOLLAPSE BASEDRAW_DATA_HQ_SSAO; }
		LONG BASEDRAW_DATA_SSAO_SAMPLES { ANIM OFF; MIN 1; MAX 64; PARENTCOLLAPSE BASEDRAW_DATA_HQ_SSAO; }
		BOOL BASEDRAW_DATA_SSAO_FINEDETAIL { ANIM OFF; PARENTCOLLAPSE BASEDRAW_DATA_HQ_SSAO; }
		BOOL BASEDRAW_DATA_SSAO_BLUR { ANIM OFF; PARENTCOLLAPSE BASEDRAW_DATA_HQ_SSAO; }
		
		BOOL BASEDRAW_DATA_HQ_TESSELLATION { ANIM OFF;}

		BOOL BASEDRAW_DATA_HQ_DEPTHOFFIELD { ANIM OFF; PARENTCOLLAPSE; }
		REAL BASEDRAW_DATA_DEPTHOFFIELD_MAXRADIUS { ANIM OFF; MIN 1.0; MAX 20.0; PARENTCOLLAPSE BASEDRAW_DATA_HQ_DEPTHOFFIELD; }
	}
	
//	GROUP BASEDRAW_GROUP_INSTANTRENDER
//	{
//		COLUMNS 2;
//
//		BOOL BASEDRAW_INSTANTRENDER_ACTIVE { ANIM OFF;}
//		STATICTEXT { JOINEND; }
//
//		BOOL BASEDRAW_INSTANTRENDER_RELATIVE { ANIM OFF;}
//		STATICTEXT { JOINEND; }
//
//		VECTOR BASEDRAW_INSTANTRENDER_WORLDAXIS { ANIM OFF;}
//		STATICTEXT { JOINEND; }
//
//		LONG BASEDRAW_INSTANTRENDER_X1 { ANIM OFF;}
//		LONG BASEDRAW_INSTANTRENDER_Y1 { ANIM OFF;}
//
//		LONG BASEDRAW_INSTANTRENDER_X2 { ANIM OFF;}
//		LONG BASEDRAW_INSTANTRENDER_Y2 { ANIM OFF;}
//	}
}
