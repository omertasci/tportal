package org.omertasci.web.controller;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
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
import org.omertasci.persistence.model.User;
import org.omertasci.service.*;
import org.omertasci.web.dom.Referer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
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
public class DashboardController {
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
    @Autowired
    private Environment env;

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

	@Autowired
	private ISessionKeyService sessionService;

	private final String RCN_PREFIX = "rcn";
	private final String RCN_CODE = "5";
	
	private final SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
	
	private Date startDate ;
	private Date endDate ;

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	@ModelAttribute("allReferers")
	public List<Referer> clearReferers() {
		LOGGER.debug( "Referer list is clearing" );
		return this.refererService.removeAll();
	}

	@RequestMapping(value = "/loginCompleted", method = RequestMethod.POST)
	public void loginCompleted(final HttpServletRequest request,HttpServletResponse response, @RequestParam("company") final String company) {
		LOGGER.debug("User is logged in with company : " + company);
		final HttpSession session = request.getSession(false);
		session.setAttribute( "companyId" , company.split( ";" )[0]);
		session.setAttribute( "companyName" , company.split( ";" )[1]);
		session.setAttribute( "companyCode" , company.split( ";" )[2]);

		try {
			sessionService.loadGWGroups(session);
		} catch (Exception e) {
			LOGGER.error( "Error while loading gateway groups" );
		}
		try {
			response.sendRedirect( request.getContextPath() + "/index.html" );
		} catch (IOException e) {
			LOGGER.error( "Error while redirecting to index.html" );
		}
	}

