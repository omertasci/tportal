package org.omertasci.security;

import java.io.IOException;
import java.util.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.omertasci.persistence.model.User;
import org.omertasci.service.ISessionKeyService;
import org.omertasci.service.IUserService;
import org.springframework.context.MessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component("myAuthenticationSuccessHandler")
public class MySimpleUrlAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

    @Autowired
    ActiveUserStore activeUserStore;

    @Autowired
    IUserService userService;

    @Autowired
    private ISessionKeyService sessionService;

    @Autowired
    private MessageSource messages;

    @Autowired
    private LocaleResolver localeResolver;

    @Override
    public void onAuthenticationSuccess(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws IOException {
        handle( request, response, authentication );

        final HttpSession session = request.getSession( false );
        if (session != null) {
//            HashMap<String, Object> userDetailsMap = userService.getUserDetails( ((User) authentication.getPrincipal()).getId() );
//            if (userDetailsMap == null) {
//                clearAuthenticationAttributes( request );
//
//                final Locale locale = localeResolver.resolveLocale(request);
//                session.setAttribute( WebAttributes.ACCESS_DENIED_403, messages.getMessage("message.connection.error", null, locale) );
//            } else {
                sessionService.generateSessionKey( (User) authentication.getPrincipal(),
                        getIpAddreess( request ) );

                session.setMaxInactiveInterval( 60 * 60 );
                LoggedUser user = new LoggedUser( authentication.getName(), activeUserStore );
                session.setAttribute( "user", user );
//                session.setAttribute( "userDetails", userDetailsMap );
                session.setAttribute("clientIp", getIpAddreess( request ));
                clearAuthenticationAttributes( request );
//            }
        }
    }

    protected void handle(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication) throws IOException {
        final String targetUrl = determineTargetUrl(authentication);

        if (response.isCommitted()) {
            logger.debug("Response has already been committed. Unable to redirect to " + targetUrl);
            return;
        }

        redirectStrategy.sendRedirect(request, response, targetUrl);
    }

    protected String getIpAddreess (final HttpServletRequest request) {
        String ipAddress = request.getHeader("X-FORWARDED-FOR");
        if (ipAddress == null) {
            return request.getRemoteAddr();
        }
        return ipAddress.split(",")[0];
    }

    protected String determineTargetUrl(final Authentication authentication) {
        boolean isUser = false;
        boolean isAdmin = false;
        boolean isSuperAdmin = false;
        
        final Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        User currentUser = authentication.getPrincipal() instanceof User ? (User) (User)authentication.getPrincipal() : null;
        List<String> roleNameList = new ArrayList<String>();
        
        for(int i=0; i<currentUser.getRoles().size(); i++){
        	roleNameList.add( currentUser.getRoles().get(i).getName());
        }
        if(roleNameList.contains("ROLE_SUPERADMIN")){
        	isSuperAdmin =true;
        }
        
        for (final GrantedAuthority grantedAuthority : authorities) {
            if (grantedAuthority.getAuthority().equals("USER")) {
                isUser = true;
                isAdmin = false;
                isSuperAdmin = false;
                break;
            } else if (grantedAuthority.getAuthority().equals("ADMIN")) {
                isUser = false;
                isAdmin = true;
                isSuperAdmin = false;
                break;
            }
        }
//        User currentUser = (User) authentication.getPrincipal();
        if (isUser) {
//            return "/login";
            return "/index.html";
        } else if (isAdmin) {
//            return "/login";
        	return "/index.html";
        } else if (isSuperAdmin) {
//            return "/login";
        	return "/index.html";
      }
        else {
            throw new IllegalStateException();
        }
    }

    protected void clearAuthenticationAttributes(final HttpServletRequest request) {
        final HttpSession session = request.getSession(false);
        if (session == null) {
            return;
        }
        session.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
        session.removeAttribute(WebAttributes.ACCESS_DENIED_403);
    }

    public void setRedirectStrategy(final RedirectStrategy redirectStrategy) {
        this.redirectStrategy = redirectStrategy;
    }

    protected RedirectStrategy getRedirectStrategy() {
        return redirectStrategy;
    }
}