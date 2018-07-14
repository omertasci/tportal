SET workingDir=%~dp0
echo Hello, ELK Stack is starting right now...
echo This file should be located under ELK-Stack directory!
start cmd /k  "cd %workingDir%\elasticsearch\bin & elasticsearch.bat"
start cmd /k "cd %workingDir%\logstash\bin & logstash -f %workingDir%\logstash\config\joined_monitor_data_21052018.conf"
start cmd /k "cd %workingDir%\kibana\bin & kibana.bat"
