package org.omertasci.service;

import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.omertasci.persistence.model.User;
import org.omertasci.service.handler.MyErrorHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
public class AppInCseService implements IAppInCseService {
    private static final Logger log = LoggerFactory.getLogger(AppInCseService.class);
    
    @Autowired
    private HttpSession httpSession;
    
    @Value("${appincse.header.originator}")
    private String originatorKey;

    @Value("${appincse.originator.default.credential}")
    private String originatorValue;

    @Value("${appincse.url}")
    private String appInCseUrl;

    @Value("${appincse.header.sessionkey}")
    private String sKey;
    
    @Value("${appincse.header.userCompanyId}")
    private String userCompanyId;

    @Value("${appincse.header.clientIp}")
    private String clientIp;
    
    @Autowired
    ISessionKeyService sessionKeyService;

    @Autowired
    IUserService userService;

    /**
     * sending get request to IN-CSE Application
     * @param query (Ex: rcn=5)
     * @return JSON object as String
     */
    @Override
    public String sendGetRequest(Map<String, Object> params) {
        RestTemplate restTemplate = getRestTemplate();

        
        HttpEntity<String> headerEntity = new HttpEntity<String>("parameters", constructHeader(MediaType.APPLICATION_JSON,preaparedHeaders()));
        log.info( "Sending GET request : " + appInCseUrl);
        String customJsonStr = restTemplate.exchange(appInCseUrl , HttpMethod.GET, headerEntity, String.class, params).getBody();

        log.info("GET response is : "+ customJsonStr);
        return customJsonStr;
    }

    @Override
    public String sendGetRequest(String queryString, Map<String, Object> params) {
        RestTemplate restTemplate = getRestTemplate();
        restTemplate.setErrorHandler(new MyErrorHandler());

        HttpEntity<String> headerEntity = new HttpEntity<String>("parameters", constructHeader(MediaType.APPLICATION_JSON,preaparedHeaders()));
        log.info( "Sending GET request : " + prettyUrl (appInCseUrl, queryString));
        ResponseEntity<String> responseEntity = restTemplate.exchange(prettyUrl (appInCseUrl, queryString), HttpMethod.GET, headerEntity, String.class, params);
        String customJsonStr = responseEntity.getBody();
        
        if( !(responseEntity.getStatusCodeValue()+"").startsWith("200")){
        	customJsonStr += "; ErrorCode:" + responseEntity.getStatusCodeValue();
        }
        log.info("GET response is : "+ customJsonStr);
        return customJsonStr;
    }

    @Override
    public String sendPostRequestAbroad(String queryString, Map<String, Object> params) {
        RestTemplate restTemplate = getRestTemplate();
        restTemplate.setErrorHandler(new MyErrorHandler());

        HttpEntity<String> headerEntity = new HttpEntity<String>("parameters", constructHeader(MediaType.APPLICATION_JSON,null));
        log.info( "Sending POST request : " + queryString);
        ResponseEntity<String> responseEntity = restTemplate.exchange( queryString, HttpMethod.POST, headerEntity, String.class, params);
        String customJsonStr = responseEntity.getBody();
        
        if( !(responseEntity.getStatusCodeValue()+"").startsWith("200")){
        	customJsonStr += "; ErrorCode:" + responseEntity.getStatusCodeValue();
        }
        log.info("POST response is : "+ customJsonStr);
        return customJsonStr;
    }
    
    @Override
    public String sendDeleteRequestAbroad(String queryString, Map<String, Object> params) {
        RestTemplate restTemplate = getRestTemplate();
        restTemplate.setErrorHandler(new MyErrorHandler());

        HttpEntity<String> headerEntity = new HttpEntity<String>("parameters", constructHeader(MediaType.APPLICATION_JSON,null));
        log.info( "Sending DELETE request : " + queryString);
        ResponseEntity<String> responseEntity = restTemplate.exchange( queryString, HttpMethod.DELETE, headerEntity, String.class, params);
        String customJsonStr = responseEntity.getBody();
        
        if( !(responseEntity.getStatusCodeValue()+"").startsWith("200")){
        	customJsonStr += "; ErrorCode:" + responseEntity.getStatusCodeValue();
        }
        log.info("DELETE response is : "+ customJsonStr);
        return customJsonStr;
    }
    
    public RestTemplate getRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();

        StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter( Charset.forName("UTF-8"));
        stringHttpMessageConverter.setWriteAcceptCharset(true);
        for (int i = 0; i < restTemplate.getMessageConverters().size(); i++) {
            if (restTemplate.getMessageConverters().get(i) instanceof StringHttpMessageConverter) {
                restTemplate.getMessageConverters().remove(i);
                restTemplate.getMessageConverters().add(i, stringHttpMessageConverter);
                break;
            }
        }
        return restTemplate;
    }

	@Override
	public String sendGetRequest(String queryString) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public String sendPostRequest(String queryString) {
		// TODO Auto-generated method stub
		return null;
	}
		
	@Override
    public String sendPostRequest(String queryString, Map<String, Object> params) {
    	RestTemplate restTemplate = getRestTemplate();

        HttpHeaders headers = constructHeader( MediaType.APPLICATION_JSON,preaparedHeaders() );
        HttpEntity<String> headerEntity = new HttpEntity<String>("parameters", headers);
        log.info( "Sending POST request : " + appInCseUrl + queryString);
        String customJsonStr = restTemplate.exchange(appInCseUrl + queryString, HttpMethod.POST, headerEntity, String.class, params).getBody();

        log.info("POST response is : "+ customJsonStr);
        return customJsonStr;
    }

	@Override
	public HttpStatus sendPostRequest(String queryString, Map<String, Object> params, String body, Map<String, String> headerMap) {
		
		RestTemplate restTemplate = getRestTemplate();
		restTemplate.setErrorHandler(new MyErrorHandler());
		
		headerMap.putAll(preaparedHeaders());
		HttpHeaders headers = constructHeader(MediaType.APPLICATION_XML, headerMap);

		HttpEntity<String> headerEntity = new HttpEntity<String>(body, headers);
		log.info("Sending POST request : " + appInCseUrl + queryString);
		HttpStatus status = restTemplate
				.exchange(appInCseUrl + queryString, HttpMethod.POST, headerEntity, String.class, params)
				.getStatusCode();

		log.info("POST response is : " + status.getReasonPhrase());
		return status;
	}

	@Override
	public String sendGetRequest(String queryString, Map<String, Object> params, Map<String, String> headerMap) {
		RestTemplate restTemplate = getRestTemplate();
		headerMap.putAll(preaparedHeaders());
		HttpHeaders headers = constructHeader(MediaType.APPLICATION_JSON, headerMap);
		HttpEntity<String> headerEntity = new HttpEntity<String>("parameters", headers);
		log.info("Sending GET request : " + appInCseUrl + queryString);
		ResponseEntity<String> responseEntity = restTemplate.exchange(appInCseUrl + queryString, HttpMethod.GET,
				headerEntity, String.class, params);
		String customJsonStr = responseEntity.getBody();
		log.info("GET response is : " + customJsonStr);
		return customJsonStr;
	}
	
	@Override
	public String sendPostRequestGetResponse(String queryString, Map<String, Object> params, String body, Map<String, String> headerMap) {
		
		RestTemplate restTemplate = getRestTemplate();
		restTemplate.setErrorHandler(new MyErrorHandler());
		
		headerMap.putAll(preaparedHeaders());
		HttpHeaders headers = constructHeader(MediaType.APPLICATION_JSON, headerMap);

		HttpEntity<String> headerEntity = new HttpEntity<String>(body, headers);
		log.info("Sending POST request : " + appInCseUrl + queryString);
		 ResponseEntity<String> response = restTemplate.exchange(prettyUrl (appInCseUrl, queryString), HttpMethod.POST, headerEntity, String.class, params);
		String responseBody = response.getBody();
		
		Integer statusCode = response.getStatusCode().value();
		log.info("POST response is : " + response);
		log.info("POST response status code is : " + statusCode);
		
		return statusCode > 204 ? "StatusCode:" + statusCode.toString() : responseBody;
	}
	
	@Override
	public String sendPutRequest(String queryString, Map<String, Object> params) {
		RestTemplate restTemplate = getRestTemplate();

		HttpHeaders headers = constructHeader( MediaType.APPLICATION_JSON ,preaparedHeaders());
        HttpEntity<String> headerEntity = new HttpEntity<String>("parameters", headers);
        log.info( "Sending PUT request : " + appInCseUrl + queryString);
        String customJsonStr = restTemplate.exchange(prettyUrl (appInCseUrl, queryString), HttpMethod.PUT, headerEntity, String.class, params).getBody();

        log.info("PUT response is : "+ customJsonStr);
        return customJsonStr;
	}
	
	@Override
	public String sendPutRequestGetResponse(String queryString, Map<String, Object> params, String body, Map<String, String> headerMap) {
		
		RestTemplate restTemplate = getRestTemplate();
		restTemplate.setErrorHandler(new MyErrorHandler());

		headerMap.putAll(preaparedHeaders());
		HttpHeaders headers = constructHeader(MediaType.APPLICATION_XML, headerMap);

		HttpEntity<String> headerEntity = new HttpEntity<String>(body, headers);
		log.info("Sending PUT request : " + appInCseUrl + queryString);
		 ResponseEntity<String> response = restTemplate.exchange(prettyUrl (appInCseUrl, queryString), HttpMethod.PUT, headerEntity, String.class, params);
		String responseBody = response.getBody();
		
		Integer statusCode = response.getStatusCode().value();
		log.info("PUT response is : " + response);
		log.info("PUT response status code is : " + statusCode);
		
		return statusCode > 204 ? "StatusCode:" + statusCode.toString() : responseBody;
	}
	
	public String prettyUrl(String applicationInUrl, String resourceUrl) {

		resourceUrl += resourceUrl.contains("?") ? "&" : "?";

		if (StringUtils.isBlank(resourceUrl) || resourceUrl == null) {
			return applicationInUrl;
		}

		if (resourceUrl.startsWith("/")) {
			return applicationInUrl + resourceUrl.substring(1);
		}
		return applicationInUrl + resourceUrl;
	}
	
    private HttpHeaders constructHeader(MediaType appType,Map<String, String> headerMap) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(appType));

		if (headerMap != null)
			for (Entry<String, String> entry : headerMap.entrySet()) {
				headers.add(entry.getKey(), entry.getValue());
			}

        return headers;
    }
	
    public  Map<String, String> preaparedHeaders(){

    	User user = userService.currentUserDetails();
    	
    	Map<String, String> headerMap = new HashMap<String, String>();
    	headerMap.put(originatorKey, originatorValue); //ihtiyaç halinde parametrik hale getirilebilir.
    	
        if(user!= null) {
            //session key format is 'session_key:user_id'
        	headerMap.put( sKey, sessionKeyService.retrieveKey( user ) + ":" + user.getId());
        }
        
        if(httpSession.getAttribute("companyId") != null && !httpSession.getAttribute("companyId").equals("")){
        	headerMap.put( userCompanyId, httpSession.getAttribute("companyId").toString());
        }

        if(httpSession.getAttribute( "clientIp" ) != null && !httpSession.getAttribute( "clientIp" ).equals( "" )) {
        	headerMap.put( clientIp, httpSession.getAttribute("clientIp").toString());
        }
		return headerMap;
    }
}
