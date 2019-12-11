CONTAINER Zmultipass
{
	NAME Zmultipass;

	GROUP 
	{
		LONG MULTIPASSOBJECT_OBJECTBUFFER { ANIM OFF; MIN 1; }
	}

	GROUP MULTIPASSOBJECT_BLENDDATA
	{
		BOOL MULTIPASSOBJECT_AMBIENT { ANIM OFF; }
		BOOL MULTIPASSOBJECT_DIFFUSE { ANIM OFF; }
		BOOL MULTIPASSOBJECT_SPECULAR { ANIM OFF; }
		BOOL MULTIPASSOBJECT_SHADOW	{ ANIM OFF; }
		BOOL MULTIPASSOBJECT_REFLECTION { ANIM OFF; }
		BOOL MULTIPASSOBJECT_TRANSPARENCY { ANIM OFF; }
		BOOL MULTIPASSOBJECT_RADIOSITY { ANIM OFF; }
		BOOL MULTIPASSOBJECT_CAUSTICS	{ ANIM OFF; }
		BOOL MULTIPASSOBJECT_ATMOSPHERE { ANIM OFF; }
		BOOL MULTIPASSOBJECT_ATMOSPHERE_MUL	{ ANIM OFF; }
		BOOL MULTIPASSOBJECT_ALLPOSTEFFECTS	{ ANIM OFF; }
	}

	GROUP MULTIPASSOBJECT_REFLECTIONDATA
	{
		LONG MULTIPASSOBJECT_REFLECTION_MATERIALS
		{ 
			ANIM OFF;
			CYCLE 
			{ 
				MULTIPASSOBJECT_REFLECTION_SEPARATE_NONE;
				MULTIPASSOBJECT_REFLECTION_SEPARATE_ALL;
				MULTIPASSOBJECT_REFLECTION_SEPARATE_SELECTED;
			}
		}

		LONG MULTIPASSOBJECT_REFLECTION_LAYERS
		{ 
			ANIM OFF;
			CYCLE 
			{ 
				MULTIPASSOBJECT_REFLECTION_LAYERS_NONE;
				MULTIPASSOBJECT_REFLECTION_LAYERS_ALL;
				MULTIPASSOBJECT_REFLECTION_LAYERS_SELECTED;
			} 
		}

		LONG MULTIPASSOBJECT_REFLECTION_MODE
		{ 
			ANIM OFF;
			CYCLE 
			{ 
				MULTIPASSOBJECT_REFLECTION_MODE_NORMAL;
				MULTIPASSOBJECT_REFLECTION_MODE_RAW;
				MULTIPASSOBJECT_REFLECTION_MODE_COMBINED;
			} 
		}
	}

	GROUP MULTIPASSOBJECT_SPECULARDATA
	{
		LONG MULTIPASSOBJECT_SPECULAR_MATERIALS
		{ 
			ANIM OFF;
			CYCLE 
			{ 
				MULTIPASSOBJECT_SPECULAR_SEPARATE_NONE;
				MULTIPASSOBJECT_SPECULAR_SEPARATE_ALL;
				MULTIPASSOBJECT_SPECULAR_SEPARATE_SELECTED;
			}
		}

		LONG MULTIPASSOBJECT_SPECULAR_LAYERS
		{ 
			ANIM OFF;
			CYCLE 
			{ 
				MULTIPASSOBJECT_SPECULAR_LAYERS_NONE;
				MULTIPASSOBJECT_SPECULAR_LAYERS_ALL;
				MULTIPASSOBJECT_SPECULAR_LAYERS_SELECTED;
			} 
		}

		LONG MULTIPASSOBJECT_SPECULAR_MODE
		{ 
			ANIM OFF;
			CYCLE 
			{ 
				MULTIPASSOBJECT_SPECULAR_MODE_NORMAL;
				MULTIPASSOBJECT_SPECULAR_MODE_RAW;
				MULTIPASSOBJECT_SPECULAR_MODE_COMBINED;
			} 
		}
	}
}
