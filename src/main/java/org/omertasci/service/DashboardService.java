package org.omertasci.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.omertasci.persistence.dao.DashboardRepository;
import org.omertasci.persistence.dao.PasswordResetTokenRepository;
import org.omertasci.persistence.dao.RoleRepository;
import org.omertasci.persistence.dao.UserRepository;
import org.omertasci.persistence.dao.VerificationTokenRepository;
import org.omertasci.persistence.dao.WidgetRepository;
import org.omertasci.persistence.model.Dashboard;
import org.omertasci.persistence.model.PasswordResetToken;
import org.omertasci.persistence.model.Privilege;
import org.omertasci.persistence.model.Role;
import org.omertasci.persistence.model.User;
import org.omertasci.persistence.model.VerificationToken;
import org.omertasci.persistence.model.Widget;
import org.omertasci.web.dom.Referer;
import org.omertasci.web.dto.DashboardDto;
import org.omertasci.web.dto.UserDto;
import org.omertasci.web.error.UserAlreadyExistException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

@Service
@Transactional
public class DashboardService implements IDashboardService {
    private final Logger logger = LoggerFactory.getLogger( getClass() );

    
    private DashboardRepository repository;
    
    
    private WidgetRepository widgetRepository;
    
    
    private UserRepository userRepository;

    @Autowired
	public void setRepository(DashboardRepository repository) {
		this.repository = repository;
	}

	
	@Autowired
	public void setWidgetRepository(WidgetRepository widgetRepository) {
		this.widgetRepository = widgetRepository;
	}

	@Autowired
	public void setUserRepository(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public Dashboard getDashboardByID(long id) {
		final Dashboard dashboard= repository.getOne( id );
		return dashboard;
	}

	@Override
	public Dashboard getDashboardByUser(User user) {
		Dashboard dashboard = userRepository.getOne(user.getId()).getDashboard();
		return dashboard;
	}
	
	@Override
	public void createDashboard(Dashboard dashboard) {
        repository.save( dashboard );		
	}
	
	@Override
	public void saveDashboard(Dashboard dashboard) {
		 repository.save( dashboard );		
	}

	@Override
	public void deleteDashboard(Dashboard dashboard) {
		
		final List<Widget> widgets = widgetRepository.findByDashboards( dashboard );

        if (widgets != null) {
        	widgetRepository.delete( widgets );
        }

        repository.delete( dashboard );		
	}

	@Override
	public void updateDashboard(Dashboard dashboard) {
		
		Dashboard dashboardOriginal = getDashboardByID(dashboard.getId()) ;
		dashboardOriginal.setDashboardName(dashboard.getDashboardName());
		dashboardOriginal.setCreateDate(dashboard.getCreateDate());
		dashboardOriginal.setEndDate(dashboard.getEndDate());
		dashboardOriginal.setExpiryDate(dashboard.getExpiryDate());
		dashboardOriginal.setUpdateDate(dashboard.getUpdateDate());
		dashboardOriginal.setUser(dashboard.getUser());
		dashboardOriginal.setWidgets(dashboard.getWidgets());
		
		repository.save( dashboard );	
		
	}

}