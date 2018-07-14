package org.omertasci.persistence.dao;

import org.omertasci.persistence.model.SessionKey;
import org.omertasci.persistence.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.stream.Stream;

public interface SessionKeyRepository extends JpaRepository<SessionKey, Long> {

    SessionKey findByToken(String token);

    SessionKey findByUser(User user);

    @Query("select t from sessionkey t where t.endDate is null and user = ?1 and (t.expiryDate >= ?2 OR t.expiryDate is null))")
    SessionKey findByUser(User user, Date now);

    Stream<SessionKey> findAllByExpiryDateLessThan(Date now);

    void deleteByExpiryDateLessThan(Date now);

    @Modifying
    @Query("delete from sessionkey t where (t.endDate is not null OR t.expiryDate <= ?1)")
    void deleteAllExpiredSince(Date now);
}
