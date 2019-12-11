#ifndef C4D_SYMBOLS_H__
#define C4D_SYMBOLS_H__

enum
{
	// string table definitions
	IDS_START = 10000,

	IDS_Odisc,
	IDS_Osinglepoly,
	IDS_Otorus,
	IDS_Ocube,
	IDS_Osphere,
	IDS_Oplatonic,
	IDS_Ofigure,
	IDS_Opyramid,
	IDS_Oplane,
	IDS_Otube,
	IDS_Ofractal,
	IDS_Ocone,
	IDS_Ocylinder,
	IDS_Ocapsule,
	IDS_Ooiltank,
	IDS_Orelief,

	IDS_Osplinecircle,
	IDS_Osplinearc,
	IDS_Osplinecissoid,
	IDS_Osplinecycloid,
	IDS_Osplineprofile,
	IDS_Osplinecontour,
	IDS_Osplinehelix,
	IDS_Osplinerectangle,
	IDS_Osplinestar,
	IDS_Osplinecogwheel,
	IDS_Osplineflower,
	IDS_Osplineformula,
	IDS_Osplinetext,
	IDS_Ospline4side,
	IDS_Osplinenside,

	IDS_Oparticlebase,
	IDS_Ogravitation,
	IDS_Oattractor,
	IDS_Odestructor,
	IDS_Odeflector,
	IDS_Ofriction,
	IDS_Orotation,
	IDS_Oturbulence,
	IDS_Owind,

	IDS_Oheadphone,
	IDS_Obackground,
	IDS_Oforeground,
	IDS_Oconplane,
	IDS_Oenvironment,
	IDS_Ofloor,
	IDS_Ostage,
	IDS_Oloudspeaker,
	IDS_Omicrophone,

	IDS_Obend,
	IDS_Obulge,
	IDS_Otwist,
	IDS_Otaper,
	IDS_Oshear,

	IDS_Oexplosion,
	IDS_Oformula,
	IDS_Omelt,
	IDS_Oshatter,
	IDS_Owinddeform,
	IDS_Owrap,

	IDS_Opolyreduction,
	IDS_POLYREDUCTION,
	IDS_BOOLEOBJECT,

	IDS_VERTEX,
	IDS_HANDEFFECTOR,
	IDS_FOOTEFFECTOR,
	IDS_FIGURELEFT,
	IDS_FIGURERIGHT,
	IDS_HEADEFFECTOR,
	IDS_UPPERBODY,
	IDS_NECK,
	IDS_UPPERARM,
	IDS_LOWERARM,
	IDS_UPPERKNEE,
	IDS_LOWERKNEE,
	IDS_HAND,
	IDS_FOOT,
	IDS_HEAD,
	IDS_JOINT,
	IDS_TEXTCONTENT,

	IDS_PELVIS = 10256,

	// Operators
	// TODO: (Marc): figure out proper start index as compared to corresponding file in the 'object' module
	IDS_OPOLYREDUX_DEPRECATED,
	IDS_POLYREDUX_PREPROCESSING_REDUCTION,
	IDS_POLYREDUX_PREPROCESSING_TRIANGULATING,
	IDS_POLYREDUX_PREPROCESSING_OPTIMIZING,
	IDS_POLYREDUX_PREPROCESSING_INIT_COSTS,
	IDS_POLYREDUX_PREPROCESSING_INIT_STACK,
	IDS_POLYREDUX_PREPROCESSING_FINALIZE_STACK,
	IDS_OPOLYREDUX_GENERATOR,

	// End of symbol definition
	_DUMMY_ELEMENT_
};

#endif // C4D_SYMBOLS_H__
