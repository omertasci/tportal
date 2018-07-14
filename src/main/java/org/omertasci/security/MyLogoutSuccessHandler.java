package org.omertasci.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.omertasci.persistence.model.User;
import org.omertasci.service.ISessionKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

@Component("myLogoutSuccessHandler")
public class MyLogoutSuccessHandler implements LogoutSuccessHandler {

    @Autowired
    private ISessionKeyService sessionService;

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        if(authentication != null && authentication.getPrincipal() != null)
            sessionService.expireSessionKeyIfFound((User)authentication.getPrincipal());

        final HttpSession session = request.getSession();
        if (session != null) {
            session.removeAttribute("user");
            session.removeAttribute("userDetails");
            session.removeAttribute("companyId");
            session.removeAttribute("clientIp");
        }

//        response.sendRedirect("/logout.html?logSucc=true");
        response.sendRedirect(request.getContextPath()+"/login");
    }

}
