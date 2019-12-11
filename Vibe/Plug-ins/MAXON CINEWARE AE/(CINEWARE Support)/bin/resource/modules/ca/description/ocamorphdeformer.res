CONTAINER Ocamorphdeformer
{
	NAME Ocamorphdeformer;
	INCLUDE Obase;
	
	GROUP ID_OBJECTPROPERTIES
	{
		REAL ID_CA_MORPH_DEFORMER_OBJECT_STRENGTH { UNIT PERCENT; MINSLIDER 0.0; MAXSLIDER 100.0; CUSTOMGUI REALSLIDER; }
		LINK ID_CA_MORPH_DEFORMER_OBJECT_TAG { ACCEPT { Tbase; } }
		BOOL ID_CA_MORPH_DEFORMER_OBJECT_APPLY_BASEPOSE { }
		
		GROUP ID_CA_MORPH_DEFORMER_OBJECT_TARGETS_GROUP
		{
			COLUMNS 2; DEFAULT 1;
		}
	}
}
