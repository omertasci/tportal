package org.omertasci.service;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;

import org.omertasci.persistence.model.PasswordResetToken;
import org.omertasci.persistence.model.Role;
import org.omertasci.persistence.model.VerificationToken;
import org.omertasci.web.dto.RoleDto;
import org.omertasci.web.error.RoleAlreadyExistException;

public interface IRoleService {

    Role registerNewRoleAccount(RoleDto accountDto) throws RoleAlreadyExistException;

    Role getRole(String verificationToken);

    void saveRegisteredRole(Role Role);

    void deleteRole(Role Role);

    void createVerificationTokenForRole(Role Role, String token);

    VerificationToken getVerificationToken(String VerificationToken);

    VerificationToken generateNewVerificationToken(String token);

    void createPasswordResetTokenForRole(Role Role, String token);

    Role findRoleByEmail(String email);

    PasswordResetToken getPasswordResetToken(String token);

    Role getRoleByPasswordResetToken(String token);

    Role getRoleByID(long id);

    void changeRolePassword(Role Role, String password);

    boolean checkIfValidOldPassword(Role Role, String password);

    String validateVerificationToken(String token);

    String generateQRUrl(Role Role) throws UnsupportedEncodingException;

    Role updateRole2FA(boolean use2FA);

    List<String> getRolesFromSessionRegistry();

    Role currentRoleDetails();
    
    boolean checkPrivilegeByName(List<String> privNameList);

    boolean checkRoleByName(List<String> strRoleList);

    boolean emailExist(String email);

    HashMap<String, Object> getRoleDetails(Long RoleId);
}
