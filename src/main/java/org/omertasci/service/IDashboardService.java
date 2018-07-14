package org.omertasci.service;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;

import org.omertasci.persistence.model.Dashboard;
import org.omertasci.persistence.model.PasswordResetToken;
import org.omertasci.persistence.model.User;
import org.omertasci.persistence.model.VerificationToken;
import org.omertasci.web.dto.UserDto;
import org.omertasci.web.error.UserAlreadyExistException;
import org.springframework.stereotype.Service;


public interface IDashboardService {

	Dashboard getDashboardByID(long id);
	
	Dashboard getDashboardByUser(User user);
	    
    void saveDashboard(Dashboard dashboard);

    void createDashboard(Dashboard dashboard);
    
    void deleteDashboard(Dashboard dashboard);  

    void updateDashboard(Dashboard dashboard);

}
