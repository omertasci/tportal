package org.omertasci.web.dto;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.omertasci.validation.ValidEmail;
import org.omertasci.validation.ValidPassword;

public class RoleDto {
	@NotNull
    @Size(min = 1)
    private String name;

    @NotNull
    @Size(min = 1)
    private String displayName;

    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	@Override
    public String toString() {
        final StringBuilder builder = new StringBuilder();
        builder.append("RoleDto [firstName=").append(name).append(", lastName=").append(displayName).append("]");
        return builder.toString();
    }
    
}
