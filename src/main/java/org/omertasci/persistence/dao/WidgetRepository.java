package org.omertasci.persistence.dao;

import java.util.List;

import org.omertasci.persistence.model.Dashboard;
import org.omertasci.persistence.model.Widget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WidgetRepository extends JpaRepository<Widget, Long> {
   /*
    * Be carefull! the method name must contain a camel-case version of property field from Widget.java entity class.
    * For example: find method naming for aggregationType ---> findByAggregationType
    *              find method naming for createDate ---> findByCreateDate*/
	List<Widget> findByDashboards(Dashboard dashboard);
	
	Widget findByWidgetName(String name);
	Widget findByWidgetCounterId(int counterId);

    @Override
    void delete(Widget role);

}
