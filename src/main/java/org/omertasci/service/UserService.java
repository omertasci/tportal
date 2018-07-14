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

import org.omertasci.persistence.dao.PasswordResetTokenRepository;
import org.omertasci.persistence.dao.RoleRepository;
import org.omertasci.persistence.dao.UserRepository;
import org.omertasci.persistence.dao.VerificationTokenRepository;
import org.omertasci.persistence.model.PasswordResetToken;
import org.omertasci.persistence.model.Privilege;
import org.omertasci.persistence.model.Role;
import org.omertasci.persistence.model.User;
import org.omertasci.persistence.model.VerificationToken;
import org.omertasci.persistence.model.Widget;
import org.omertasci.web.dom.Referer;
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
public class UserService implements IUserService {
	private final Logger logger = LoggerFactory.getLogger(getClass());

	@Value("${appincse.remoteCseId}")
	private String remoteCseId;

	@Autowired
	private UserRepository repository;

	@Autowired
	private VerificationTokenRepository tokenRepository;

	@Autowired
	private PasswordResetTokenRepository passwordTokenRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private SessionRegistry sessionRegistry;

	@Autowired
	IAppInCseService appInCseService;

	public static final String TOKEN_INVALID = "invalidToken";
	public static final String TOKEN_EXPIRED = "expired";
	public static final String TOKEN_VALID = "valid";

	public static String QR_PREFIX = "https://chart.googleapis.com/chart?chs=200x200&chld=M%%7C0&cht=qr&chl=";
	public static String APP_NAME = "SpringRegistration";

	// API

	@Override
	public User registerNewUserAccount(final UserDto accountDto) {
		if (emailExist(accountDto.getEmail())) {
			throw new UserAlreadyExistException(
					"There is an account with that email adress: "
							+ accountDto.getEmail());
		}
		final User user = new User();

		user.setFirstName(accountDto.getFirstName());
		user.setLastName(accountDto.getLastName());
		user.setPassword(passwordEncoder.encode(accountDto.getPassword()));
		user.setEmail(accountDto.getEmail());
		user.setUsing2FA(accountDto.isUsing2FA());
		user.setRoles(Arrays.asList(roleRepository.findByName("ROLE_USER")));
		return repository.save(user);
	}

	@Override
	public User getUser(final String verificationToken) {
		final VerificationToken token = tokenRepository
				.findByToken(verificationToken);
		if (token != null) {
			return token.getUser();
		}
		return null;
	}

	@Override
	public VerificationToken getVerificationToken(final String VerificationToken) {
		return tokenRepository.findByToken(VerificationToken);
	}

	@Override
	public void saveRegisteredUser(final User user) {
		repository.save(user);
	}

	@Override
	public void deleteUser(final User user) {
		final VerificationToken verificationToken = tokenRepository
				.findByUser(user);

		if (verificationToken != null) {
			tokenRepository.delete(verificationToken);
		}

		final PasswordResetToken passwordToken = passwordTokenRepository
				.findByUser(user);

		if (passwordToken != null) {
			passwordTokenRepository.delete(passwordToken);
		}

		repository.delete(user);
	}

	@Override
	public void createVerificationTokenForUser(final User user,
			final String token) {
		final VerificationToken myToken = new VerificationToken(token, user);
		tokenRepository.save(myToken);
	}

	@Override
	public VerificationToken generateNewVerificationToken(
			final String existingVerificationToken) {
		VerificationToken vToken = tokenRepository
				.findByToken(existingVerificationToken);
		vToken.updateToken(UUID.randomUUID().toString());
		vToken = tokenRepository.save(vToken);
		return vToken;
	}

	@Override
	public void createPasswordResetTokenForUser(final User user,
			final String token) {
		final PasswordResetToken myToken = new PasswordResetToken(token, user);
		passwordTokenRepository.save(myToken);
	}

	@Override
	public User findUserByEmail(final String email) {
		return repository.findByEmail(email);
	}

	@Override
	public PasswordResetToken getPasswordResetToken(final String token) {
		return passwordTokenRepository.findByToken(token);
	}

	@Override
	public User getUserByPasswordResetToken(final String token) {
		return passwordTokenRepository.findByToken(token).getUser();
	}

	@Override
	public User getUserByID(final long id) {
		return repository.findOne(id);
	}