	@RequestMapping("/index.html")
	public ModelAndView onLoad(HttpServletRequest request, HttpServletResponse response, final Locale locale, ModelAndView model) {

		List<String> privNameList = new ArrayList<String>();
		privNameList.add("VIEW_DASHBOARD");
		
		if(!userService.checkPrivilegeByName(privNameList)){
			try {
				response.sendRedirect("/tportal/forbidden.html");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return model;
	}

	private HashMap<String,Integer> buildGWStateMap(String stateStr) {
				
		String[] statearr = stateStr.split("\\|");
		String[] stateValArr;
		HashMap<String,Integer> hm =new HashMap<>();
		
		for(int i= 0; i< statearr.length; i++){
			stateValArr = statearr[i].split(":");
			hm.put(stateValArr[0].trim(), Integer.parseInt(stateValArr[1].trim()));
			
		}			
		return hm;
	}

	@RequestMapping("/index.html/ajax")
	public @ResponseBody String afterLoad(HttpServletRequest request, final Locale locale, ModelAndView model) {
		
		String operation = request.getParameter("operation");
		
		if(operation!=null && operation.equals("fetchReports")){
			model = fetchReports(request,locale, model);
			
			return new Gson().toJson(model);
		}
		if(operation!=null && operation.equals("fetchReportDataByDuration")){
			model = fetchReportDataByDuration(request,locale, model);
			
			return new Gson().toJson(model);
		}
		return new Gson().toJson(model);
	}
	
	private ModelAndView fetchReports(HttpServletRequest request, Locale locale, ModelAndView model) {
		HttpSession session = request.getSession();

		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);

		String startDate = getStartDateofDuration(30);

		this.setEndDate(getEndOfDay(new Date()));
		String endDate = formatDate(this.endDate);

		String result = "";
		ArrayList<HashMap<String, Object>> hmList = null;

		// String applicationInUrl = remoteCseId +
		// "rprt?id=all"+"&rid="+""+"&startDate=" + startDate+"&endDate=" + endDate;

		String applicationInUrl = remoteCseId + "rprt?id=list,0,1,2,3,4,5,6" + "&rid=" + "" + "&startDate=" + startDate
				+ "&endDate=" + endDate;

		List<String> superAdminRoles = new ArrayList<>();
		superAdminRoles.add("ROLE_SUPERADMIN");
		if (!userService.checkRoleByName(superAdminRoles)) {
			applicationInUrl += "&company=" + session.getAttribute("companyId");
		}

		String[] equalSplit = null;
		try {
			result = appInCseService.sendGetRequest(applicationInUrl, params);

			String[] splitResult = result.split("&");
			Boolean isEmpty;
			for (String ampersandSplit : splitResult) {
				isEmpty = false;
				equalSplit = ampersandSplit.split("=");
				hmList = new ArrayList<HashMap<String, Object>>();
				try {

					if (!equalSplit[1].equals("null")) {
						String[] strarr = equalSplit[1].split("\\|");

						for (int j = 0; j < strarr.length; j++) {

							HashMap<String, Object> chHM = new HashMap<>();

							for (int k = 0; k < strarr[j].split(":").length; k++) {
								chHM.put("value" + k, strarr[j].split(":")[k].trim());
							}
							chHM.put("startDate", formatter.format(this.startDate));
							chHM.put("endDate", formatter.format(this.endDate));
							hmList.add(chHM);
						}

						model.addObject("report_" + equalSplit[0], hmList);
					} else {
						isEmpty = true;
					}
				} catch (Exception e) {
					isEmpty = true;
				}
				if (isEmpty) {
					LOGGER.warn("Report " + equalSplit[0] + "content is empty!");

					HashMap<String, Object> chHM = new HashMap<>();
					chHM.put("startDate", formatter.format(this.startDate));
					chHM.put("endDate", formatter.format(this.endDate));
					hmList.add(chHM);
					model.addObject("report_" + equalSplit[0], hmList);
				}
			}
		} catch (Exception e) {
			LOGGER.warn("Report request is failed!");
		}

		return model;
	}

	private ModelAndView fetchReportDataByDuration(HttpServletRequest request,Locale locale, ModelAndView model) {

		List<HashMap<String, String>> list = new ArrayList<>();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put(RCN_PREFIX, RCN_CODE);

		String rprtId = request.getParameter("rprtId");
		String startDate = getStartDateofDuration(Integer.parseInt(request.getParameter("duration")));
		
		String endDate= formatDate(getEndOfDay(new Date()));
		
		
		String result = "";

		ArrayList<HashMap<String, Object>> hmList = new ArrayList<HashMap<String, Object>>();
		String applicationInUrl = remoteCseId + "rprt?id=" + rprtId+"&startDate=" + startDate+"&endDate=" + endDate;

		try {
			result = appInCseService.sendGetRequest(applicationInUrl, params);
			if (result != null) {
				
				String[] strarr = result.split("\\|");				
	
				for (int j = 0; j < strarr.length; j++) {
	
					HashMap<String, Object> chHM = new HashMap<>();
	
					for (int k = 0; k < strarr[j].split(":").length; k++) {
						chHM.put("value" + k, strarr[j].split(":")[k].trim());
					}
					chHM.put("startDate", formatter.format(this.startDate));
					chHM.put("endDate", formatter.format(this.endDate));
					hmList.add(chHM);
				}
				model.addObject("report_"+rprtId, hmList);
			}
		} catch (Exception e) {
			LOGGER.warn("Report "+ rprtId + "content is empty for duration "+request.getParameter("duration")+" !");
			
			HashMap<String, Object> chHM = new HashMap<>();
			chHM.put("startDate", formatter.format(this.startDate));
			chHM.put("endDate", formatter.format(this.endDate));
			hmList.add(chHM);
			model.addObject("report_"+rprtId, hmList);
		}

		return model;
	}

	public String getStartDateofDuration(int daysAgo) {

		long DAY_IN_MS = 1000 * 60 * 60 * 24;
//		DateFormat dateFormat = new SimpleDateFormat(env.getProperty("report.date.format"));
		Date date = new Date();
		this.setStartDate(new Date(date.getTime()- (daysAgo * DAY_IN_MS)));
		String datestring = formatDate(this.startDate);
		return datestring;
		
	}
	public static Date getEndOfDay(Date date) {
		  LocalDateTime localDateTime = dateToLocalDateTime(date);
		  LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);
		  return localDateTimeToDate(endOfDay);
		}
	private static Date localDateTimeToDate(LocalDateTime startOfDay) {
		  return Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());
		}
	private static LocalDateTime dateToLocalDateTime(Date date) {
		  return LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()), ZoneId.systemDefault());
		}
	
	public String formatDate(Date date){
		DateFormat dateFormat = new SimpleDateFormat(env.getProperty("report.date.format"));
		String datestring = dateFormat.format(date);
		return datestring;
	}
}