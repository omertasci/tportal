package org.omertasci.service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
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
public class WidgetService implements IWidgetService {
    private final Logger logger = LoggerFactory.getLogger( getClass() );

    
    private WidgetRepository repository;
    
    
    private DashboardRepository dashboardRepository;

    @Autowired
	public void setRepository(WidgetRepository repository) {
		this.repository = repository;
	}
    @Autowired
	public void setDashboardRepository(DashboardRepository dashboardRepository) {
		this.dashboardRepository = dashboardRepository;
	}

	@Override
	public Widget getWidgetdByID(long id) {
		final Widget widget= repository.getOne( id );
		return widget;
	}	
	
	@Override
	public Widget findByWidgetCounterId(int counterId) {		
		return  repository.findByWidgetCounterId(counterId);		
	}
	
	@Override
	public void saveWidget(Widget widget) {
		repository.save( widget );		
	}
	
	@Override
	public void createWidget(Widget widget) {
		repository.save( widget );	
		
	}
	
	@Override
	public void deleteWidget(Widget widget) {
		 repository.delete( widget );		
	}
	
	@Override
	public void updateWidget(Widget widget) {
		
		Widget widgetOriginal = getWidgetdByID(widget.getId()) ;
		
		widgetOriginal.setWidgetName(widget.getWidgetName());
		widgetOriginal.setAggregationType(widget.getAggregationType());
		widgetOriginal.setValueType(widget.getValueType());
		widgetOriginal.setCategoryType(widget.getCategoryType());
		widgetOriginal.setChartType(widget.getChartType());
		widgetOriginal.setCol(widget.getCol());		
		widgetOriginal.setLiHtml(widget.getLiHtml());
		widgetOriginal.setRow(widget.getRow());
		widgetOriginal.setSizex(widget.getSizex());
		widgetOriginal.setSizey(widget.getSizey());
		widgetOriginal.setExpiryDate(widget.getExpiryDate());
		widgetOriginal.setUpdateDate(new Date());
		
		repository.save( widgetOriginal );
	}	

}