	@Override
	public void changeUserPassword(final User user, final String password) {
		user.setPassword(passwordEncoder.encode(password));
		repository.save(user);
	}

	@Override
	public boolean checkIfValidOldPassword(final User user,
			final String oldPassword) {
		return passwordEncoder.matches(oldPassword, user.getPassword());
	}

	@Override
	public String validateVerificationToken(String token) {
		final VerificationToken verificationToken = tokenRepository
				.findByToken(token);
		if (verificationToken == null) {
			return TOKEN_INVALID;
		}

		final User user = verificationToken.getUser();
		final Calendar cal = Calendar.getInstance();
		if ((verificationToken.getExpiryDate().getTime() - cal.getTime()
				.getTime()) <= 0) {
			tokenRepository.delete(verificationToken);
			return TOKEN_EXPIRED;
		}

		user.setEnabled(true);
		// tokenRepository.delete(verificationToken);
		repository.save(user);
		return TOKEN_VALID;
	}

	@Override
	public String generateQRUrl(User user) throws UnsupportedEncodingException {
		return QR_PREFIX
				+ URLEncoder.encode(String.format(
						"otpauth://totp/%s:%s?secret=%s&issuer=%s", APP_NAME,
						user.getEmail(), user.getSecret(), APP_NAME), "UTF-8");
	}

	@Override
	public User updateUser2FA(boolean use2FA) {
		final Authentication curAuth = SecurityContextHolder.getContext()
				.getAuthentication();
		User currentUser = (User) curAuth.getPrincipal();
		currentUser.setUsing2FA(use2FA);
		currentUser = repository.save(currentUser);
		final Authentication auth = new UsernamePasswordAuthenticationToken(
				currentUser, currentUser.getPassword(),
				curAuth.getAuthorities());
		SecurityContextHolder.getContext().setAuthentication(auth);
		return currentUser;
	}

	@Override
	public boolean emailExist(final String email) {
		return repository.findByEmail(email) != null;
	}

	@Override
	public List<String> getUsersFromSessionRegistry() {
		return sessionRegistry
				.getAllPrincipals()
				.stream()
				.filter((u) -> !sessionRegistry.getAllSessions(u, false)
						.isEmpty()).map(Object::toString)
				.collect(Collectors.toList());
	}

	@Override
	public User currentUserDetails() {
		SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		if (authentication != null) {
			Object principal = authentication.getPrincipal();
			return principal instanceof User ? (User) principal : null;
		}
		return null;
	}

	public boolean checkPrivilegeByName(List<String> strPrivList) {

		User activeUser = currentUserDetails();
		List<Role> userRoles = activeUser.getRoles();

		for (Role role : userRoles) {

			List<String> privNameList = new ArrayList<String>();

			for (Privilege priv : role.getPrivileges()) {
				privNameList.add(priv.getName());
			}

			if (privNameList.containsAll(strPrivList)) {
				return true;
			}
		}
		return false;
	}

	public boolean checkRoleByName(List<String> strRoleList) {
		User activeUser = currentUserDetails();
		List<Role> userRoles = activeUser.getRoles();

		for (Role role : userRoles) {
			if (role.getName().equals("ROLE_SUPERADMIN")
					|| strRoleList.contains(role.getName())) {
				return true;
			}
		}
		return false;
	}

