package org.omertasci.web.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.servlet.http.HttpServletRequest;



import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.omertasci.constant.*;
import org.omertasci.persistence.model.User;
import org.omertasci.registration.OnRegistrationCompleteEvent;
import org.omertasci.service.AppInCseService;
import org.omertasci.service.IAppInCseService;
import org.omertasci.service.IRefererService;
import org.omertasci.service.ISessionKeyService;
import org.omertasci.service.IUserService;
import org.omertasci.web.dom.Referer;
import org.omertasci.web.util.GenericResponse;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.google.gson.Gson;

@Controller
@EnableWebMvc
public class UserManagementController {
	
	@Value("${appincse.remoteCseId}")
    private String remoteCseId; 
	
	@Autowired
	IAppInCseService appInCseService;

	@Autowired
	private MessageSource messages;

	@Autowired
	private IRefererService refererService;

	@Autowired
	private IUserService userService;
	
	@Autowired
    private PasswordEncoder passwordEncoder;
	
	@Autowired
	private ApplicationEventPublisher eventPublisher;

	private final String RCN_PREFIX = "rcn";
	private final String RCN_CODE = "5";

	@ModelAttribute("allReferers")
	public List<Referer> clearReferers() {
		return this.refererService.removeAll();
	}

	@RequestMapping("/manageUser.html")
	public ModelAndView fetchUserList(HttpServletRequest request,  final Locale locale, ModelAndView model) throws IOException, JSONException {
		
		return requestUser(request,locale,model);
	}
	
