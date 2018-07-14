package org.omertasci.service;


import java.util.Map;

import org.springframework.http.HttpStatus;

public interface IAppInCseService {

    String sendGetRequest(String queryString);

    String sendPostRequest(String queryString);

	String sendGetRequest(Map<String, Object> params);

	String sendGetRequest(String queryString, Map<String, Object> params);

	String sendPostRequestAbroad(String queryString, Map<String, Object> params);
	
	String sendDeleteRequestAbroad(String queryString, Map<String, Object> params);

	String sendPostRequest(String queryString, Map<String, Object> params);
	
	HttpStatus sendPostRequest(String queryString, Map<String, Object> params, String body,
			Map<String, String> headerMap);
	
	String sendPostRequestGetResponse(String queryString, Map<String, Object> params, String body,
			Map<String, String> headerMap);

	String sendGetRequest(String queryString, Map<String, Object> params, Map<String, String> headerMap);

	String sendPutRequest(String queryString, Map<String, Object> params);

	String sendPutRequestGetResponse(String queryString,Map<String, Object> params, String body,Map<String, String> headerMap);

}
