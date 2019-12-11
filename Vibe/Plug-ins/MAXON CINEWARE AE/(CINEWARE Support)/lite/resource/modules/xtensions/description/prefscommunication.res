CONTAINER Prefscommunication
{
	NAME Prefscommunication;

	GROUP PREF_COMMUNICATION_MAINGROUP
	{
		DEFAULT 1;
		COLUMNS 1;
		
		BOOL PREF_COMMUNICATION_BUGREPORTS { ANIM OFF; }
		GROUP PREF_COMMUNICATION_UPDATEGROUP { }
		
		BOOL PREF_COMMUNICATION_UPDATE_AUTO { ANIM OFF; }
		BOOL PREF_COMMUNICATION_UPDATE_AUTO_DEVELOPER { ANIM OFF; }
		
		SEPARATOR {LINE;}	
	}
	GROUP
	{
		GROUP PREF_COMMUNICATION_METRICSGROUP
		{
			DEFAULT 0;
			NAME METRICS_HEADLINE;
			
			COLUMNS 1;
			GROUP
			{
				COLUMNS 1;
				BOOL PREF_COMMUNICATION_METRICS_ENABLE_CHECKBOX { NAME PREF_COMMUNICATION_METRICS_ENABLE_CHECKBOX_NAME;	}
				BOOL PREF_COMMUNICATION_METRICS_ENABLE_COMMANDS_CHECKBOX { NAME PREF_COMMUNICATION_METRICS_ENABLE_COMMANDS_CHECKBOX_NAME; }
				BOOL PREF_COMMUNICATION_METRICS_ENABLE_PREFERENCES_CHECKBOX { NAME PREF_COMMUNICATION_METRICS_ENABLE_PREFERENCES_CHECKBOX_NAME; }
				BOOL PREF_COMMUNICATION_METRICS_ENABLE_SYSTEM_INFO_CHECKBOX { NAME PREF_COMMUNICATION_METRICS_ENABLE_SYSTEM_INFO_CHECKBOX_NAME; }
			}
			GROUP
			{
				COLUMNS 3;
				BUTTON PREF_COMMUNICATION_METRICS_GOTO_PREFERENCE_DIRECTORY { NAME PREF_COMMUNICATION_METRICS_GOTO_PREFERENCE_DIRECTORY_NAME; }
				BUTTON PREF_COMMUNICATION_METRICS_GOTO_SERVER_LOCATION { NAME PREF_COMMUNICATION_METRICS_GOTO_SERVER_LOCATION_NAME; }
			}
		}
	}
	GROUP 
	{
		GROUP PREF_COMMUNICATION_LIVELINKGROUP
		{
			DEFAULT 0;
			NAME PREF_COMMUNICATION_LIVELINK;

			COLUMNS 1;
			GROUP
			{

				BOOL PREF_COMMUNICATION_LIVELINK_ENABLED{ ANIM OFF; }
				LONG PREF_COMMUNICATION_LIVELINK_PORT{ ANIM OFF; MIN  0; MAX 65536; }
			}
		}
	}
}
