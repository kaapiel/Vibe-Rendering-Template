#ifndef TFBXEXPORTREFERENCE_H__
#define TFBXEXPORTREFERENCE_H__

enum
{
	FBX_EXPORT_TAG_REFERENCE = 1000,				// void *
	FBX_EXPORT_TAG_SUBSTITUTION_REFERENCE,			// void *
	FBX_EXPORT_TAG_EXPORTNODE_REFERENCE,			// void *
	FBX_EXPORT_TAG_REST2CURRENT_MATRIX,				// Matrix
	FBX_EXPORT_TAG_LOCAL_CURRENT_MATRIX,			// Matrix
	FBX_EXPORT_TAG_LOCAL_RESTPOSE_MATRIX,			// Matrix
	FBX_EXPORT_TAG_POSE_FLAG,						// Bool
	FBX_EXPORT_TAG_POSEMORPH,						// void *
	FBX_EXPORT_TAG_POSEMORPH_FLAG,					// Bool
	FBX_EXPORT_TAG_POSE_VCNT,						// LONG
	FBX_EXPORT_TAG_POSE_PCNT,						// LONG
	FBX_EXPORT_TAG_GLOBAL_RESTPOSE_MATRIX,			// Matrix
	FBX_EXPORT_TAG_REFERENCE_IS_UNLINKED,			// BOOL
	FBX_EXPORT_TAG_DEFORM_MODE,						// BOOL
	FBX_EXPORT_TAG_SPLINE_INTERPOLATION,	// LONG
	FBX_EXPORT_TAG_RENDERINSTANCE,				// BOOL
	FBX_EXPORT_TAG_HAIR_DYNAMICS,					// BOOL
	FBX_EXPORT_TAG_CLOTH_TAG_ENABLED,			// BOOL
	FBX_EXPORT_TAG_SDS_SUBEDITOR_CM,			// LONG
	FBX_EXPORT_TAG_SDS_SUBRENDER_CM,			// LONG
	FBX_EXPORT_TAG_SELECTED								// BOOL
};

#endif // TFBXEXPORTREFERENCE_H__



