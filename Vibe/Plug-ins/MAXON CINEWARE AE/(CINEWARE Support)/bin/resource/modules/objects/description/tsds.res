CONTAINER Tsds
{
  NAME Tsds;
  INCLUDE Tbase;

  GROUP ID_TAGPROPERTIES
  {
    BOOL SDSTAG_USE_SDS_STEPS             { }
    LONG SDSTAG_SUBEDITOR                 { PARENTID SDSTAG_USE_SDS_STEPS; MIN 0; MAX 6; }
    LONG SDSTAG_SUBRAY                    { PARENTID SDSTAG_USE_SDS_STEPS; MIN 0; MAX 6; }
  }
}
