package org.omertasci.service;

import javax.servlet.http.HttpSession;

import org.omertasci.persistence.model.SessionKey;
import org.omertasci.persistence.model.User;

public interface ISessionKeyService {

    SessionKey generateSessionKeyIfNotFound(final User user, final String ipAddress);

    SessionKey generateSessionKey(final User user, final String ipAddress);

    void expireSessionKeyIfFound(final User user);

    String retrieveKey(final User user);

    void loadGWGroups(HttpSession session);
}
