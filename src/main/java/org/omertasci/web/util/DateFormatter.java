package org.omertasci.web.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class  DateFormatter {
    private static final int UNFORMATED_DATE_LENGTH = 19;

    public static String formatDate(SimpleDateFormat sdf, String unformattedDate) {
        String formattedDate = unformattedDate.replace("T"," ").substring(0, UNFORMATED_DATE_LENGTH);
        try {
            formattedDate = sdf.parse(formattedDate).toString();
        } catch (ParseException pe) {
        }
        return formattedDate;
    }
    
    /**
     * 
     * This function formats the unformattedDate value according to the targetFormat format.
     * The formats of unformattedDate and sourceFormat must be the same.
     * 
     * @param sourceFormat : format of unformatted date
     * @param targetFormat : needed format
     * @param unformattedDate : date to be formatted
     * @return String formatted date
     */
	public static String formatDate(String sourceFormat, String targetFormat, String unformattedDate) {
		String formattedDate = "";
		if (unformattedDate != null && !unformattedDate.isEmpty()) {
			if (unformattedDate.contains("T")) {
				unformattedDate = unformattedDate.replace("T", "");
				if (sourceFormat.contains(" ")) {
					sourceFormat = sourceFormat.replace(" ", "");
				}
			}
			if (sourceFormat.contains("T")) {
				sourceFormat = sourceFormat.replace("T", "");
				if (unformattedDate.contains(" ")) {
					unformattedDate = unformattedDate.replace(" ", "");
				}
			}
			if (sourceFormat.length() != unformattedDate.length()) {

				unformattedDate = unformattedDate.substring(0, sourceFormat.length());
			}

			SimpleDateFormat sdfSource = new SimpleDateFormat(sourceFormat);
			SimpleDateFormat sdfTarget = new SimpleDateFormat(targetFormat);

			try {
				Date date = sdfSource.parse(unformattedDate);
				formattedDate = sdfTarget.format(date);
			} catch (ParseException e) {

				e.printStackTrace();
				formattedDate = "";
			}
		}

		return formattedDate;
	}

}
