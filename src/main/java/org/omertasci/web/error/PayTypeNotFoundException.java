package org.omertasci.web.error;

public final class PayTypeNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 5861310537366287163L;

    public PayTypeNotFoundException() {
        super();
    }

    public PayTypeNotFoundException(final String message, final Throwable cause) {
        super(message, cause);
    }

    public PayTypeNotFoundException(final String message) {
        super(message);
    }

    public PayTypeNotFoundException(final Throwable cause) {
        super(cause);
    }

}
