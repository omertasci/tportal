package org.omertasci.persistence.dao;

import org.omertasci.persistence.model.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DashboardRepository extends JpaRepository<Dashboard, Long> {

	Dashboard findByDashboardName(String dashboardName);

    @Override
    void delete(Dashboard role);

}
