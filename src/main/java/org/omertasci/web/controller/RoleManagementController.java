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
public class RoleManagementController {
	
	@Value("${appincse.remoteCseId}")
    private String remoteCseId;
	
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

	@RequestMapping("/manageRole.html")
	public ModelAndView fetchPrivilegeList(HttpServletRequest request,  final Locale locale, ModelAndView model) throws IOException, JSONException {
		
		return requestRole(request,locale,model);
	}
	
	@RequestMapping("/manageRole.html/ajax")
	public @ResponseBody String managementOperation(HttpServletRequest request,  final Locale locale, ModelAndView modelParam) throws IOException, JSONException {
		
		List<HashMap<String, String>> list= new ArrayList<>();
//
//		Foo f =new Foo();
//		f.setX(1);
//        f.setY(2);
//        f.setDescription("desc");
        
		String operation = request.getParameter("operation");
		
		if(operation!=null && operation.equals("createRole")){
			modelParam = generateRole(request,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		}
		if(operation!=null && operation.equals("getPrivileges")){
			
			modelParam = getPrivileges(request,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		    
		}
		if(operation!=null && operation.equals("updateRole")){
			
			modelParam = updateRole(request,locale, modelParam);
			
			return new Gson().toJson(modelParam);
		    
		}
		
		return new Gson().toJson(modelParam);
	}

	private ModelAndView updateRole(HttpServletRequest request, Locale locale,ModelAndView model) {

		String roleId = request.getParameter("roleId");
//		String roleName = request.getParameter("roleName");
		String privList = request.getParameter("privName");
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String applicationInUrl = remoteCseId + "?apiOperation=updateRole&rId=" + roleId +"&pId=" + privList;
		
		final String result = appInCseService.sendPutRequest(applicationInUrl, params);
		
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		
		model.addObject("result", result);
		
		return model;
	}

	private ModelAndView getPrivileges(HttpServletRequest request,Locale locale, ModelAndView model) throws JSONException {

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

	public ModelAndView generateRole(HttpServletRequest request, final Locale locale,ModelAndView model) {

		String operation = request.getParameter("operation");
		String privId = request.getParameter("privId");
		String roleName = request.getParameter("roleName")+"_"+request.getSession().getAttribute("companyCode").toString();
		String roleDisplayName = request.getParameter("roleDisplayName");

		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		String applicationInUrl = remoteCseId + "?apiOperation="+operation+"&pId="+privId+"&rName="+roleName+"&dName="+roleDisplayName;
		
		final String result = appInCseService.sendPostRequest(applicationInUrl,params);
		if (result == null) {
			model.addObject("message",
					messages.getMessage("message.error", null, locale));
			return model;
		}
		
		model.addObject("result", result);
		return model;
	}
	
	public ModelAndView requestRole(HttpServletRequest request, final Locale locale,ModelAndView model) throws JSONException{
		
		HttpSession session = request.getSession();
		List<HashMap<String, String>> list= new ArrayList<>();	
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);
		
		String companyId = session.getAttribute("companyId").toString();
		String applicationInUrl = remoteCseId + "?apiOperation=getRoles&companyId=" + companyId;
		
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

			HashMap<String, Object> chHM = new HashMap<>();
			chHM.put("id", jArray.getJSONObject(i).getString(("rlid")));
			chHM.put("name", jArray.getJSONObject(i).getString(("rlname")));
			chHM.put("displayName", jArray.getJSONObject(i).getString(("rldisplayname")));

			ArrayList<HashMap> privhmList =new ArrayList();
			JSONArray privListArray = jArray.getJSONObject(i).getJSONArray(("prvlist"));
			
			for (int j = 0; j < privListArray.length(); j++) {
				HashMap<String, String> privHM = new HashMap<>();
				privHM.put("prvid", privListArray.getJSONObject(j).getString(("prvid")));
				privHM.put("prvname", privListArray.getJSONObject(j).getString(("prvname")));
				privHM.put("prvdisplayname", privListArray.getJSONObject(j).getString(("prvdisplayname")));

				privhmList.add(privHM);
			
			}
			chHM.put("prvlist", privhmList);
			
			hmList.add(chHM);
		}
		
		
		model.addObject("roleList", hmList);
		return model;
	}

}