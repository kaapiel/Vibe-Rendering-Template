CONTAINER Toolcapaint
{
	NAME Toolcapaint;

	INCLUDE ToolBrushBase;
	
	GROUP MDATA_MAINGROUP
	{
		DEFAULT 1;

		LONG ID_CA_PAINT_TOOL_MAINMODE
		{
			CYCLE
			{
				ID_CA_PAINT_TOOL_MAINMODE_VERTEXMAP;
				ID_CA_PAINT_TOOL_MAINMODE_VERTEXCOLOR;
				ID_CA_PAINT_TOOL_MAINMODE_VERTEXCOLOR_ALPHA;
				ID_CA_PAINT_TOOL_MAINMODE_VERTEXALPHA;
			}
		}

		REAL ID_CA_PAINT_TOOL_OPACITY { UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER; }

		GROUP
		{
			COLUMNS 2;
			
			LONG ID_CA_PAINT_TOOL_MODE
			{
				SCALE_H;
				
				CYCLE
				{
					ID_CA_PAINT_TOOL_MODE_ADD;
					ID_CA_PAINT_TOOL_MODE_SUBTRACT;
					ID_CA_PAINT_TOOL_MODE_ABS;
					ID_CA_PAINT_TOOL_MODE_SMOOTH;
					ID_CA_PAINT_TOOL_MODE_BLEED;
					ID_CA_PAINT_TOOL_MODE_INTENSITY;
					ID_CA_PAINT_TOOL_MODE_REMAP;
				}
			}

			LONG ID_CA_PAINT_TOOL_COLORMODE
			{
				SCALE_H;

				CYCLE
				{
					ID_CA_PAINT_TOOL_COLORMODE_NORMAL;
					ID_CA_PAINT_TOOL_COLORMODE_ADD;
					ID_CA_PAINT_TOOL_COLORMODE_SUB;
					ID_CA_PAINT_TOOL_COLORMODE_MUL;
					ID_CA_PAINT_TOOL_COLORMODE_LIG;
					ID_CA_PAINT_TOOL_COLORMODE_DARK;
					ID_CA_PAINT_TOOL_COLORMODE_SMOOTH;
					ID_CA_PAINT_TOOL_COLORMODE_BLEED;
					ID_CA_PAINT_TOOL_COLORMODE_INTENSITY;
					ID_CA_PAINT_TOOL_COLORMODE_REMAP;
				}
			}

			LONG ID_CA_PAINT_TOOL_SMOOTH { SCALE_H; MIN 1; MAX 1000; }
		
			SPLINE ID_CA_PAINT_TOOL_SPLINE {  }
			STATICTEXT { JOINEND; }

			BUTTON ID_CA_PAINT_TOOL_APPLY_ALL { SCALE_H; }
			BUTTON ID_CA_PAINT_TOOL_APPLY_SELECTED { SCALE_H; }

		}
		
		GROUP	ID_CA_PAINT_TOOL_VERTEXCOLOR_GROUP
		{
			SEPARATOR{ LINE; }
			COLOR ID_CA_PAINT_TOOL_VERTEXCOLOR { OPEN; }
			REAL ID_CA_PAINT_TOOL_VERTEXCOLOR_APLHAVALUE { UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER; }
		}
	}
	
	GROUP ID_CA_PAINT_TOOL_SYMMETRY_GROUP
	{
		COLUMNS 2;
		
		BOOL ID_CA_PAINT_TOOL_SYMMETRY { }
		STATICTEXT { NEWLINE; }
		
		REAL ID_CA_PAINT_TOOL_SYMMETRY_RAD { SCALE_H; UNIT METER; MIN 0.0; MAXSLIDER 10.0; STEP 0.1; CUSTOMGUI REALSLIDER; }
		STATICTEXT { JOINEND; }
		
		LONG ID_CA_PAINT_TOOL_SYMMETRY_COORD
		{
			SCALE_H;
		
			CYCLE
			{
				ID_CA_PAINT_TOOL_SYMMETRY_COORD_LOCAL;
				ID_CA_PAINT_TOOL_SYMMETRY_COORD_WORLD;
				ID_CA_PAINT_TOOL_SYMMETRY_COORD_CUSTOM;
			}
		}
		
		LONG ID_CA_PAINT_TOOL_SYMMETRY_MIRROR
		{
			SCALE_H;
		
			CYCLE
			{
				ID_CA_PAINT_TOOL_SYMMETRY_MIRROR_XY;
				ID_CA_PAINT_TOOL_SYMMETRY_MIRROR_YZ;
				ID_CA_PAINT_TOOL_SYMMETRY_MIRROR_XZ;
			}
		}
		
		LINK ID_CA_PAINT_TOOL_SYMMETRY_COORD_CUSTOM_OBJECT { ACCEPT { Obase; } }
		STATICTEXT { JOINEND; }
	}
	
	GROUP ID_CA_PAINT_TOOL_DISPLAY_GROUP
	{		
		REAL ID_CA_PAINT_TOOL_DISPLAY_LOWER { SCALE_H; UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER; }
		REAL ID_CA_PAINT_TOOL_DISPLAY_UPPER { SCALE_H; UNIT PERCENT; MIN 0.0; MAX 100.0; CUSTOMGUI REALSLIDER; }

		SEPARATOR { LINE; }

		BOOL ID_CA_PAINT_TOOL_DISPLAY_COLOR_CUSTOM { }
		GRADIENT  ID_CA_PAINT_TOOL_DISPLAY_COLOR { COLOR;	}
		COLOR ID_CA_PAINT_TOOL_DISPLAY_CURSOR_COLOR { OPEN; }
	}
}
