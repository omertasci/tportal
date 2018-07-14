package org.omertasci.web.dto;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.omertasci.persistence.model.Dashboard;
import org.omertasci.validation.PasswordMatches;
import org.omertasci.validation.ValidEmail;
import org.omertasci.validation.ValidPassword;

@PasswordMatches
public class WidgetDto {
    @NotNull
    @Size(min = 1)
    private String widgetName;
    
    @NotNull
    @Size(min = 1)
	private String aggregationType;

    @NotNull
    @Size(min = 1)
	private String valueType;

    @NotNull
    @Size(min = 1)
	private String categoryType;

    @NotNull
    @Size(min = 1)
	private String chartType;

    @NotNull
    @Size(min = 1)
	private String col;

    @NotNull
    @Size(min = 1)
	private String row;

    @NotNull
    @Size(min = 1)
	private String sizex;
	
    @NotNull
    @Size(min = 1)
	private String sizey;

    @NotNull
    @Size(min = 1)
	private String liHtml;

    @NotNull
    @Size(min = 1)
    private List<Dashboard> dashboards;
    
    @NotNull
    @Size(min = 1)
    private Date expiryDate;

    public String getWidgetName() {
		return widgetName;
	}

	public void setWidgetName(String widgetName) {
		this.widgetName = widgetName;
	}

	public String getAggregationType() {
		return aggregationType;
	}

	public void setAggregationType(String aggregationType) {
		this.aggregationType = aggregationType;
	}

	public String getValueType() {
		return valueType;
	}

	public void setValueType(String valueType) {
		this.valueType = valueType;
	}

	public String getCategoryType() {
		return categoryType;
	}

	public void setCategoryType(String categoryType) {
		this.categoryType = categoryType;
	}

	public String getChartType() {
		return chartType;
	}

	public void setChartType(String chartType) {
		this.chartType = chartType;
	}

	public String getCol() {
		return col;
	}

	public void setCol(String col) {
		this.col = col;
	}

	public String getRow() {
		return row;
	}

	public void setRow(String row) {
		this.row = row;
	}

	public String getSizex() {
		return sizex;
	}

	public void setSizex(String sizex) {
		this.sizex = sizex;
	}

	public String getSizey() {
		return sizey;
	}

	public void setSizey(String sizey) {
		this.sizey = sizey;
	}

	public String getLiHtml() {
		return liHtml;
	}

	public void setLiHtml(String liHtml) {
		this.liHtml = liHtml;
	}

	public List<Dashboard> getDashboards() {
		return dashboards;
	}

	public void setDashboards(List<Dashboard> dashboards) {
		this.dashboards = dashboards;
	}

	public Date getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(Date expiryDate) {
		this.expiryDate = expiryDate;
	}

	@Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("UserDto [firstName=").append("]");
        return builder.toString();
    }

}
