CONTAINER Osds
{
	NAME Osds;
	INCLUDE Obase;

	GROUP ID_OBJECTPROPERTIES
	{
		LONG SDSOBJECT_TYPE
		{
			CYCLE
			{
				SDSOBJECT_TYPE_CM;
				SDSOBJECT_TYPE_CM_N;
				SDSOBJECT_TYPE_OSD_CATMARK;
				SDSOBJECT_TYPE_OSD_CATMARK_ADAPTIVE;
				SDSOBJECT_TYPE_OSD_LOOP;
				SDSOBJECT_TYPE_OSD_BILINEAR;
			}
		}
		BOOL SDSOBJECT_R12_COMPATIBILITY {ANIM OFF;}

		LONG SDSOBJECT_SUBEDITOR_CM           { MIN 0; MAX 6; }
		LONG SDSOBJECT_SUBRAY_CM              { MIN 0; MAX 6; }
	 
		LONG SDSOBJECT_SUBDIVIDE_UV 
		{
			CYCLE
			{
				SDSOBJECT_SUBDIVIDE_UV_STANDARD;
				SDSOBJECT_SUBDIVIDE_UV_BOUNDARY;
				SDSOBJECT_SUBDIVIDE_UV_EDGE;
			} 
		}

		LONG SDSOBJECT_OSD_FVAR_BOUNDARY_METHOD 
		{
			CYCLE
			{
				SDSOBJECT_OSD_FVAR_BOUNDARY_METHOD_NONE;
				SDSOBJECT_OSD_FVAR_BOUNDARY_METHOD_CORNERSONLY;
				SDSOBJECT_OSD_FVAR_BOUNDARY_METHOD_BOUNDARIES;
				SDSOBJECT_OSD_FVAR_BOUNDARY_METHOD_ALL;
			} 
		}

		LONG SDSOBJECT_OSD_BOUNDARY_METHOD 
		{
			CYCLE
			{
				SDSOBJECT_OSD_BOUNDARY_METHOD_EDGEONLY;
				SDSOBJECT_OSD_BOUNDARY_METHOD_EDGEANDCORNER;
			} 
		}

		LONG SDSOBJECT_OSD_CATMARK_TRI_SUBD 
		{
			CYCLE
			{
				SDSOBJECT_OSD_CATMARK_TRI_SUBD_CATMARK;
				SDSOBJECT_OSD_CATMARK_TRI_SUBD_SMOOTH;
			} 
		}

		LONG SDSOBJECT_OSD_EDGE_CREASE 
		{
			CYCLE
			{
				SDSOBJECT_OSD_EDGE_CREASE_UNIFORM;
				SDSOBJECT_OSD_EDGE_CREASE_CHAIKIN;
			} 
		}

		LONG SDSOBJECT_OSD_ADAPTIVE_TESSELLATION_LEVEL { MIN 1; MAX 10; }
	}
}
