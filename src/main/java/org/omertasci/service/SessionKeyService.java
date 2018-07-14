package org.omertasci.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.omertasci.persistence.dao.SessionKeyRepository;
import org.omertasci.persistence.model.SessionKey;
import org.omertasci.persistence.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ModelAttribute;

import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;

import java.security.SecureRandom;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class SessionKeyService implements ISessionKeyService {
	
	@Value("${appincse.remoteCseId}")
    private String remoteCseId;
	
	@Autowired
	IAppInCseService appInCseService;
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
    private static final String CHARS = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ234567890!@#$";
    private static final int SESSION_KEY_LENGTH = 30;
    private LoadingCache<String, SessionKey> sessionKeyCache;

    public SessionKeyService() {
        super();
        sessionKeyCache = CacheBuilder.newBuilder().expireAfterWrite(1, TimeUnit.DAYS).build(new CacheLoader<String, SessionKey>() {
            @Override
            public SessionKey load(final String key) {
                return null;
            }
        });
    }

    @Autowired
    private SessionKeyRepository sessionRepository;

    @Override
    public SessionKey generateSessionKeyIfNotFound(final User user, final String ipAddress) {
        // == generate initial session key for admin  if not found
        SessionKey sessionKey = retrieveSessionKey(user);

        if (sessionKey == null) {
            sessionKey = new SessionKey(user, generateKey(new SecureRandom()));
            sessionKey.setIpAddress(ipAddress);
            sessionRepository.save(sessionKey);
            sessionKeyCache.put(user.getEmail(), sessionKey);
        }
        return sessionKey;
    }

    @Override
    public String retrieveKey(final User user) {
        SessionKey sessionKey = retrieveSessionKey(user);
        return sessionKey != null ? sessionKey.getToken() : null;
    }

    @Override
    public SessionKey generateSessionKey(final User user, final String ipAddress) {
        // == generate session key for all
        expireSessionKeyIfFound(user);

        SessionKey sessionKey = new SessionKey(user, generateKey(new SecureRandom()));
        sessionKey.setIpAddress(ipAddress);
        sessionRepository.save(sessionKey);
        sessionKeyCache.put(user.getEmail(), sessionKey);

        return sessionKey;
    }

    @Override
    public void expireSessionKeyIfFound(final User user) {
        // == expire session key
        SessionKey sessionKey = sessionRepository.findByUser(user, new Date());
        if (sessionKey != null) {
            sessionKey.setEndDate(new Date());
            sessionRepository.save(sessionKey);
        }
        sessionKeyCache.invalidate(user.getEmail());
    }

    /**
     * get from cache if exists or retrieve from db
     * @param user
     * @return
     */
    public SessionKey retrieveSessionKey(final User user) {
        SessionKey sessionKey = retrieveFromCache(user.getEmail());
        if (sessionKey != null)
            return sessionKey;
        return sessionRepository.findByUser(user, new Date());
    }

    private String generateKey(final SecureRandom secureRandom) {
        StringBuilder sKey = new StringBuilder(SESSION_KEY_LENGTH);
        for (int i = 0; i < SESSION_KEY_LENGTH; i++) {
            sKey.append(CHARS.charAt(secureRandom.nextInt(CHARS.length())));
        }
        return sKey.toString();
    }

    private SessionKey retrieveFromCache(String key) {
        try {
            return sessionKeyCache.get(key);
        } catch (final ExecutionException ee) {
            return null;
        } catch (final Exception e) {
            return null;
        }
    }
    
	public void loadGWGroups(HttpSession session) {
    	Map<String, Object> params = new HashMap<String, Object>();
				
		String applicationInUrl = remoteCseId + "?apiOperation=getGatewayGroups&companyId="+ session.getAttribute("companyId");
		
		final String result = appInCseService.sendGetRequest(applicationInUrl, params);
		
		JSONObject jsonObj;
		List<HashMap<String, Object>> hmList =new ArrayList<HashMap<String, Object>>();
		
		if(result !=null && result.contains("ErrorCode")){
			session.setAttribute("allGWGroups", hmList);
			return;
		}
		
		try {
			
			jsonObj = new JSONObject(result);		
		JSONObject jsonBody = jsonObj.getJSONObject("m2m:gwgs");
		JSONArray jArray = jsonBody.getJSONArray("gwg");
		
		
		
		for (int i = 0; i < jArray.length(); i++) {

			HashMap<String, Object> chHM = new HashMap<>();
			chHM.put("gwgname", jArray.getJSONObject(i).getString(("gwgname")));
            chHM.put("gwgdispname", jArray.getJSONObject(i).getString(("gwgdispname")));
			if(!hmList.contains(chHM)){
				hmList.add(chHM);
			}
			
		}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			LOGGER.warn("There is no existing Gateway Group!");
			LOGGER.warn(e.getMessage());
		}
		session.setAttribute("allGWGroups", hmList);
	}
}