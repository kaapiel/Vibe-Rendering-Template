// C4D-DialogResource
DIALOG IDD_SCRIPTLOG_DIALOG
{
  NAME T1; SCALE_H; SCALE_V;

  GROUP IDC_STATIC
  {
    SCALE_V; SCALE_H;
    BORDERSIZE 3, 3, 3, 3;
    ROWS 3;
    COLUMNS 1;
    SPACE 2, 4;

    QUICKTAB IDC_SCRIPTLOG_SCRIPTMODE { SHOWSINGLE; NOLINEBREAK; NOMULTISELECT; }
    
    SEPARATOR { SCALE_H; }
    
    GROUP IDC_SCRIPTLOG_MODE_GROUP
    {
      SCALE_V; SCALE_H;
      MULTILINEEDIT IDC_SCRIPTLOG_PY_EDIT { MONOSPACED; READONLY; HIGHLIGHTLINE; SYNTAXCOLOR; STATUSBAR; PYTHON; SCALE_H; SCALE_V; SIZE 50, 50; }
      MULTILINEEDIT IDC_SCRIPTLOG_COF_EDIT { MONOSPACED; READONLY; HIGHLIGHTLINE; SYNTAXCOLOR; STATUSBAR; SCALE_H; SCALE_V; SIZE 50, 50; }
    }
  }
}