package org.omertasci.persistence.dao;

import java.util.Collection;

import org.omertasci.persistence.model.Role;
import org.omertasci.persistence.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Role findByName(String name);
    
    Role findByUsers(Collection<User> users);

    @Override
    void delete(Role role);

}