	@RequestMapping("/manageUser.html/ajax")
	public @ResponseBody String managementOperation(HttpServletRequest request,  final Locale locale, ModelAndView modelParam) throws IOException, JSONException {
		
		List<HashMap<String, String>> list= new ArrayList<>();
        
		String operation = request.getParameter("operation");
		
		if(operation!=null && operation.equals("createUser")){
			modelParam = generateUser(request,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		}
		if(operation!=null && operation.equals("getRoles")){
			
			modelParam = getRoles(request,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		    
		}
		if(operation!=null && operation.equals("updateUser")){
			
			modelParam = updateUser(request,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		    
		}
		
		return new Gson().toJson(modelParam);
	}

	private ModelAndView updateUser(HttpServletRequest request, Locale locale,ModelAndView model) {

		String userId = request.getParameter("userId");
		String firstName = request.getParameter("firstName");
		String lastName = request.getParameter("lastName");
		String is2fa = request.getParameter("is2fa").equalsIgnoreCase( "true" ) ? "true" : "false";
		String roleList = request.getParameter("roles");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String applicationInUrl = remoteCseId + "?apiOperation=updateUser&userId=" + userId +"&roles=" + roleList +"&firstName=" + firstName +"&lastName=" + lastName +"&is2fa=" + is2fa;
		
		final String result = appInCseService.sendPutRequest(applicationInUrl, params);
		
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		
		model.addObject("result", result);
		
		return model;
	}

	private ModelAndView getRoles(HttpServletRequest request,Locale locale, ModelAndView model) throws JSONException {

		HttpSession session = request.getSession();
		
		List<HashMap<String, String>> list= new ArrayList<>();	
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String companyId = session.getAttribute("companyId").toString();
		String applicationInUrl = remoteCseId + "?apiOperation=getRoles&companyId="+companyId;
		
		final String result = appInCseService.sendGetRequest(applicationInUrl, params);
		
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		JSONObject jsonObj = new JSONObject(result);
		JSONObject jsonBody = jsonObj.getJSONObject("m2m:roles");
		JSONArray jArray = jsonBody.getJSONArray("rllist");
		
		ArrayList<HashMap> hmList =new ArrayList();
		
		for (int i = 0; i < jArray.length(); i++) {

			HashMap<String, String> chHM = new HashMap<>();
			chHM.put("id", jArray.getJSONObject(i).getString(("rlid")));
			chHM.put("name", jArray.getJSONObject(i).getString(("rlname")));
			chHM.put("displayname", jArray.getJSONObject(i).getString(("rldisplayname")));

			hmList.add(chHM);
		}
		
		model.addObject("roleList", hmList);
		return model;
	}

	public ModelAndView generateUser(HttpServletRequest request, final Locale locale,ModelAndView model) {
		String operation = request.getParameter("operation");
		String firstName = request.getParameter("firstName");
		String lastName = request.getParameter("lastName");
		String email = request.getParameter("email");
		String roles = request.getParameter("roles");
		String password = request.getParameter("password");
		
		password = passwordEncoder.encode( password );

		//check email is already exists
		if(userService.emailExist( email )) {
			model.addObject("messageError",
					messages.getMessage("UniqueUsername.user.username", null, locale));
			return model;
		}

		//check email is valid
		if(isValidEmailAddress(email)){
			Map<String, Object> params = new HashMap<String, Object>();
			params.put(RCN_PREFIX, RCN_CODE);
			String applicationInUrl = remoteCseId + "?apiOperation="+operation+"&firstName="+firstName+"&lastName="+lastName+"&email="+email+"&password="+password+"&roles="+roles;

			//send createUser request
			final String result = appInCseService.sendPostRequest(applicationInUrl,params);
			if (result == null) {
				model.addObject("messageError",
						messages.getMessage("message.error", null, locale));
				return model;
			}
			//check if user is created
			final User registered = userService.findUserByEmail( email );
			if(registered != null) {
				//send confirmation email
				try {
					eventPublisher.publishEvent(new OnRegistrationCompleteEvent(registered, request.getLocale(), getAppUrl(request)));
				} catch (Exception e) {
					model.addObject("messageError",
							messages.getMessage("message.error.registration.mail", null, locale) + e.getMessage());
					return model;
				}
			} else {
				//user is not created. Error in api operation
				model.addObject("messageError",
						messages.getMessage("message.error.registration.user", null, locale));
				return model;
			}
			model.addObject("result", result);
		} else {
			//email address is not valid
			model.addObject("messageError",
					messages.getMessage("message.badEmail", null, locale));
			return model;
		}
		model.addObject("messageInfo", messages.getMessage("message.regSucc", null, locale));
		return model;
	}

	public ModelAndView requestUser(HttpServletRequest request, final Locale locale,ModelAndView model) throws JSONException{
		HttpSession session = request.getSession();

		List<HashMap<String, String>> list= new ArrayList<>();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);

		String applicationInUrl = remoteCseId + "?apiOperation=getUsers";
		List<String> superAdminRoles = new ArrayList<>(  );
		superAdminRoles.add( "ROLE_SUPERADMIN" );
		if(!userService.checkRoleByName( superAdminRoles )) {
			applicationInUrl += "&company=" + session.getAttribute( "companyId" );
		}

		final String result = appInCseService.sendGetRequest(applicationInUrl, params);

		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		JSONObject jsonObj = new JSONObject(result);
		JSONObject jsonBody = jsonObj.getJSONObject("m2m:users");
		JSONArray jArray = jsonBody.getJSONArray("userlist");

		ArrayList<HashMap> hmList =new ArrayList();

		for (int i = 0; i < jArray.length(); i++) {

			HashMap<String, Object> chHM = new HashMap<>();
			chHM.put("id", jArray.getJSONObject(i).getString(("user_id")));
			chHM.put("firstName", jArray.getJSONObject(i).getString(("user_first_name")));
			chHM.put("lastName", jArray.getJSONObject(i).getString(("user_last_name")));
			chHM.put("email", jArray.getJSONObject(i).getString(("user_email")));
			chHM.put("is2fa", jArray.getJSONObject(i).getBoolean(("is2fa")));
			chHM.put("enabled", jArray.getJSONObject(i).getBoolean(("enabled")));

			JSONArray jRoleArray = jArray.getJSONObject(i).getJSONArray("rllist");
			ArrayList<HashMap> roleList =new ArrayList();

			for (int j = 0; j < jRoleArray.length(); j++) {
				HashMap<String, Object> roleHM = new HashMap<>();
				roleHM.put("id", jRoleArray.getJSONObject(j).getString(("rlid")));
				roleHM.put("name", jRoleArray.getJSONObject(j).getString(("rlname")));
				roleHM.put("displayName", jRoleArray.getJSONObject(j).getString(("rldisplayname")));
				roleList.add( roleHM );
			}
			chHM.put("userRoles", roleList);
			hmList.add(chHM);
		}

		model.addObject("userList", hmList);
		return model;
	}

	public static boolean isValidEmailAddress(String email) {
		return true;
		//TODO remove comment
		/*
		boolean result = true;
		try {
			InternetAddress emailAddr = new InternetAddress( email );
			emailAddr.validate();
		} catch (AddressException ex) {
			result = false;
		}
		return result;
		*/
	}

	private String getAppUrl(HttpServletRequest request) {
		return "http://" + request.getServerName() + ":" + request.getServerPort() + request.getContextPath();
	}
}