	@Transactional(Transactional.TxType.NEVER)
	public HashMap<String, Object> getUserDetails(Long userId) {

		final User user = repository.getOne(userId);
		System.out.println(user.getRoles().get(0));

		Map<String, Object> params = new HashMap<String, Object>();

		String applicationInUrl = remoteCseId
				+ "?apiOperation=getUserDetails&userId=" + userId
				+ "&roleName=ROLE_SUPERADMIN";

		String result = null;
		try {
			result = appInCseService.sendGetRequest(applicationInUrl, params);
		} catch (Exception e) {
			logger.debug("Exception received from API call");
			logger.error(e.getMessage());
			return null;
		}

		JSONObject jsonObj;
		HashMap<String, Object> userMap = new HashMap<>();
		try {
			jsonObj = new JSONObject(result);
			if (!jsonObj.has("m2m:user")) {
				logger.error("UserDetails response error");
				return null;
			}

			JSONObject jsonBody = jsonObj.getJSONObject("m2m:user");
			// userMap.put( "user_id", jsonBody.getLong( "user_id" ) );
			// userMap.put( "user_first_name", jsonBody.getString(
			// "user_first_name" ) );
			// userMap.put( "user_last_name", jsonBody.getString(
			// "user_last_name" ) );
			userMap.put("user_email", jsonBody.getString("user_email"));
			// userMap.put( "is2fa", jsonBody.getBoolean( "is2fa" ) );
			/*
			 * if (jsonBody.has( "rllist" )) { JSONArray roleArray =
			 * jsonBody.getJSONArray( "rllist" ); List<HashMap<String, Object>>
			 * roleList = new ArrayList<>(); for (int i = 0; i <
			 * roleArray.length(); i++) { HashMap<String, Object> roleHM = new
			 * HashMap<>(); roleHM.put( "rlid", roleArray.getJSONObject( i
			 * ).getLong( ("rlid") ) ); roleHM.put( "rlname",
			 * roleArray.getJSONObject( i ).getString( ("rlname") ) );
			 * roleHM.put( "rldisplayname", roleArray.getJSONObject( i
			 * ).getString( ("rldisplayname") ) ); if (jsonBody.has( "prvlist"
			 * )) { JSONArray privArray = jsonBody.getJSONArray( "prvlist" );
			 * List<HashMap<String, Object>> privList = new ArrayList<>(); for
			 * (int j = 0; j < privArray.length(); j++) { HashMap<String,
			 * Object> privHM = new HashMap<>(); privHM.put( "prvid",
			 * roleArray.getJSONObject( j ).getLong( ("prvid") ) ); privHM.put(
			 * "prvname", roleArray.getJSONObject( j ).getString( ("prvname") )
			 * ); privHM.put( "prvdisplayname", roleArray.getJSONObject( j
			 * ).getString( ("prvdisplayname") ) ); privList.add( privHM ); }
			 * roleHM.put( "prvlist", privList ); } roleList.add( roleHM ); }
			 * userMap.put( "rllist", roleList ); }
			 */
			if (jsonBody.has("gwgs")) {
				JSONArray gwgArray = jsonBody.getJSONArray("gwgs");
				List<HashMap<String, Object>> gwqList = new ArrayList<>();
				for (int i = 0; i < gwgArray.length(); i++) {
					HashMap<String, Object> gwgHM = new HashMap<>();
					gwgHM.put("gwgid",
							gwgArray.getJSONObject(i).getLong(("gwgid")));
					gwgHM.put("gwgname",
							gwgArray.getJSONObject(i).getString(("gwgname")));
					gwgHM.put("gwgcseid",
							gwgArray.getJSONObject(i)
									.getString(("gwgcsrresid"))); // old value
																	// :gwgcseid
					gwgHM.put("csi",
							gwgArray.getJSONObject(i).getString(("csi")));
					gwgHM.put("gwguids",
							gwgArray.getJSONObject(i).has("gwguids") ? gwgArray
									.getJSONObject(i).getString(("gwguids"))
									: "");
					gwgHM.put("gwgpids",
							gwgArray.getJSONObject(i).has("gwgpids") ? gwgArray
									.getJSONObject(i).getString(("gwgpids"))
									: "");
					gwqList.add(gwgHM);
				}
				userMap.put("gwgs", gwqList);
			}
			if (jsonBody.has("companylist")) {
				JSONArray companyArray = jsonBody.getJSONArray("companylist");
				List<HashMap<String, Object>> companyList = new ArrayList<>();
				for (int i = 0; i < companyArray.length(); i++) {
					HashMap<String, Object> companyHM = new HashMap<>();
					companyHM.put("company_id", companyArray.getJSONObject(i)
							.getLong(("company_id")));
					companyHM.put("company_code", companyArray.getJSONObject(i)
							.getString(("company_code")));
					companyHM.put("company_name", companyArray.getJSONObject(i)
							.getString(("company_name")));
					companyHM.put("create_date", companyArray.getJSONObject(i)
							.getString(("create_date")));
					companyList.add(companyHM);
				}
				userMap.put("companylist", companyList);
			}
		} catch (JSONException je) {
			logger.debug("Error While parsing getUserDetails response");
			logger.error(je.getMessage());
		} catch (Exception e) {
			logger.debug("Error occured on getUserDetails response");
			logger.error(e.getMessage());
		}
		return userMap;
	}

}