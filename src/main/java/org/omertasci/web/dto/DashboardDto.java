package org.omertasci.web.dto;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.omertasci.persistence.model.Widget;
import org.omertasci.validation.PasswordMatches;
import org.omertasci.validation.ValidEmail;
import org.omertasci.validation.ValidPassword;

@PasswordMatches
public class DashboardDto {
    @NotNull
    @Size(min = 1)
    private String dashboardName;

    @NotNull
    @Size(min = 1)
    private List<WidgetDto> widgets;

    public String getDashboardName() {
		return dashboardName;
	}

	public void setDashboardName(String dashboardName) {
		this.dashboardName = dashboardName;
	}

	public List<WidgetDto> getWidgets() {
		return widgets;
	}

	public void setWidgets(List<WidgetDto> widgets) {
		this.widgets = widgets;
	}

	@Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("UserDto [firstName=").append("]");
        return builder.toString();
    }

}
