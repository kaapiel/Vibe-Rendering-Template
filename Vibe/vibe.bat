set "nome_video="
set aep_path=".\projetos\SKY_VINHETA_V3 folder\SKY_VINHETA_V3.aep"
set aerender_bin=".\aerender.exe"
set "comp_model='.\model.js'"
set "names_base='.\database.txt'"
set ffmepg_bin=".\ffmpeg\bin\ffmpeg.exe"
set output_filepath=.\Campaign\SKY_

for /f "tokens=* delims=" %%a in ('type .\database-editted.txt') do (
	powershell -command "(get-content .\model.js) -replace ('XXXX','%%a') | out-file .\model.js"
	%aerender_bin% -project %aep_path% -comp "SKY" -sound ON -output "%output_filepath%%%a" -RStemplate "Melhores configs" -OMtemplate "Sem perdas"
	%ffmepg_bin% -i "%output_filepath%%%a.avi" -async 1 "%output_filepath%%%a.mp4"
	del "%output_filepath%%%a.avi"
	powershell -command "(get-content .\model.js) -replace ('%%a','XXXX') | out-file .\model.js"
)