CONTAINER Tvertexcolor
{
	NAME Tvertexcolor;
	INCLUDE Tbase;

	GROUP ID_TAGPROPERTIES
	{
		LONG ID_VERTEXCOLOR_VERTEXCOLORMODE
		{
			CYCLE
			{
				ID_VERTEXCOLOR_VERTEXCOLORMODE_VERTEX;
				ID_VERTEXCOLOR_VERTEXCOLORMODE_POLYGON;
			}
		}
		BOOL ID_VERTEXCOLOR_ALPHAMODE { }
		BOOL ID_VERTEXCOLOR_DRAWPOINTS { }
	}
}
