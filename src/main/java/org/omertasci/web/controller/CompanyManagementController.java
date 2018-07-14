package org.omertasci.web.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;



import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.omertasci.constant.*;
import org.omertasci.service.AppInCseService;
import org.omertasci.service.IAppInCseService;
import org.omertasci.service.IRefererService;
import org.omertasci.service.IUserService;
import org.omertasci.web.dom.Referer;
import org.omertasci.web.util.GenericResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
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
public class CompanyManagementController {
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	@Value("${appincse.remoteCseId}")
    private String remoteCseId;
	
	@Autowired
    IUserService userService;
	
	@Autowired
	IAppInCseService appInCseService;

	@Autowired
	private MessageSource messages;

	@Autowired
	private IRefererService refererService;

	private final String RCN_PREFIX = "rcn";
	private final String RCN_CODE = "5";

	@ModelAttribute("allReferers")
	public List<Referer> clearReferers() {
		return this.refererService.removeAll();
	}

	@RequestMapping("/manageCompany.html")
	public ModelAndView fetchCompanyList(HttpServletRequest request, HttpServletResponse response,  final Locale locale, ModelAndView model) throws IOException, JSONException {
		
		List<String> privNameList = new ArrayList<String>();
		privNameList.add("VIEW_COMPANY_LIST");
		
		if(!userService.checkPrivilegeByName(privNameList)){
			try {
				response.sendRedirect("/forbidden.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		return requestCompany(request,locale, model);
	}
public ModelAndView requestCompany(HttpServletRequest request, final Locale locale,ModelAndView model) throws JSONException{
		
		List<HashMap<String, String>> list= new ArrayList<>();	
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String applicationInUrl = remoteCseId + "?apiOperation=getCompanies";
		
		final String result = appInCseService.sendGetRequest(applicationInUrl, params);
		
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		JSONObject jsonObj = new JSONObject(result);
		JSONObject jsonBody = jsonObj.getJSONObject("m2m:companies");
		JSONArray jArray = jsonBody.getJSONArray("companylist");
		
		ArrayList<HashMap> hmList =new ArrayList();
		
		for (int i = 0; i < jArray.length(); i++) {

			HashMap<String, String> chHM = new HashMap<>();
			chHM.put("company_id", jArray.getJSONObject(i).getString(("company_id")));
			chHM.put("company_code", jArray.getJSONObject(i).getString(("company_code")));
			chHM.put("company_name", jArray.getJSONObject(i).getString(("company_name")));
			chHM.put("create_date", jArray.getJSONObject(i).getString("create_date"));
			hmList.add(chHM);
		}
		
		model.addObject("companyList", hmList);
		return model;
	}
	
	@RequestMapping("/manageCompany.html/ajax")
	public @ResponseBody String managementOperation(HttpServletRequest request, HttpServletResponse response, final Locale locale, ModelAndView modelParam) throws IOException, JSONException {
			        
		String operation = request.getParameter("operation");
		
		if(operation!=null && operation.equals("getCompanyModalAttributes")){
			modelParam = getCompanies(request,locale, modelParam);
			modelParam = getUsers(request,locale, modelParam);
			return new Gson().toJson(modelParam);
		}
		if(operation!=null && operation.equals("createCompany")){
			modelParam = createCompany(request, response, locale, modelParam);

			return new Gson().toJson(modelParam);
		}
		if(operation!=null && operation.equals("updateCompany")){
			modelParam = updateCompany(request,response,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		}
		
		if(operation!=null && operation.equals("getCompanies")){
			modelParam =  getCompanies(request,locale, modelParam);
			return  new Gson().toJson(modelParam);
		    
		}
		
		return new Gson().toJson(modelParam);
	}

	public ModelAndView createCompany(HttpServletRequest request, HttpServletResponse response, final Locale locale,ModelAndView model) {
		List<String> privNameList = new ArrayList<String>();
		privNameList.add("CREATE_COMPANY");
		
		if(!userService.checkPrivilegeByName(privNameList)){
			try {
				response.sendRedirect("/forbidden.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		String companyCode = request.getParameter("companyCode");
		String companyName = request.getParameter("companyName");
		String parentID = request.getParameter("parentID");
		String adminUserId = request.getParameter("adminUserId");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		String applicationInUrl = remoteCseId + "?apiOperation=createCompany"+"&companyCode="
		+companyCode+"&companyName="+companyName+"&adminUserId="+adminUserId;
		applicationInUrl += Integer.parseInt(parentID) >0 ?"&parentID="+parentID :"";
		
		//http://localhost:8080/~/in-cse?apiOperation=createCompany&companyName=TOYOTA&companyCode=TOYOTA&parentID=&adminUserId=1000
		
		String result = null;
		try {
			result = appInCseService.sendPostRequest(applicationInUrl,params);
		} catch (Exception e) {
			LOGGER.error( e.getMessage() );
		}

		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}

		model.addObject("message",
				messages.getMessage("message.success.create", null, locale));
		model.addObject("result", result);
		return model;
	}
	
	private ModelAndView updateCompany(HttpServletRequest request, HttpServletResponse response, Locale locale,ModelAndView model) {

		List<String> privNameList = new ArrayList<String>();
		privNameList.add("EDIT_COMPANY");
		
		if(!userService.checkPrivilegeByName(privNameList)){
			try {
				response.sendRedirect("/forbidden.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		String companyId = request.getParameter("companyId");
		String companyName = request.getParameter("companyName");
		String companyCode = request.getParameter("companyCode");
		String parentCompany = request.getParameter("parentCompany");
		String adminUser = request.getParameter("adminUser");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String applicationInUrl = remoteCseId + "?apiOperation=updateCompany&companyId=" + companyId +"&companyName=" + companyName +"&companyCode=" + companyCode +"&parentCompany=" + parentCompany
		 +"&adminUser=" + adminUser;		
		String result = null;
		try {
			result = appInCseService.sendPutRequest(applicationInUrl, params);
		} catch (Exception e) {
			LOGGER.error( e.getMessage() );
		}
		
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}

		model.addObject("message",
				messages.getMessage("message.success.update", null, locale));
		model.addObject("result", result);
		
		return model;
	}
	
	public ModelAndView getCompanies(HttpServletRequest request, final Locale locale,ModelAndView model) throws JSONException {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		String applicationInUrl = remoteCseId + "?apiOperation=getCompanies";

		final String result = appInCseService.sendGetRequest(applicationInUrl,params);
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		
		JSONObject jsonObj = new JSONObject(result);
		JSONObject jsonBody = jsonObj.getJSONObject("m2m:companies");
		JSONArray jArray = jsonBody.getJSONArray("companylist");

		model.addObject("compList", jArray);
		
		return model;
	}

	private ModelAndView getUsers(HttpServletRequest request, Locale locale, ModelAndView model) throws JSONException {
		HttpSession session = request.getSession();

		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		String applicationInUrl = remoteCseId + "?apiOperation=getUsers";

		List<String> superAdminRoles = new ArrayList<>(  );
		superAdminRoles.add( "ROLE_SUPERADMIN" );
		if(!userService.checkRoleByName( superAdminRoles )) {
			applicationInUrl += "&company=" + session.getAttribute( "companyId" );
		}

		final String result = appInCseService.sendGetRequest(applicationInUrl,params);

		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		
		JSONObject jsonObj = new JSONObject(result);
		JSONObject jsonBody = jsonObj.getJSONObject("m2m:users");
		JSONArray jArray = jsonBody.getJSONArray("userlist");

		model.addObject("userList", jArray);		
		
		return model;
	}

}