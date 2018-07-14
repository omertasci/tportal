package org.omertasci.persistence.model;

import javax.persistence.*;

import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity(name = "dashboard")
public class Dashboard {
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

	@Column(name = "dashboard_name")
	private String dashboardName;
	
	@ManyToMany
	@LazyCollection(LazyCollectionOption.FALSE)
	@JoinTable(name = "dashboards_widgets", joinColumns = @JoinColumn(name = "dashboard_id", referencedColumnName = "id"), inverseJoinColumns = @JoinColumn(name = "widget_id", referencedColumnName = "id"))
    private List<Widget> widgets;
	
	@JsonIgnore
	@OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	@JoinColumn(nullable = false, name = "user_id", foreignKey = @ForeignKey(name = "FK_DASHBOARD_USER_ID"))
	private User user;
	
	public Dashboard() {
		super();
	}

	public Dashboard(final User user, String token) {
		super();

		this.user = user;
		this.expiryDate = calculateExpiryDate(EXPIRATION);
		this.createDate = new Date();
	}

	public Long getId() {
		return id;
	}

	public String getDashboardName() {
		return dashboardName;
	}

	public void setDashboardName(String dashboardName) {
		this.dashboardName = dashboardName;
	}

	public User getUser() {
		return user;
	}

	public void setUser(final User user) {
		this.user = user;
	}

	public List<Widget> getWidgets() {
		return widgets;
	}

	public void setWidgets(List<Widget> widgets) {
		this.widgets = widgets;
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

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public String toString() {
		final StringBuilder builder = new StringBuilder();
		builder.append("User [id=").append(id).append(", dashboardName=").append(dashboardName).append(", userName=").append(user.getFirstName()+ user.getLastName()).append("]");
		return builder.toString();
	}
}
