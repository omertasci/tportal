package org.omertasci.web.dom;

public class Referer {
	private String url;
	private String label;
	private String resource;

	public Referer(String url, String label, String resource) {
		this.url = url;
		this.label = label;
		this.resource = resource;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getResource() {
		return resource;
	}

	public void setResource(String resource) {
		this.resource = resource;
	}
}
