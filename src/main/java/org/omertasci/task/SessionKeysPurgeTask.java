package org.omertasci.task;

import org.omertasci.persistence.dao.SessionKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Date;

@Service
@Transactional
public class SessionKeysPurgeTask {

    @Autowired
    SessionKeyRepository sessionRepository;

    @Scheduled(cron = "${purge.cron.expression}")
    public void purgeExpired() {

        Date now = Date.from(Instant.now());

        sessionRepository.deleteAllExpiredSince(now);
    }
}