CONTAINER BMsmooth
{
  NAME BMsmooth;
  INCLUDE BMbase;

    GROUP
	{
		COLUMNS 2;
		BOOL MDATA_BRUSHMODIFIERBASE_ENABLED { }
		REAL MDATA_BRUSHMODIFIERBASE_STRENGTH { MIN 0; MINSLIDER 1; MAXSLIDER 100; CUSTOMGUI REALSLIDER; UNIT PERCENT; SCALE_H;  }	
	}
}
