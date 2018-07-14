package org.omertasci.persistence.model;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity(name = "widget")
public class Widget {
	private static final int EXPIRATION = 60 * 24;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(name = "expdate")
	private Date expiryDate;

	@Column(name = "cdate", nullable = false)
	private Date createDate;

	@Column(name = "udate")
	private Date updateDate;

	@Column(name = "edate")
	private Date endDate;

	@Column(name = "widget_counter_id")
	private int widgetCounterId;
	
	@Column(name = "widget_name")
	private String widgetName;

	@Column(name = "serie_type")
	private String serieType;
	
	@Column(name = "aggregation_type")
	private String aggregationType;

	@Column(name = "value_type")
	private String valueType;

	@Column(name = "category_type")
	private String categoryType;
	
	@Column(name = "condition_string")
	private String conditionStr;

	@Column(name = "chart_type")
	private String chartType;

	@Column(name = "col")
	private String col;

	@Column(name = "row")
	private String row;

	@Column(name = "sizex")
	private String sizex;
	
	@Column(name = "sizey")
	private String sizey;

	@Column(name = "liHtml")
	@Lob
	private byte[] liHtml;

	@JsonIgnore
	@ManyToMany(mappedBy = "widgets", fetch=FetchType.EAGER)
	@Fetch(value = FetchMode.SUBSELECT)
    private List<Dashboard> dashboards;
	
	public Widget() {
		super();
	}

	public Widget(final List<Dashboard> dashboards, String token) {
		super();

		this.dashboards = dashboards;
		this.expiryDate = calculateExpiryDate(EXPIRATION);
		this.createDate = new Date();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public List<Dashboard> getDashboards() {
		return dashboards;
	}

	public void setDashboards(final List<Dashboard> dashboards) {
		this.dashboards = dashboards;
	}

	public Date getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(final Date expiryDate) {
		this.expiryDate = expiryDate;
	}

	private Date calculateExpiryDate(final int expiryTimeInMinutes) {
		final Calendar cal = Calendar.getInstance();
		cal.setTimeInMillis(new Date().getTime());
		cal.add(Calendar.MINUTE, expiryTimeInMinutes);
		return new Date(cal.getTime().getTime());
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public int getWidgetCounterId() {
		return widgetCounterId;
	}

	public void setWidgetCounterId(int widgetCounterId) {
		this.widgetCounterId = widgetCounterId;
	}

	public String getWidgetName() {
		return widgetName;
	}

	public void setWidgetName(String widgetName) {
		this.widgetName = widgetName;
	}

	public String getSerieType() {
		return serieType;
	}

	public void setSerieType(String serieType) {
		this.serieType = serieType;
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

	public String getConditionStr() {
		return conditionStr;
	}

	public void setConditionStr(String conditionStr) {
		this.conditionStr = conditionStr;
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

	@JsonSerialize(using= org.omertasci.web.util.ByteArraySerializer.class)
	public byte[] getLiHtml() {
		return liHtml;
	}

	public void setLiHtml(byte[] liHtml) {
		this.liHtml = liHtml;
	}


	@Override
	public String toString() {
		final StringBuilder builder = new StringBuilder();
		builder.append("User [id=").append(id).append(", widgetName=").append(widgetName).append(", aggregationType=").append(aggregationType).append(", valueType=").append(valueType).append(", categoryType=").append(categoryType).append(", chartType=").append(chartType).append("]");
		return builder.toString();
	}
}
