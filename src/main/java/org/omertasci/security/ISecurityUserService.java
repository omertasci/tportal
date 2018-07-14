package org.omertasci.security;

public interface ISecurityUserService {

    String validatePasswordResetToken(long id, String token);

}
