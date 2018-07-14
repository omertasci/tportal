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
public class PrivilegeManagementController {
	
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

	@RequestMapping("/managePrivilege.html")
	public ModelAndView fetchPrivilegeList(HttpServletRequest request,HttpServletResponse response,  final Locale locale, ModelAndView model) throws IOException, JSONException {
		
		List<String> privNameList = new ArrayList<String>();
		privNameList.add("VIEW_PRIVILEGE_LIST");
		
		if(!userService.checkPrivilegeByName(privNameList)){
			try {
				response.sendRedirect("/forbidden.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		return requestPrivilege(request,locale,model);
	}
	
	@RequestMapping("/managePrivilege.html/ajax")
	public @ResponseBody String managementOperation(HttpServletRequest request, HttpServletResponse response, final Locale locale, ModelAndView modelParam) throws IOException, JSONException {
				        
		String operation = request.getParameter("operation");
		
		if(operation!=null && operation.equals("createPrivilege")){
			modelParam = generatePrivilege(request,response, locale, modelParam);
			
			return new Gson().toJson(modelParam);
		}
		if(operation!=null && operation.equals("updatePrivilege")){
			
			modelParam = updatePrivilege(request,response,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		    
		}
		
		return new Gson().toJson(modelParam);
	}

	public ModelAndView generatePrivilege(HttpServletRequest request, HttpServletResponse response, final Locale locale,ModelAndView model) {

		List<String> privNameList = new ArrayList<String>();
		privNameList.add("CREATE_PRIVILEGE");
		
		if(!userService.checkPrivilegeByName(privNameList)){
			try {
				response.sendRedirect("/forbidden.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		String operation = request.getParameter("operation");
		String privName = request.getParameter("privName");
		String privDisplayName = request.getParameter("privDisplayName");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		String applicationInUrl = remoteCseId + "?apiOperation="+operation+"&pName="+privName+"&dName="+privDisplayName;
		
		final String result = appInCseService.sendPostRequest(applicationInUrl,params);
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		
		model.addObject("result", result);
		return model;
	}
	
	private ModelAndView updatePrivilege(HttpServletRequest request, HttpServletResponse response, Locale locale,ModelAndView model) {

		List<String> privNameList = new ArrayList<String>();
		privNameList.add("EDIT_PRIVILEGE");
		
		if(!userService.checkPrivilegeByName(privNameList)){
			try {
				response.sendRedirect("/forbidden.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		
		String privilegeId = request.getParameter("privilegeId");
		String privilegeName = request.getParameter("privilegeName");
		String privilegeDisplayName = request.getParameter("privilegeDisplayName");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String applicationInUrl = remoteCseId + "?apiOperation=updatePrivilege&privilegeId=" + privilegeId +"&privilegeName=" + privilegeName +"&privilegeDisplayName=" + privilegeDisplayName;
		final String result = appInCseService.sendPutRequest(applicationInUrl, params);
		
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		
		model.addObject("result", result);
		
		return model;
	}
	
	public ModelAndView requestPrivilege(HttpServletRequest request, final Locale locale,ModelAndView model) throws JSONException{
		
		List<HashMap<String, String>> list= new ArrayList<>();	
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String applicationInUrl = remoteCseId + "?apiOperation=getPrivileges";
		
		final String result = appInCseService.sendGetRequest(applicationInUrl, params);
		
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		JSONObject jsonObj = new JSONObject(result);
		JSONObject jsonBody = jsonObj.getJSONObject("m2m:prvs");
		JSONArray jArray = jsonBody.getJSONArray("prvlist");
		
		ArrayList<HashMap> hmList =new ArrayList();
		
		for (int i = 0; i < jArray.length(); i++) {

			HashMap<String, String> chHM = new HashMap<>();
			chHM.put("id", jArray.getJSONObject(i).getString(("prvid")));
			chHM.put("name", jArray.getJSONObject(i).getString(("prvname")));
			chHM.put("displayname", jArray.getJSONObject(i).getString(("prvdisplayname")));

			hmList.add(chHM);
		}
				
		model.addObject("privilegeList", hmList);
		return model;
	}

}