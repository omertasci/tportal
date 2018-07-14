package org.omertasci.service;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;

import org.omertasci.persistence.model.Dashboard;
import org.omertasci.persistence.model.PasswordResetToken;
import org.omertasci.persistence.model.User;
import org.omertasci.persistence.model.VerificationToken;
import org.omertasci.persistence.model.Widget;
import org.omertasci.web.dto.UserDto;
import org.omertasci.web.error.UserAlreadyExistException;

public interface IWidgetService {
	
	Widget getWidgetdByID(long id);
	
//	List<Widget> findByDashboard(Dashboard dashboard);
	
    void saveWidget(Widget widget);

    void createWidget(Widget widget);
    
    void deleteWidget(Widget widget);  

    void updateWidget(Widget widget);

	Widget findByWidgetCounterId(int counterId);

}
