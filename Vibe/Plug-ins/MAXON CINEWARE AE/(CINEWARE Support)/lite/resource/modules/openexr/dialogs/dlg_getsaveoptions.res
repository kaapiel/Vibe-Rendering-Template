// C4D-DialogResource
DIALOG DLG_GETSAVEOPTIONS
{
  NAME STR_OPENEXRSAVEOPTIONS; CENTER_V; CENTER_H;
  SCALE_H; 
	GROUP
	{
		COLUMNS 2;

		STATICTEXT { NAME COMPRESSION_TYPE_TEXT; }

		COMBOBOX	COMPRESSION_TYPE
		{
	    SCALE_H;

			CHILDS
			{
				NO_COMPRESSION_ID, NO_COMPRESSION_TEXT;
				RLE_COMPRESSION_ID, RLE_COMPRESSION_TEXT;
				ZIPS_COMPRESSION_ID, ZIPS_COMPRESSION_TEXT;
				ZIP_COMPRESSION_ID, ZIP_COMPRESSION_TEXT;
				PIZ_COMPRESSION_ID, PIZ_COMPRESSION_TEXT;
				PXR24_COMPRESSION_ID, PXR24_COMPRESSION_TEXT;
				B44_COMPRESSION_ID, B44_COMPRESSION_TEXT;
				B44A_COMPRESSION_ID, B44A_COMPRESSION_TEXT;
				RLE_HF_COMPRESSION_ID, RLE_HF_COMPRESSION_TEXT;
				ZIPS_HF_COMPRESSION_ID, ZIPS_HF_COMPRESSION_TEXT;
				ZIP_HF_COMPRESSION_ID, ZIP_HF_COMPRESSION_TEXT;
				PIZ_HF_COMPRESSION_ID, PIZ_HF_COMPRESSION_TEXT; 
			}
		}	
	}
 	
	DLGGROUP { OK; CANCEL; }
}  
 
