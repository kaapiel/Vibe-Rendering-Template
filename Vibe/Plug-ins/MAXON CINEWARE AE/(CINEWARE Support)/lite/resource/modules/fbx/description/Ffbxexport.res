CONTAINER	Ffbxexport
{
	NAME Ffbxexport;
	INCLUDE	Fbase;

	GROUP FBXEXPORT_GROUP
	{
		COLUMNS 2;

		LONG FBXEXPORT_FBX_VERSION { CYCLE { FBX_EXPORTVERSION_NATIVE; FBX_EXPORTVERSION_7_4_0; FBX_EXPORTVERSION_7_3_0; FBX_EXPORTVERSION_7_2_0; FBX_EXPORTVERSION_7_1_0; FBX_EXPORTVERSION_6_1_0; } DEFAULT FBX_EXPORTVERSION_NATIVE; }
		STATICTEXT{ JOINENDSCALE; }

		BOOL FBXEXPORT_ASCII { DEFAULT 0; }
		STATICTEXT{ JOINENDSCALE; }

		SEPARATOR FBXEXPORT_GRP_GENERAL {}
		STATICTEXT { JOINEND; }

		BOOL FBXEXPORT_SELECTION_ONLY { DEFAULT 0; }
		BOOL FBXEXPORT_GLOBAL_MATRIX { DEFAULT 0; }

		BOOL FBXEXPORT_CAMERAS { DEFAULT 1; }
		BOOL FBXEXPORT_SDS { DEFAULT 1; }

		BOOL FBXEXPORT_SPLINES { DEFAULT 1; }
		BOOL FBXEXPORT_LIGHTS { DEFAULT 1; }

		SEPARATOR FBXEXPORT_GRP_ANIMATION {}
		STATICTEXT { JOINEND; }

		BOOL FBXEXPORT_TRACKS { DEFAULT 1; }
		BOOL FBXEXPORT_PLA_TO_VERTEXCACHE { DEFAULT 0; }

		BOOL FBXEXPORT_BAKE_ALL_FRAMES { DEFAULT 0; }
		STATICTEXT {}

		SEPARATOR  FBXEXPORT_GRP_GEOMETRY {}
		STATICTEXT { JOINEND; }

		BOOL FBXEXPORT_SAVE_NORMALS { DEFAULT 1; }
		BOOL FBXEXPORT_TRIANGULATE { DEFAULT 0; }

		BOOL FBXEXPORT_SAVE_VERTEX_MAPS_AS_COLORS { DEFAULT 0; }
		BOOL FBXEXPORT_SDS_SUBDIVISION { DEFAULT 0; }

		BOOL FBXEXPORT_SAVE_VERTEX_COLORS { DEFAULT 0; }
		BOOL FBXEXPORT_LOD_SUFFIX { DEFAULT 0; }

		SEPARATOR FBXEXPORT_GRP_ADDITIONAL { }
		STATICTEXT { JOINEND; }

		BOOL FBXEXPORT_TEXTURES { DEFAULT 1; }
		BOOL FBXEXPORT_SUBSTANCES { DEFAULT 1; }
		BOOL FBXEXPORT_EMBED_TEXTURES { DEFAULT 1; }
		STATICTEXT {}
	}
}
