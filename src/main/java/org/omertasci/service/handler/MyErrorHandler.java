package org.omertasci.service.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.web.client.ResponseErrorHandler;

import java.io.IOException;

public class MyErrorHandler implements ResponseErrorHandler {
    private final Logger LOGGER = LoggerFactory.getLogger(getClass());

    @Override
    public boolean hasError(ClientHttpResponse clientHttpResponse) throws IOException {
        LOGGER.error( "Application response has error : " + clientHttpResponse.getStatusCode() + " - " + clientHttpResponse.getStatusText());
        //return false to handle error response code and message
        return false;
    }

    @Override
    public void handleError(ClientHttpResponse clientHttpResponse) throws IOException {

    }
}
